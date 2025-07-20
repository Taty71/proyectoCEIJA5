const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/upload');
const guardarDetalleDocumentacion = require('../utils/guardarDetalleDocumentacion');
const buscarOInsertarProvincia = require('../utils/buscarOInsertarProvincia');
const buscarOInsertarLocalidad = require('../utils/buscarOInsertarLocalidad');
const buscarOInsertarBarrio = require('../utils/buscarOInsertarBarrio');
const obtenerRutaFoto = require('../utils/obtenerRutaFoto');



router.get('/dni/:dni', async (req, res) => {
    try {
        const { dni } = req.params;

        // Validar que el DNI sea un número
        if (isNaN(dni)) {
            return res.status(400).json({ success: false, message: 'DNI inválido.' });
        }

        // Consulta para obtener datos del estudiante (solo activos)
        const [estudiante] = await db.query('SELECT * FROM estudiantes WHERE dni = ? AND activo = 1', [dni]);
        if (estudiante.length === 0) {
            return res.status(404).json({ success: false, message: 'Estudiante no encontrado.' });
        }

        // Consulta para obtener datos del domicilio
        const [domicilio] = await db.query('SELECT * FROM domicilios WHERE id = ?', [estudiante[0].idDomicilio]);

        // Consulta para obtener información académica
        const [inscripcion] = await db.query(`
            SELECT 
                i.fechaInscripcion, 
                m.modalidad, 
                a.descripcionAnioPlan AS cursoPlan
            FROM inscripciones i
            LEFT JOIN modalidades m ON i.idModalidad = m.id
            LEFT JOIN anio_plan a ON i.idAnioPlan = a.id
            WHERE i.idEstudiante = ? AND (i.idModulos = 0 OR i.idModulos IS NOT NULL)
        `, [estudiante[0].id]);

        res.status(200).json({
            success: true,
            estudiante: estudiante[0],
            domicilio: domicilio[0],
            inscripcion: inscripcion.length > 0 ? inscripcion[0] : null, // Devuelve null si no hay inscripción
        });
    } catch (error) {
        console.error('Error al obtener estudiante por DNI:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Recibe los parámetros de paginación
        const offset = (page - 1) * limit;

        // Consulta para obtener estudiantes activos con modalidad y curso/plan
        const [result] = await db.query(`
            SELECT 
                e.id, e.nombre, e.apellido, e.dni, e.cuil, e.fechaNacimiento, 
                d.calle, d.numero, b.nombre AS barrio, l.nombre AS localidad, p.nombre AS provincia,
                i.fechaInscripcion, 
                m.modalidad, 
                a.descripcionAnioPlan AS cursoPlan,
                ei.descripcionEstado AS estadoInscripcion
            FROM estudiantes e
            LEFT JOIN domicilios d ON e.idDomicilio = d.id
            LEFT JOIN barrios b ON d.idBarrio = b.id
            LEFT JOIN localidades l ON d.idLocalidad = l.id
            LEFT JOIN provincias p ON d.idProvincia = p.id
            LEFT JOIN inscripciones i ON e.id = i.idEstudiante
            LEFT JOIN modalidades m ON i.idModalidad = m.id
            LEFT JOIN anio_plan a ON i.idAnioPlan = a.id
            LEFT JOIN estado_inscripciones ei ON i.idEstadoInscripcion = ei.id
            WHERE e.activo = 1
            ORDER BY i.fechaInscripcion DESC, e.id ASC
            LIMIT ? OFFSET ?
        `, [parseInt(limit), parseInt(offset)]);

        // Contar total de estudiantes activos
        const [total] = await db.query('SELECT COUNT(*) AS total FROM estudiantes WHERE activo = 1');

        res.status(200).json({
            success: true,
            estudiantes: result.map(estudiante => ({
                ...estudiante,
                fechaInscripcion: estudiante.fechaInscripcion || 'Sin inscripción',
                modalidad: estudiante.modalidad || 'Sin modalidad',
                cursoPlan: estudiante.cursoPlan || 'Sin curso/plan',
                estadoInscripcion: estudiante.estadoInscripcion || 'Sin estado',
            })),
            total: total[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total[0].total / parseInt(limit)),
        });
    } catch (error) {
        console.error('Error al obtener estudiantes inscritos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});
module.exports = router;