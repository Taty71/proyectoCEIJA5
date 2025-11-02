const { leerRegistrosPendientes, guardarRegistrosPendientes, detectarArchivosDisponibles, migrarArchivosRegistro } = require('./fileManager');
const { validarDocumentacion, generarMensajePendiente } = require('./documentValidator');
const { insertarEstudianteCompleto, verificarEstudianteExistente } = require('./databaseManager');

// Controlador: Obtener todos los registros pendientes
const obtenerTodosLosRegistros = async (req, res) => {
    const db = require('../../db');
    
    try {
        console.log('📋 [GET] Solicitando todos los registros pendientes');
        const registros = await leerRegistrosPendientes();
        
        // Sincronización automática de estados
        let actualizados = 0;
        for (let i = 0; i < registros.length; i++) {
            const registro = registros[i];
            
            // Solo verificar registros PENDIENTES o PROCESADOS
            if (registro.estado === 'PENDIENTE' || registro.estado === 'PROCESADO') {
                try {
                    const [rows] = await db.query('SELECT id FROM estudiantes WHERE dni = ?', [registro.dni]);
                    
                    if (rows && rows.length > 0) {
                        const idEstudiante = rows[0].id;
                        
                        // Verificar inscripciones
                        const [inscripciones] = await db.query(`
                            SELECT ei.descripcionEstado as estado
                            FROM inscripciones i 
                            JOIN estado_inscripciones ei ON i.idEstadoInscripcion = ei.id
                            WHERE i.idEstudiante = ?
                        `, [idEstudiante]);
                        
                        // Contar documentos
                        const [documentos] = await db.query(`
                            SELECT COUNT(*) as total FROM archivos_estudiantes WHERE idEstudiante = ?
                        `, [idEstudiante]);
                        
                        const totalDocumentos = documentos[0]?.total || 0;
                        let necesitaActualizacion = false;
                        
                        // Actualizar a PROCESADO si está PENDIENTE
                        if (registro.estado === 'PENDIENTE') {
                            registro.estado = 'PROCESADO';
                            registro.idEstudiante = idEstudiante;
                            registro.fechaProcesado = new Date().toISOString();
                            necesitaActualizacion = true;
                        }
                        
                        // Actualizar a APROBADO si cumple condiciones
                        if (inscripciones.length > 0 && totalDocumentos >= 5) {
                            const estadoInscripcion = inscripciones[0].estado;
                            if (estadoInscripcion === 'aprobado' || estadoInscripcion === 'procesado') {
                                registro.estado = 'APROBADO';
                                registro.fechaAprobado = new Date().toISOString();
                                necesitaActualizacion = true;
                            }
                        }
                        
                        if (necesitaActualizacion) {
                            actualizados++;
                        }
                    }
                } catch (dbError) {
                    console.warn(`⚠️ [SYNC] Error verificando DNI ${registro.dni}:`, dbError.message);
                }
            }
        }
        
        // Guardar cambios si hay actualizaciones
        if (actualizados > 0) {
            await guardarRegistrosPendientes(registros);
            console.log(`🔄 [SYNC] ${actualizados} registros sincronizados automáticamente`);
        }
        
        console.log(`✅ [GET] Enviando ${registros.length} registros pendientes`);
        res.json(registros);
    } catch (error) {
        console.error('❌ [GET] Error al obtener registros:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener registros pendientes', 
            error: error.message 
        });
    }
};

