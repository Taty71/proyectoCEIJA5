const fs = require('fs').promises;
const path = require('path');
const db = require('./db');

async function migrarArchivosPatricia() {
    try {
        console.log('🔄 Iniciando migración de archivos para Patricia Machado...');
        
        // DNI de Patricia
        const dniPatricia = '45125874';
        
        // 1. Buscar estudiante en BD
        const [estudiantes] = await db.query('SELECT id FROM estudiantes WHERE dni = ?', [dniPatricia]);
        
        if (estudiantes.length === 0) {
            console.error('❌ Patricia Machado no encontrada en BD');
            return;
        }
        
        const idEstudiante = estudiantes[0].id;
        console.log(`✅ Patricia Machado encontrada - ID: ${idEstudiante}`);
        
        // 2. Buscar inscripción
        const [inscripciones] = await db.query(
            'SELECT id FROM inscripciones WHERE idEstudiante = ? ORDER BY id DESC LIMIT 1',
            [idEstudiante]
        );
        
        if (inscripciones.length === 0) {
            console.error('❌ No se encontró inscripción para Patricia');
            return;
        }
        
        const idInscripcion = inscripciones[0].id;
        console.log(`✅ Inscripción encontrada - ID: ${idInscripcion}`);
        
        // 3. Archivos pendientes de Patricia
        const archivosPendientes = {
            'archivo_dni': 'Patricia_Machado_45125874_archivo_dni.pdf',
            'archivo_cuil': 'Patricia_Machado_45125874_archivo_cuil.pdf',
            'archivo_fichaMedica': 'Patricia_Machado_45125874_archivo_fichaMedica.pdf',
            'archivo_partidaNacimiento': 'Patricia_Machado_45125874_archivo_partidaNacimiento.pdf',
            'foto': 'Patricia_Machado_45125874_foto.png'
        };
        
        const dirPendientes = path.join(__dirname, 'archivosPendientes');
        const dirDocumento = path.join(__dirname, 'archivosDocumento');
        
        // Asegurar que existe el directorio destino
        await fs.mkdir(dirDocumento, { recursive: true });
        
        // 4. Obtener tipos de documentación
        const [tiposDoc] = await db.query('SELECT id, descripcionDocumentacion FROM documentaciones');
        const mapeoTipos = {};
        tiposDoc.forEach(t => {
            mapeoTipos[t.descripcionDocumentacion] = t.id;
        });
        
        // 5. Copiar archivos y registrar en detalle_inscripcion
        for (const [campo, nombreArchivo] of Object.entries(archivosPendientes)) {
            const origen = path.join(dirPendientes, nombreArchivo);
            const destino = path.join(dirDocumento, nombreArchivo);
            const rutaBD = `/archivosDocumento/${nombreArchivo}`;
            
            try {
                // Verificar si existe el archivo origen
                await fs.access(origen);
                
                // Copiar archivo
                await fs.copyFile(origen, destino);
                console.log(`📄 Archivo copiado: ${nombreArchivo}`);
                
                // Actualizar tabla estudiantes
                await db.query(
                    `UPDATE estudiantes SET ${campo} = ? WHERE id = ?`,
                    [rutaBD, idEstudiante]
                );
                console.log(`✅ Tabla estudiantes actualizada: ${campo}`);
                
                // Insertar/actualizar en detalle_inscripcion
                const idTipoDoc = mapeoTipos[campo];
                if (!idTipoDoc) {
                    console.warn(`⚠️ No se encontró tipo de documentación para: ${campo}`);
                    continue;
                }
                
                // Verificar si ya existe
                const [docExistente] = await db.query(
                    'SELECT idDetalleDocumentacion FROM detalle_inscripcion WHERE idInscripcion = ? AND idDocumentaciones = ?',
                    [idInscripcion, idTipoDoc]
                );
                
                if (docExistente.length > 0) {
                    // Actualizar
                    await db.query(
                        `UPDATE detalle_inscripcion 
                        SET estadoDocumentacion = 'Entregado', 
                            fechaEntrega = CURDATE(), 
                            archivoDocumentacion = ?
                        WHERE idDetalleDocumentacion = ?`,
                        [rutaBD, docExistente[0].idDetalleDocumentacion]
                    );
                    console.log(`✅ detalle_inscripcion actualizado: ${campo}`);
                } else {
                    // Insertar
                    await db.query(
                        `INSERT INTO detalle_inscripcion (idInscripcion, idDocumentaciones, estadoDocumentacion, fechaEntrega, archivoDocumentacion)
                        VALUES (?, ?, 'Entregado', CURDATE(), ?)`,
                        [idInscripcion, idTipoDoc, rutaBD]
                    );
                    console.log(`✅ detalle_inscripcion insertado: ${campo}`);
                }
                
            } catch (err) {
                console.error(`❌ Error procesando ${nombreArchivo}:`, err.message);
            }
        }
        
        console.log('✅ Migración completada para Patricia Machado');
        
    } catch (error) {
        console.error('❌ Error en migración:', error);
    } finally {
        process.exit(0);
    }
}

migrarArchivosPatricia();
