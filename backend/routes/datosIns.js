const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener inscripción completa por ID de estudiante
router.get('/inscripciones/:idEstudiante', async (req, res) => {
    try {
        const { idEstudiante } = req.params;
        const modalidadId = Number(req.query.modalidadId); // <-- recibe modalidadId

        // Consulta para obtener los datos completos de inscripción
        let sql = `
            SELECT 
                inscripciones.fechaInscripcion,
                modalidades.modalidad AS modalidad,
                anio_plan.descripcionAnioPlan AS plan,
                modulos.modulo AS modulo,
                estado_inscripciones.descripcionEstado AS estado
            FROM inscripciones
            INNER JOIN modalidades ON inscripciones.idModalidad = modalidades.id
            INNER JOIN anio_plan ON inscripciones.idAnioPlan = anio_plan.id
            INNER JOIN modulos ON inscripciones.idModulos = modulos.id
            INNER JOIN estado_inscripciones ON inscripciones.idEstadoInscripcion = estado_inscripciones.id
            WHERE inscripciones.idEstudiante = ?
        `;
        const params = [idEstudiante];

        if (modalidadId) {
            sql += ' AND inscripciones.idModalidad = ?';
            params.push(modalidadId);
        }

        const [result] = await db.query(sql, params);

        if (result.length > 0) {
            res.status(200).json({ success: true, inscripcion: result[0] });
        } else {
            res.status(404).json({ success: false, message: 'Inscripción no encontrada para la modalidad seleccionada.' });
        }
    } catch (error) {
        console.error('Error al obtener inscripción:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// Obtener datos completos del estudiante por DNI
router.get('/:dni', async (req, res) => {
    try {
        const { dni } = req.params;
        const modalidadId = Number(req.query.modalidadId); // <-- recibe modalidadId

        // Consulta para obtener los datos del estudiante (incluyendo email y estado activo)
        const [estudianteResult] = await db.query('SELECT * FROM estudiantes WHERE dni = ? AND activo = 1', [dni]);
        if (estudianteResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Estudiante no encontrado o inactivo.' });
        }
        const estudiante = estudianteResult[0];

        // Consulta para obtener los datos completos del domicilio
        const [domicilioResult] = await db.query(`
            SELECT 
                domicilios.calle,
                domicilios.numero,
                barrios.nombre AS barrio,
                localidades.nombre AS localidad,
                provincias.nombre AS provincia
            FROM domicilios
            INNER JOIN barrios ON domicilios.idBarrio = barrios.id
            INNER JOIN localidades ON domicilios.idLocalidad = localidades.id
            INNER JOIN provincias ON domicilios.idProvincia = provincias.id
            WHERE domicilios.id = ?
        `, [estudiante.idDomicilio]);

        const domicilio = domicilioResult.length > 0 ? domicilioResult[0] : null;

        // Consulta para obtener la inscripción filtrada por modalidad
        let inscripcionQuery = `
            SELECT 
                inscripciones.id AS idInscripcion,
                inscripciones.fechaInscripcion,
                modalidades.modalidad AS modalidad,
                anio_plan.descripcionAnioPlan AS plan,
                modulos.modulo AS modulo,
                estado_inscripciones.descripcionEstado AS estado
            FROM inscripciones
            LEFT JOIN modalidades ON inscripciones.idModalidad = modalidades.id
            LEFT JOIN anio_plan ON inscripciones.idAnioPlan = anio_plan.id
            LEFT JOIN modulos ON inscripciones.idModulos = modulos.id
            LEFT JOIN estado_inscripciones ON inscripciones.idEstadoInscripcion = estado_inscripciones.id
            WHERE inscripciones.idEstudiante = ?
        `;
        const queryParams = [estudiante.id];

        if (modalidadId) {
            inscripcionQuery += ' AND inscripciones.idModalidad = ?';
            queryParams.push(modalidadId);
        }

        const [inscripcionResult] = await db.query(inscripcionQuery, queryParams);

        // Si no hay inscripción para esa modalidad, devuelve error
        if (!inscripcionResult.length) {
            return res.status(404).json({ success: false, message: 'No existe inscripción en la modalidad seleccionada.' });
        }

        const inscripcion = inscripcionResult[0];

        // Consulta para obtener la documentación si existe inscripción
        let documentacion = [];
        if (inscripcion && inscripcion.idInscripcion) {
            // Traer todos los tipos de documentación
            const [tiposDoc] = await db.query(`
                SELECT id, descripcionDocumentacion
                FROM documentaciones
            `);

            // Traer la documentación entregada
            const [documentacionResult] = await db.query(`
                SELECT
                    d.idDocumentaciones,
                    doc.descripcionDocumentacion,
                    d.estadoDocumentacion,
                    d.fechaEntrega,
                    d.archivoDocumentacion
                FROM detalle_inscripcion d
                JOIN documentaciones doc ON doc.id = d.idDocumentaciones
                WHERE d.idInscripcion = ?
            `, [inscripcion.idInscripcion]);

            // Mapear entregados por idDocumentaciones
            const entregadosMap = {};
            documentacionResult.forEach(doc => {
                entregadosMap[doc.idDocumentaciones] = {
                    ...doc,
                    archivoDocumentacion: doc.archivoDocumentacion
                        ? (doc.archivoDocumentacion.startsWith('/archivosDocumentacion/') ? `http://localhost:5000${doc.archivoDocumentacion}` : doc.archivoDocumentacion)
                        : null
                };
            });

            // Construir el array completo, marcando faltantes
            documentacion = tiposDoc.map(tipo => {
                if (entregadosMap[tipo.id]) {
                    return entregadosMap[tipo.id];
                }
                return {
                    idDocumentaciones: tipo.id,
                    descripcionDocumentacion: tipo.descripcionDocumentacion,
                    estadoDocumentacion: 'Faltante',
                    fechaEntrega: null,
                    archivoDocumentacion: null
                };
            });
        }

        // Respuesta combinada
        res.status(200).json({
            success: true,
            estudiante,
            domicilio,
            inscripcion,
            documentacion
        });
    } catch (error) {
        console.error('Error al obtener datos completos del estudiante:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

module.exports = router;