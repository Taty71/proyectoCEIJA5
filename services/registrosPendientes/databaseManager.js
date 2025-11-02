const db = require('../../db');

// Utilidades para manejo de ubicaciones
const buscarOInsertarProvincia = require('../../utils/buscarOInsertarProvincia');
const buscarOInsertarLocalidad = require('../../utils/buscarOInsertarLocalidad');  
const buscarOInsertarBarrio = require('../../utils/buscarOInsertarBarrio');

// Función para insertar estudiante completo en la base de datos
const insertarEstudianteCompleto = async (registro, archivosMigrados, connection = null) => {
    const conn = connection || db;
    
    try {
        console.log('\n🗄️  [BD] Iniciando inserción de estudiante completo...');
        
        // 1. Insertar domicilio
        console.log('📍 [BD] Insertando domicilio...');
        const domicilioResult = await conn.query(
            'INSERT INTO domicilios (calle, numero, barrio_id, localidad_id, provincia_id) VALUES (?, ?, ?, ?, ?)',
            [
                registro.datos.calle,
                registro.datos.numero,
                parseInt(registro.datos.barrio),
                parseInt(registro.datos.localidad),
                parseInt(registro.datos.provincia)
            ]
        );
        
        const idDomicilio = domicilioResult.insertId;
        console.log(`✅ [BD] Domicilio insertado con ID: ${idDomicilio}`);
        
        // 2. Insertar estudiante
        console.log('👤 [BD] Insertando estudiante...');
        const estudianteResult = await conn.query(
            `INSERT INTO estudiantes (
                dni, cuil, nombre, apellido, email, telefono, fecha_nacimiento,
                tipo_documento, pais_emision, idDomicilio, administrador,
                fecha_registro, hora_registro
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                registro.dni,
                registro.datos.cuil,
                registro.datos.nombre,
                registro.datos.apellido,
                registro.datos.email,
                registro.datos.telefono,
                registro.datos.fechaNacimiento,
                registro.datos.tipoDocumento,
                registro.datos.paisEmision,
                idDomicilio,
                registro.datos.administrador,
                registro.fechaRegistro,
                registro.horaRegistro
            ]
        );
        
        const idEstudiante = estudianteResult.insertId;
        console.log(`✅ [BD] Estudiante insertado con ID: ${idEstudiante}`);
        
        // 3. Insertar archivos del estudiante
        console.log('📁 [BD] Insertando archivos del estudiante...');
        for (const [campo, rutaArchivo] of Object.entries(archivosMigrados)) {
            if (rutaArchivo) {
                await conn.query(
                    'INSERT INTO archivos_estudiantes (idEstudiante, tipo_archivo, ruta_archivo, fecha_subida) VALUES (?, ?, ?, NOW())',
                    [idEstudiante, campo, rutaArchivo]
                );
                console.log(`   ✅ [BD] Archivo ${campo}: ${rutaArchivo}`);
            }
        }
        
        // 4. Insertar inscripción
        console.log('📝 [BD] Insertando inscripción...');
        const inscripcionResult = await conn.query(
            `INSERT INTO inscripciones (
                idEstudiante, modalidad_id, fecha_inscripcion, idEstadoInscripcion, administrador
            ) VALUES (?, ?, NOW(), 1, ?)`, // idEstadoInscripcion = 1 (pendiente)
            [idEstudiante, parseInt(registro.modalidadId || registro.datos.modalidadId), registro.datos.administrador]
        );
        
        const idInscripcion = inscripcionResult.insertId;
        console.log(`✅ [BD] Inscripción insertada con ID: ${idInscripcion}`);
        
        // 5. Insertar detalle de inscripción
        console.log('📋 [BD] Insertando detalle de inscripción...');
        await conn.query(
            `INSERT INTO detalle_inscripcion (
                inscripcion_id, plan_anio_id, fecha_detalle
            ) VALUES (?, ?, NOW())`,
            [idInscripcion, parseInt(registro.planAnioId || registro.datos.planAnio)]
        );
        
        console.log('✅ [BD] Detalle de inscripción insertado');
        console.log(`🎉 [BD] Estudiante completo procesado exitosamente - ID: ${idEstudiante}`);
        
        return {
            idEstudiante,
            idDomicilio,
            idInscripcion
        };
        
    } catch (error) {
        console.error('❌ [BD] Error en inserción completa:', error);
        throw error;
    }
};

// Función para verificar si un estudiante ya existe
const verificarEstudianteExistente = async (dni) => {
    try {
        const result = await db.query('SELECT id FROM estudiantes WHERE dni = ?', [dni]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('❌ [BD] Error al verificar estudiante existente:', error);
        throw error;
    }
};

// Función para obtener ubicaciones procesadas
const procesarUbicaciones = async (datos) => {
    try {
        console.log('🌍 [BD] Procesando ubicaciones...');
        
        // Buscar o insertar provincia
        const provincia = await buscarOInsertarProvincia(datos.provincia);
        console.log(`   - Provincia: ${provincia.nombre} (ID: ${provincia.id})`);
        
        // Buscar o insertar localidad
        const localidad = await buscarOInsertarLocalidad(datos.localidad, provincia.id);
        console.log(`   - Localidad: ${localidad.nombre} (ID: ${localidad.id})`);
        
        // Buscar o insertar barrio
        const barrio = await buscarOInsertarBarrio(datos.barrio, localidad.id);
        console.log(`   - Barrio: ${barrio.nombre} (ID: ${barrio.id})`);
        
        return {
            provincia,
            localidad,
            barrio
        };
    } catch (error) {
        console.error('❌ [BD] Error al procesar ubicaciones:', error);
        throw error;
    }
};

module.exports = {
    insertarEstudianteCompleto,
    verificarEstudianteExistente,
    procesarUbicaciones
};