// Controlador: Obtener un registro por DNI
const obtenerRegistroPorDni = async (req, res) => {
    const db = require('../../db');
    
    try {
        const { dni } = req.params;
        console.log(`🔍 [GET] Buscando registro con DNI: ${dni}`);
        
        const registros = await leerRegistrosPendientes();
        let registro = registros.find(r => r.dni === dni);
        let indiceRegistro = registros.findIndex(r => r.dni === dni);
        
        if (!registro) {
            console.log(`❌ [GET] Registro no encontrado para DNI: ${dni}`);
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        
        // Verificar si el estudiante existe en la base de datos y sincronizar estado
        const [rows] = await db.query('SELECT id FROM estudiantes WHERE dni = ?', [dni]);
        
        if (rows && rows.length > 0) {
            const idEstudiante = rows[0].id;
            
            // Verificar inscripciones y documentación
            const [inscripciones] = await db.query(`
                SELECT i.id as idInscripcion, ei.descripcionEstado as estado,
                       m.descripcionModalidad as modalidad, ap.descripcionPlan as plan
                FROM inscripciones i 
                JOIN estado_inscripciones ei ON i.idEstadoInscripcion = ei.id
                LEFT JOIN modalidades m ON i.idModalidad = m.id
                LEFT JOIN anio_plan ap ON i.idAnioPlan = ap.id
                WHERE i.idEstudiante = ?
            `, [idEstudiante]);
            
            // Obtener documentos de la base de datos
            const [documentos] = await db.query(`
                SELECT ae.tipo_archivo, ae.ruta_archivo, ae.fecha_subida
                FROM archivos_estudiantes ae
                WHERE ae.idEstudiante = ?
            `, [idEstudiante]);
            
            // Actualizar registro si es necesario
            let necesitaActualizacion = false;
            if (registro.estado === 'PENDIENTE') {
                registro.estado = 'PROCESADO';
                registro.idEstudiante = idEstudiante;
                registro.fechaProcesado = new Date().toISOString();
                necesitaActualizacion = true;
                console.log(`🔄 [SYNC] Actualizando estado de ${registro.datos.nombre} ${registro.datos.apellido} a PROCESADO`);
            }
            
            // Verificar si debe pasar a APROBADO
            if (inscripciones.length > 0 && documentos.length >= 5) {
                const estadoInscripcion = inscripciones[0].estado;
                if (estadoInscripcion === 'aprobado' || estadoInscripcion === 'procesado') {
                    registro.estado = 'APROBADO';
                    registro.fechaAprobado = new Date().toISOString();
                    necesitaActualizacion = true;
                    console.log(`✅ [SYNC] Actualizando estado de ${registro.datos.nombre} ${registro.datos.apellido} a APROBADO`);
                }
            }
            
            // Agregar información de la base de datos
            registro.datosBaseDatos = {
                idEstudiante,
                inscripciones: inscripciones,
                documentos: documentos.map(doc => ({
                    tipo: doc.tipo_archivo,
                    archivo: doc.ruta_archivo,
                    fechaSubida: doc.fecha_subida
                })),
                estadoInscripcion: inscripciones.length > 0 ? inscripciones[0].estado : null
            };
            
            // Guardar cambios si es necesario
            if (necesitaActualizacion) {
                registros[indiceRegistro] = registro;
                await guardarRegistrosPendientes(registros);
            }
            
        } else {
            // Si no está en BD, detectar archivos disponibles en archivosPendientes
            const archivosDisponibles = await detectarArchivosDisponibles(registro);
            registro.archivosDisponibles = archivosDisponibles;
        }
        
        console.log(`✅ [GET] Registro encontrado para DNI: ${dni} - Estado: ${registro.estado}`);
        res.json(registro);
        
    } catch (error) {
        console.error('❌ [GET] Error al obtener registro:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener el registro', 
            error: error.message 
        });
    }
};

// Controlador: Crear nuevo registro pendiente
const crearRegistroPendiente = async (req, res) => {
    try {
        console.log('📝 [POST] Creando nuevo registro pendiente');
        console.log('📋 [POST] Datos recibidos:', req.body);
        console.log('📎 [POST] Archivos recibidos:', req.files?.map(f => f.filename));
        
        const datos = req.body;
        
        // Validaciones básicas
        if (!datos.dni || !datos.nombre || !datos.apellido) {
            console.log('❌ [POST] Faltan datos obligatorios');
            return res.status(400).json({ 
                mensaje: 'Faltan datos obligatorios (DNI, nombre, apellido)' 
            });
        }
        
        // Verificar si ya existe un registro con este DNI
        const registrosExistentes = await leerRegistrosPendientes();
        const yaExiste = registrosExistentes.find(r => r.dni === datos.dni);
        
        if (yaExiste) {
            console.log(`⚠️  [POST] Ya existe un registro con DNI: ${datos.dni}`);
            return res.status(409).json({ 
                mensaje: 'Ya existe un registro con este DNI' 
            });
        }
        
        // Crear registro de archivos subidos
        const archivos = {};
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                archivos[file.fieldname] = `/archivosPendientes/${file.filename}`;
            });
        }
        
        // Crear nuevo registro
        const nuevoRegistro = {
            dni: datos.dni,
            timestamp: new Date().toISOString(),
            fechaRegistro: new Date().toLocaleDateString('es-AR'),
            horaRegistro: new Date().toTimeString().split(' ')[0],
            tipo: datos.origenWeb ? 'REGISTRO_WEB_PENDIENTE' : 'REGISTRO_PENDIENTE',
            estado: 'PENDIENTE',
            datos: datos,
            archivos: archivos,
            observaciones: `Registro pendiente creado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toTimeString().split(' ')[0]}`,
            modalidadId: datos.modalidadId,
            planAnioId: datos.planAnio
        };
        
        // Si es de origen web, agregar información adicional
        if (datos.origenWeb) {
            nuevoRegistro.origenWeb = true;
            nuevoRegistro.idRegistroWebOriginal = datos.idRegistroWebOriginal;
        }
        
        // Agregar el nuevo registro
        registrosExistentes.push(nuevoRegistro);
        await guardarRegistrosPendientes(registrosExistentes);
        
        console.log(`✅ [POST] Registro pendiente creado exitosamente para DNI: ${datos.dni}`);
        res.status(201).json({ 
            mensaje: 'Registro pendiente creado exitosamente',
            registro: nuevoRegistro
        });
        
    } catch (error) {
        console.error('❌ [POST] Error al crear registro:', error);
        res.status(500).json({ 
            mensaje: 'Error al crear el registro pendiente', 
            error: error.message 
        });
    }
};

