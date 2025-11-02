const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const db = require('../db');

// Configurar multer para archivos de completación
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../archivosDocumento'));
    },
    filename: (req, file, cb) => {
        const nombre = (req.body.nombre || 'sin_nombre').trim().replace(/\s+/g, '_');
        const apellido = (req.body.apellido || 'sin_apellido').trim().replace(/\s+/g, '_');
        const dni = (req.body.dni || req.params.dni || 'sin_dni');
        const campo = file.fieldname;
        const ext = path.extname(file.originalname);
        
        const filename = `${nombre}_${apellido}_${dni}_${campo}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

const REGISTROS_PENDIENTES_PATH = path.join(__dirname, '..', 'data', 'Registros_Pendientes.json');

// Funciones auxiliares para domicilio
const buscarOInsertarProvincia = async (db, nombreProvincia) => {
    const [rows] = await db.query('SELECT * FROM provincias WHERE nombre = ?', [nombreProvincia]);
    if (rows.length > 0) return rows[0];
    const [result] = await db.query('INSERT INTO provincias (nombre) VALUES (?)', [nombreProvincia]);
    return { id: result.insertId, nombre: nombreProvincia };
};

const buscarOInsertarLocalidad = async (db, nombreLocalidad, idProvincia) => {
    const [rows] = await db.query('SELECT * FROM localidades WHERE nombre = ? AND idProvincia = ?', [nombreLocalidad, idProvincia]);
    if (rows.length > 0) return rows[0];
    const [result] = await db.query('INSERT INTO localidades (nombre, idProvincia) VALUES (?, ?)', [nombreLocalidad, idProvincia]);
    return { id: result.insertId, nombre: nombreLocalidad, idProvincia };
};

const buscarOInsertarBarrio = async (db, nombreBarrio, idLocalidad) => {
    const [rows] = await db.query('SELECT * FROM barrios WHERE nombre = ? AND idLocalidad = ?', [nombreBarrio, idLocalidad]);
    if (rows.length > 0) return rows[0];
    const [result] = await db.query('INSERT INTO barrios (nombre, idLocalidad) VALUES (?, ?)', [nombreBarrio, idLocalidad]);
    return { id: result.insertId, nombre: nombreBarrio, idLocalidad };
};

// POST: Completar documentación de registro pendiente y pasar a BD
router.post('/:dni', upload.any(), async (req, res) => {
    try {
        const { dni } = req.params;
        console.log(`✅ [COMPLETAR] Iniciando completación de documentación para DNI: ${dni}`);
        
        // Leer registros pendientes
        const data = await fs.readFile(REGISTROS_PENDIENTES_PATH, 'utf8');
        let registros = JSON.parse(data);
        
        // Buscar el registro pendiente
        const indiceRegistro = registros.findIndex(r => r.dni === dni);
        
        if (indiceRegistro === -1) {
            return res.status(404).json({
                success: false,
                message: `Registro pendiente con DNI ${dni} no encontrado`
            });
        }
        
        const registro = registros[indiceRegistro];
        
        // Verificar si ya existe en BD
        const [existenteRows] = await db.query('SELECT id FROM estudiantes WHERE dni = ?', [dni]);
        let idEstudianteExistente = null;
        let usarEstudianteExistente = false;
        if (existenteRows && existenteRows.length > 0) {
            idEstudianteExistente = existenteRows[0].id;
            usarEstudianteExistente = true;
            console.log(`[INFO] El DNI ${dni} ya existe en la BD (id=${idEstudianteExistente}). Se usará el estudiante existente y se intentará adjuntar documentación/inscripción.`);
        }
        
        // Procesar archivos nuevos
        const archivosNuevos = {};
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                archivosNuevos[file.fieldname] = `/archivosPendientes/${file.filename}`;
            });
        }

        // Combinar archivos existentes con nuevos
        const todosLosArchivos = {
            ...registro.archivos,
            ...archivosNuevos
        };

        // Validación completa usando la lógica de validación del backend
        const { obtenerDocumentosRequeridos } = require(path.join(__dirname, '../utils/obtenerDocumentosRequeridos.js'));
        const modalidad = registro.datos?.modalidad || registro.modalidad || '';
        const planAnio = registro.datos?.planAnio || registro.planAnio || '';
        const modulos = registro.datos?.modulos || registro.modulos || '';
        const requerimientos = obtenerDocumentosRequeridos(modalidad, planAnio, modulos);
        const documentosRequeridos = requerimientos.documentos;
        const documentosAlternativos = requerimientos.alternativos;

        // Validar documentos subidos
        let documentosSubidos = [];
        let documentosFaltantes = [];
        let validacionAlternativaOK = true;
        for (const doc of documentosRequeridos) {
            if (documentosAlternativos && (doc === documentosAlternativos.preferido || doc === documentosAlternativos.alternativa)) {
                const tienePreferido = !!todosLosArchivos[documentosAlternativos.preferido];
                const tieneAlternativa = !!todosLosArchivos[documentosAlternativos.alternativa];
                if (tienePreferido || tieneAlternativa) {
                    documentosSubidos.push(tienePreferido ? documentosAlternativos.preferido : documentosAlternativos.alternativa);
                } else {
                    documentosFaltantes.push(doc);
                    validacionAlternativaOK = false;
                }
                continue;
            }
            if (todosLosArchivos[doc]) {
                documentosSubidos.push(doc);
            } else {
                documentosFaltantes.push(doc);
            }
        }
        const cantidadSubidos = documentosSubidos.length;
        const totalDocumentos = documentosRequeridos.length;
        const esCompleto = (cantidadSubidos === totalDocumentos) && validacionAlternativaOK;

        if (!esCompleto) {
            // Si falta documentación, guardar los archivos nuevos en archivosPendientes
            const fsExtra = require('fs-extra');
            const carpetaPendientes = path.join(__dirname, '../archivosPendientes');
            await fsExtra.ensureDir(carpetaPendientes);
            const archivosPendientes = { ...registro.archivos };
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const nombreArchivo = file.filename;
                    const origen = path.join(__dirname, '../archivosPendientes', nombreArchivo);
                    const destino = path.join(carpetaPendientes, nombreArchivo);
                    try {
                        await fsExtra.copy(origen, destino);
                        archivosPendientes[file.fieldname] = `/archivosPendientes/${nombreArchivo}`;
                    } catch (err) {
                        console.warn(`⚠️ Error copiando archivo a pendientes: ${nombreArchivo}`, err.message);
                    }
                }
            }
            // Actualizar el registro pendiente con los nuevos archivos y estado
            registros[indiceRegistro].archivos = archivosPendientes;
            registros[indiceRegistro].estado = 'PENDIENTE';
            await fs.writeFile(REGISTROS_PENDIENTES_PATH, JSON.stringify(registros, null, 2));
            // Actualizar contador y estado en la respuesta
            return res.status(200).json({
                success: true,
                migradoAPendientes: true,
                migradoABaseDatos: false,
                message: 'Registrado en Pendientes de Inscripcion',
                documentosFaltantes,
                archivosPendientes,
                estado: 'PENDIENTE',
                contadorPendientes: registros.length
            });
        }
        
        // Extraer datos del registro
        const datos = registro.datos || registro;
        
        // 1. Crear domicilio (solo si vamos a crear estudiante nuevo)
        const provincia = datos.provincia || 'Córdoba';
        const localidad = datos.localidad || datos.ciudad || 'La Calera';
        const barrio = datos.barrio || 'Centro';
        const calle = datos.calle || datos.direccion || 'Sin especificar';
        const numero = parseInt(datos.numero || datos.numeroCalle || '0') || 0;
        
        let idDomicilio = null;
        if (!usarEstudianteExistente) {
            const provinciaResult = await buscarOInsertarProvincia(db, provincia);
            const localidadResult = await buscarOInsertarLocalidad(db, localidad, provinciaResult.id);
            const barrioResult = await buscarOInsertarBarrio(db, barrio, localidadResult.id);
            
            const [domicilioRes] = await db.query(
                'INSERT INTO domicilios (calle, numero, idBarrio, idLocalidad, idProvincia) VALUES (?,?,?,?,?)',
                [calle, numero, barrioResult.id, localidadResult.id, provinciaResult.id]
            );
            idDomicilio = domicilioRes.insertId;
        }
        
        // 2. Crear estudiante
        // Si la foto está en archivosPendientes, mover a archivosDocumento
        let fotoUrl = todosLosArchivos.foto || todosLosArchivos.archivo_foto || null;
        if (fotoUrl && fotoUrl.startsWith('/archivosPendientes/')) {
            const nombreArchivo = fotoUrl.split('/').pop();
            const origen = path.join(__dirname, '../archivosPendientes', nombreArchivo);
            const destino = path.join(__dirname, '../archivosDocumento', nombreArchivo);
            const fsExtra = require('fs-extra');
            try {
                await fsExtra.copy(origen, destino);
                fotoUrl = `/archivosDocumento/${nombreArchivo}`;
                    // Intentar eliminar el archivo original en archivosPendientes si existe
                    try {
                        const origenPend = path.join(__dirname, '../archivosPendientes', nombreArchivo);
                        await fsExtra.remove(origenPend);
                        console.log(`🧹 Eliminado archivo pendiente original: ${nombreArchivo}`);
                    } catch (rmErr) {
                        console.warn(`⚠️ No se pudo eliminar archivo pendiente original ${nombreArchivo}:`, rmErr.message);
                    }
            } catch (err) {
                console.warn(`⚠️ Error moviendo foto a archivosDocumento: ${nombreArchivo}`, err.message);
            }
        }
        const fechaNacimiento = datos.fechaNacimiento || null;
        
        // 2. Crear estudiante si no existe; si existe, usar su id
        let idEstudiante = idEstudianteExistente;
        if (!usarEstudianteExistente) {
            const [estRes] = await db.query(
                `INSERT INTO estudiantes
                 (nombre, apellido, tipoDocumento, paisEmision, dni, cuil, email, telefono, fechaNacimiento, foto, idDomicilio, idUsuarios)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    datos.nombre,
                    datos.apellido, 
                    datos.tipoDocumento || 'DNI',
                    datos.paisEmision || 'Argentina',
                    dni,
                    datos.cuil || null,
                    datos.email || null,
                    datos.telefono || null,
                    fechaNacimiento,
                    fotoUrl,
                    idDomicilio,
                    null
                ]
            );
            idEstudiante = estRes.insertId;
        }
        
        // 3. Crear o reutilizar inscripción (APROBADO)
        const modalidadId = parseInt(datos.modalidadId) || 1;
        const planAnioId = parseInt(datos.planAnio) || 1;
        const modulosId = parseInt(datos.idModulo) || 1;
        const idEstadoInscripcion = 2; // APROBADO

        // Validar existencia en tablas referenciadas
        const [[modalidadExiste]] = await db.query('SELECT id FROM modalidades WHERE id = ?', [modalidadId]);
        if (!modalidadExiste) {
            return res.status(400).json({
                success: false,
                message: `La modalidad seleccionada (${modalidadId}) no existe en la base de datos.`
            });
        }
        const [[planExiste]] = await db.query('SELECT id FROM anio_plan WHERE id = ?', [planAnioId]);
        if (!planExiste) {
            return res.status(400).json({
                success: false,
                message: `El año/plan seleccionado (${planAnioId}) no existe en la base de datos.`
            });
        }
        const [[moduloExiste]] = await db.query('SELECT id FROM modulos WHERE id = ?', [modulosId]);
        if (!moduloExiste) {
            return res.status(400).json({
                success: false,
                message: `El módulo seleccionado (${modulosId}) no existe en la base de datos.`
            });
        }

        // Verificar si ya existe una inscripción para este estudiante con la misma modalidad/plan/modulo
        let idInscripcion = null;
        try {
            const [inscripcionesExistentes] = await db.query(
                'SELECT id AS idInscripcion FROM inscripciones WHERE idEstudiante = ? AND idModalidad = ? AND idAnioPlan = ? AND idModulos = ? LIMIT 1',
                [idEstudiante, modalidadId, planAnioId, modulosId]
            );
            if (inscripcionesExistentes && inscripcionesExistentes.length > 0) {
                idInscripcion = inscripcionesExistentes[0].idInscripcion;
                console.log(`[INFO] Ya existe inscripción para estudiante ${idEstudiante}: idInscripcion=${idInscripcion}`);
            } else {
                const [inscRes] = await db.query(
                    'INSERT INTO inscripciones (idEstudiante, idModalidad, idAnioPlan, idModulos, idEstadoInscripcion, fechaInscripcion) VALUES (?, ?, ?, ?, ?, CURDATE())',
                    [idEstudiante, modalidadId, planAnioId, modulosId, idEstadoInscripcion]
                );
                idInscripcion = inscRes.insertId;
            }
        } catch (insErr) {
            console.error('Error verificando/creando inscripción:', insErr.message);
            return res.status(500).json({ success: false, userMessage: 'Error al crear o verificar la inscripción en la base de datos.', technical: insErr.message });
        }
        
        // 4. Guardar archivos en BD
        const fsExtra = require('fs-extra');
        // Asegurarnos de que la tabla `archivos_estudiantes` exista (evita errores si el esquema no fue aplicado)
        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS archivos_estudiantes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    idEstudiante INT NOT NULL,
                    tipoArchivo VARCHAR(100),
                    rutaArchivo VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX (idEstudiante)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `);
        } catch (createErr) {
            console.error('Error creando/verificando tabla archivos_estudiantes:', createErr.message);
            // No abortamos inmediatamente: permitimos que se inserten los demás datos, pero avisamos en logs
        }
        for (const [campo, rutaArchivo] of Object.entries(todosLosArchivos)) {
            if (rutaArchivo && campo.startsWith('archivo_') || campo === 'foto') {
                try {
                    // Copiar archivo a archivosDocumento si no está allí
                    const nombreArchivo = rutaArchivo.split('/').pop();
                    const origen = rutaArchivo.startsWith('/archivosDocWeb/')
                        ? path.join(__dirname, '../archivosDocWeb', nombreArchivo)
                        : rutaArchivo.startsWith('/archivosPendientes/')
                            ? path.join(__dirname, '../archivosPendientes', nombreArchivo)
                            : null;
                    const destino = path.join(__dirname, '../archivosDocumento', nombreArchivo);
                    if (origen && origen !== destino) {
                        try {
                            await fsExtra.copy(origen, destino);
                            console.log(`📁 Copiado ${nombreArchivo} a archivosDocumento`);
                            // Intentar eliminar el archivo pendiente original
                            try {
                                const origenPend = path.join(__dirname, '../archivosPendientes', nombreArchivo);
                                await fsExtra.remove(origenPend);
                                console.log(`🧹 Eliminado archivo pendiente original: ${nombreArchivo}`);
                            } catch (rmErr) {
                                console.warn(`⚠️ No se pudo eliminar archivo pendiente original ${nombreArchivo}:`, rmErr.message);
                            }
                        } catch (copyError) {
                            console.warn(`⚠️ Error copiando archivo ${nombreArchivo}:`, copyError.message);
                        }
                    }
                    // Guardar ruta en archivos_estudiantes
                    await db.query(
                        'INSERT INTO archivos_estudiantes (idEstudiante, tipoArchivo, rutaArchivo) VALUES (?, ?, ?)',
                        [idEstudiante, campo, `/archivosDocumento/${nombreArchivo}`]
                    );

                    // Mapeo explícito igual al frontend
                    const DocumentacionNameToId = {
                      archivo_dni: 1,
                      archivo_cuil: 2,
                      archivo_fichaMedica: 3,
                      archivo_partidaNacimiento: 4,
                      archivo_solicitudPase: 5,
                      archivo_analiticoParcial: 6,
                      archivo_certificadoNivelPrimario: 7,
                      foto: 8,
                    };
                    const idDocumentaciones = DocumentacionNameToId[campo];
                    if (idDocumentaciones) {
                        await db.query(
                            'INSERT INTO detalle_inscripcion (estadoDocumentacion, fechaEntrega, idDocumentaciones, idInscripcion, archivoDocumentacion) VALUES (?, CURDATE(), ?, ?, ?)',
                            ['Entregado', idDocumentaciones, idInscripcion, `/archivosDocumento/${nombreArchivo}`]
                        );
                    }
                } catch (archivoError) {
                    console.warn(`⚠️ Error guardando archivo ${campo}:`, archivoError.message);
                }
            }
        }
        
        // 5. Eliminar el registro pendiente del JSON
        const registroEliminado = registros.splice(indiceRegistro, 1)[0];
        await fs.writeFile(REGISTROS_PENDIENTES_PATH, JSON.stringify(registros, null, 2));

        // 6. Intentar actualizar un posible registro web que correspondiera a este DNI
        // Hacemos esto antes de responder para que el cliente (GestorRegistrosWeb) vea el cambio inmediatamente
        let registroWebActualizado = null;
        try {
            const REGISTROS_WEB_PATH = path.join(__dirname, '..', 'data', 'Registro_Web.json');
            const rawWeb = await fs.readFile(REGISTROS_WEB_PATH, 'utf8');
            let registrosWeb = JSON.parse(rawWeb || '[]');
            let changed = false;
            registrosWeb = registrosWeb.map(rw => {
                try {
                    const rwDni = rw?.datos?.dni || rw?.dni;
                    if (rwDni && String(rwDni) === String(dni)) {
                        changed = true;
                        const updated = {
                            ...rw,
                            estado: 'PROCESADO_Y_APROBADO',
                            fechaProcesado: new Date().toISOString(),
                            archivos: todosLosArchivos || rw.archivos || {},
                            datos: { ...rw.datos, ...datos }
                        };
                        registroWebActualizado = updated;
                        return updated;
                    }
                } catch (e) {
                    // ignore per-record errors
                }
                return rw;
            });
            if (changed) {
                await fs.writeFile(REGISTROS_WEB_PATH, JSON.stringify(registrosWeb, null, 2));
                console.log(`🔄 Registro Web actualizado para DNI ${dni} (marcado PROCESADO_Y_APROBADO)`);
            }
        } catch (webErr) {
            console.warn('⚠️ No se pudo actualizar Registro_Web.json:', webErr.message);
        }

        console.log(`✅ [COMPLETAR] Estudiante ${datos.nombre} ${datos.apellido} (DNI: ${dni}) registrado y eliminado de pendientes`);

        // 7. Responder al cliente indicando éxito. Mantener el estado claro de la operación
        res.json({
            success: true,
            migradoABaseDatos: true,
            migradoAPendientes: false,
            message: 'Registrado correctamente en el sistema y eliminado de registros pendientes',
            // Normalizado: devolvemos el nuevo estado estándar
            estado: 'PROCESADO_Y_APROBADO',
            estudiante: {
                id: idEstudiante,
                nombre: datos.nombre,
                apellido: datos.apellido,
                dni: dni,
                inscripcionId: idInscripcion
            },
            registroPendiente: registroEliminado,
            registroWebActualizado
        });
        
    } catch (error) {
        console.error('Error completando documentación:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            userMessage: 'Ocurrió un error al completar la documentación. Revise los datos e intente nuevamente, o contacte al equipo técnico.',
            technical: error.message
        });
    }
});

module.exports = router;