// Controlador: Actualizar registro pendiente
const actualizarRegistroPendiente = async (req, res) => {
    try {
        const { dni } = req.params;
        const datosActualizados = req.body;
        
        console.log(`📝 [PUT] Actualizando registro con DNI: ${dni}`);
        
        const registros = await leerRegistrosPendientes();
        const indiceRegistro = registros.findIndex(r => r.dni === dni);
        
        if (indiceRegistro === -1) {
            console.log(`❌ [PUT] Registro no encontrado para DNI: ${dni}`);
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        
        // Actualizar datos manteniendo la estructura original
        registros[indiceRegistro] = {
            ...registros[indiceRegistro],
            datos: { ...registros[indiceRegistro].datos, ...datosActualizados },
            fechaActualizacion: new Date().toISOString()
        };
        
        await guardarRegistrosPendientes(registros);
        
        console.log(`✅ [PUT] Registro actualizado exitosamente para DNI: ${dni}`);
        res.json({ 
            mensaje: 'Registro actualizado exitosamente',
            registro: registros[indiceRegistro]
        });
        
    } catch (error) {
        console.error('❌ [PUT] Error al actualizar registro:', error);
        res.status(500).json({ 
            mensaje: 'Error al actualizar el registro', 
            error: error.message 
        });
    }
};

// Controlador: Eliminar registro pendiente
const eliminarRegistroPendiente = async (req, res) => {
    try {
        const { dni } = req.params;
        console.log(`🗑️  [DELETE] Eliminando registro con DNI: ${dni}`);
        
        const registros = await leerRegistrosPendientes();
        const indiceRegistro = registros.findIndex(r => r.dni === dni);
        
        if (indiceRegistro === -1) {
            console.log(`❌ [DELETE] Registro no encontrado para DNI: ${dni}`);
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        
        // Eliminar el registro
        const registroEliminado = registros.splice(indiceRegistro, 1)[0];
        await guardarRegistrosPendientes(registros);
        
        console.log(`✅ [DELETE] Registro eliminado exitosamente para DNI: ${dni}`);
        res.json({ 
            mensaje: 'Registro eliminado exitosamente',
            registro: registroEliminado
        });
        
    } catch (error) {
        console.error('❌ [DELETE] Error al eliminar registro:', error);
        res.status(500).json({ 
            mensaje: 'Error al eliminar el registro', 
            error: error.message 
        });
    }
};

// Controlador: Obtener estadísticas
const obtenerEstadisticas = async (req, res) => {
    try {
        console.log('📊 [GET] Obteniendo estadísticas de registros pendientes');
        
        const registros = await leerRegistrosPendientes();
        
        const estadisticas = {
            total: registros.length,
            porEstado: {},
            porModalidad: {},
            porTipo: {}
        };
        
        registros.forEach(registro => {
            // Por estado
            estadisticas.porEstado[registro.estado] = (estadisticas.porEstado[registro.estado] || 0) + 1;
            
            // Por modalidad
            const modalidad = registro.datos.modalidad || 'Sin especificar';
            estadisticas.porModalidad[modalidad] = (estadisticas.porModalidad[modalidad] || 0) + 1;
            
            // Por tipo
            estadisticas.porTipo[registro.tipo] = (estadisticas.porTipo[registro.tipo] || 0) + 1;
        });
        
        console.log('✅ [GET] Estadísticas generadas exitosamente');
        res.json(estadisticas);
        
    } catch (error) {
        console.error('❌ [GET] Error al obtener estadísticas:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener estadísticas', 
            error: error.message 
        });
    }
};

// Controlador: Procesar registro pendiente
const procesarRegistroPendiente = async (req, res) => {
    try {
        const { dni } = req.body;
        
        if (!dni) {
            return res.status(400).json({ mensaje: 'DNI es requerido' });
        }
        
        console.log(`\n🔄 [PROCESAR] Iniciando procesamiento de registro con DNI: ${dni}`);
        
        // 1. Buscar el registro
        const registros = await leerRegistrosPendientes();
        const indiceRegistro = registros.findIndex(r => r.dni === dni);
        
        if (indiceRegistro === -1) {
            console.log(`❌ [PROCESAR] Registro no encontrado para DNI: ${dni}`);
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        
        const registro = registros[indiceRegistro];
        console.log(`📋 [PROCESAR] Registro encontrado: ${registro.datos.nombre} ${registro.datos.apellido}`);
        
        // 2. Verificar si el estudiante ya existe en la base de datos
        const estudianteExistente = await verificarEstudianteExistente(dni);
        if (estudianteExistente) {
            console.log(`⚠️  [PROCESAR] El estudiante con DNI ${dni} ya existe en la base de datos`);
            return res.status(409).json({ 
                mensaje: 'El estudiante ya existe en la base de datos',
                idEstudiante: estudianteExistente.id
            });
        }
        
        // 3. Detectar archivos disponibles (incluye los del registro + los encontrados en carpeta)
        const archivosDisponibles = await detectarArchivosDisponibles(registro);
        console.log(`📁 [PROCESAR] Archivos disponibles:`, Object.keys(archivosDisponibles));
        
        // 4. Validar documentación usando la lógica universal
        const modalidadId = parseInt(registro.modalidadId || registro.datos.modalidadId);
        const planAnioId = parseInt(registro.planAnioId || registro.datos.planAnio);
        
        const resultadoValidacion = validarDocumentacion(modalidadId, planAnioId, archivosDisponibles);
        
        if (!resultadoValidacion.documentacionCompleta) {
            // Actualizar el registro como PENDIENTE con mensaje informativo
            registro.estado = 'PENDIENTE';
            registro.motivoPendiente = generarMensajePendiente(resultadoValidacion, registro);
            registro.fechaActualizacion = new Date().toISOString();
            
            // Actualizar los archivos disponibles en el registro
            registro.archivos = { ...registro.archivos, ...archivosDisponibles };
            
            registros[indiceRegistro] = registro;
            await guardarRegistrosPendientes(registros);
            
            console.log(`⚠️  [PROCESAR] Documentación incompleta - registro queda PENDIENTE`);
            return res.json({
                mensaje: 'Documentación incompleta',
                estado: 'PENDIENTE',
                detalles: resultadoValidacion,
                motivoPendiente: registro.motivoPendiente,
                registro: registro
            });
        }
        
        // 5. Migrar archivos a archivosDocumento
        console.log(`📦 [PROCESAR] Migrando archivos...`);
        const archivosMigrados = await migrarArchivosRegistro(registro, archivosDisponibles);
        
        // 6. Insertar en la base de datos
        console.log(`💾 [PROCESAR] Insertando en base de datos...`);
        const resultadoInsercion = await insertarEstudianteCompleto(registro, archivosMigrados);
        
        // 7. Actualizar registro como PROCESADO
        registro.estado = 'PROCESADO';
        registro.fechaProcesado = new Date().toISOString();
        registro.idEstudiante = resultadoInsercion.idEstudiante;
        registro.archivos = archivosMigrados;
        delete registro.motivoPendiente; // Eliminar mensaje de pendiente si existía
        
        registros[indiceRegistro] = registro;
        await guardarRegistrosPendientes(registros);
        
        console.log(`🎉 [PROCESAR] Registro procesado exitosamente - ID Estudiante: ${resultadoInsercion.idEstudiante}`);
        
        res.json({
            mensaje: 'Registro procesado exitosamente',
            estado: 'PROCESADO',
            idEstudiante: resultadoInsercion.idEstudiante,
            detalles: resultadoValidacion,
            registro: registro
        });
        
    } catch (error) {
        console.error('❌ [PROCESAR] Error al procesar registro:', error);
        res.status(500).json({ 
            mensaje: 'Error al procesar el registro', 
            error: error.message 
        });
    }
};

module.exports = {
    obtenerTodosLosRegistros,
    obtenerRegistroPorDni,
    crearRegistroPendiente,
    actualizarRegistroPendiente,
    eliminarRegistroPendiente,
    obtenerEstadisticas,
    procesarRegistroPendiente
};