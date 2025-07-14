const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/upload');
const guardarDetalleDocumentacion = require('../utils/guardarDetalleDocumentacion');
const buscarOInsertarProvincia = require('../utils/buscarOInsertarProvincia');
const buscarOInsertarLocalidad = require('../utils/buscarOInsertarLocalidad');
const buscarOInsertarBarrio = require('../utils/buscarOInsertarBarrio');
const obtenerRutaFoto = require('../utils/obtenerRutaFoto');
const insertarInscripcion = require('../utils/insertarInscripcion');
// Registrar estudiante y preinscripción
router.post('/registrar', upload.any(), async (req, res) => {
    try {
        // Extraer datos personales
        function getFirstValue(val) {
            if (Array.isArray(val)) return val[0];
            return val;
        }
        const nombre = getFirstValue(req.body.nombre);
        const apellido = getFirstValue(req.body.apellido);
        const dni = getFirstValue(req.body.dni);
        const cuil = getFirstValue(req.body.cuil);
        const fechaNacimiento = getFirstValue(req.body.fechaNacimiento);

        // Extraer datos de domicilio
        const pcia = getFirstValue(req.body.pcia);
        const localidad = getFirstValue(req.body.localidad);
        const barrio = getFirstValue(req.body.barrio);
        const calle = getFirstValue(req.body.calle);
        const numero = Number(getFirstValue(req.body.numero));

        // idUsuarios puede venir o no
        const idUsuarios = req.body.idUsuarios ? Number(req.body.idUsuarios) : null;

        // Validación básica
        if (!nombre || !apellido || !dni || !cuil || !fechaNacimiento ||
            !pcia || !localidad || !barrio || !calle || isNaN(numero)) {
            return res.status(400).json({ message: 'Faltan datos obligatorios.' });
        }

        // Buscar o insertar provincia, localidad y barrio
        const idProvincia = await buscarOInsertarProvincia(db, pcia);
        const idLocalidad = await buscarOInsertarLocalidad(db, localidad, idProvincia);
        const idBarrio = await buscarOInsertarBarrio(db, barrio, idLocalidad);

        // Insertar domicilio
        const [domicilioResult] = await db.query(
            'INSERT INTO domicilios (calle, numero, idBarrio, idLocalidad, idProvincia) VALUES (?, ?, ?, ?, ?)',
            [calle, numero, idBarrio, idLocalidad, idProvincia]
        );
        const idDomicilio = domicilioResult.insertId;

        // Mapear archivos subidos y obtener la ruta de la foto
        const archivosMap = {};
        if (Array.isArray(req.files)) {
            req.files.forEach(file => {
                archivosMap[file.fieldname] = '/archivosDocumento/' + file.filename;
            });
        }
        const fotoUrl = obtenerRutaFoto(archivosMap);
     
        // Insertar estudiante
        const [estudianteResult] = await db.query(
            'INSERT INTO estudiantes (nombre, apellido, dni, cuil, fechaNacimiento, foto, idDomicilio,idUsuarios) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
            [nombre, apellido, dni, cuil, fechaNacimiento, fotoUrl, idDomicilio, idUsuarios]
        );
        const idEstudiante = estudianteResult.insertId;
         
        // 5. Validar e insertar inscripción (con estado de inscripción)
        const modalidadId = Number(getFirstValue(req.body.modalidadId));
        const planAnioId = Number(getFirstValue(req.body.planAnio));
        const modulosId = Number(getFirstValue(req.body.idModulo)); // ✅ corregido
        const estadoInscripcionId = Number(getFirstValue(req.body.idEstadoInscripcion));

 
        // Insertar inscripción principal y obtener idInscripcion
        if (
            isNaN(modalidadId) ||
            isNaN(planAnioId) ||
            isNaN(modulosId) ||
            isNaN(estadoInscripcionId)
        ) {
            return res.status(400).json({ message: 'Datos de inscripción incompletos o inválidos.' });
        }
        // Depuración de datos
           console.log('Datos recibidos:', {
                nombre, apellido, dni, cuil, fechaNacimiento, idDomicilio,
                modalidadId, planAnioId, modulosId, estadoInscripcionId
                });

            console.log('IDs convertidos:', {
            modalidadId, planAnioId, modulosId, estadoInscripcionId
            });
        // Insertar inscripción principal
        const idInscripcion = await insertarInscripcion(
            db,
            idEstudiante,
            modalidadId,
            planAnioId,
            modulosId,
            estadoInscripcionId
        );
        console.log('🧾 Backend Datos inscripción que se insertarán:', {
            idEstudiante, modalidadId, planAnioId, modulosId, estadoInscripcionId
            });

        // Procesar detalleDocumentacion
        detalleDocumentacion = [];
        try {
             detalleDocumentacion = JSON.parse(req.body.detalleDocumentacion || '[]');
        } catch (e) {
           return res.status(400).json({ message: 'detalle Documentacion mal formado.' });
        }
        if (!Array.isArray(detalleDocumentacion) || detalleDocumentacion.length === 0) {
            return res.status(400).json({ message: 'Detalle de documentación vacío o mal formado.' });
        }
        console.log('Detalle de documentación:', detalleDocumentacion);
        // Guardar cada detalle en la tabla detalle_inscripcion
        await guardarDetalleDocumentacion(detalleDocumentacion, archivosMap, idInscripcion, db);    

    res.status(201).json({ 
        success: true, 
        message: 'Estudiante registrado con éxito', 
        idEstudiante, idInscripcion });
    } catch (error) {
        console.error('Error en el registro de estudiante:', error.message, error.stack);
        return res.status(500).json({ message: `Error en el registro de estudiante: ${error.message}` });
    }
});

router.post('/registrar', upload.any(), async (req, res) => {
    try {
        const { dni } = req.body;

        // Verificar si el DNI ya existe
        const [estudianteExistente] = await db.query('SELECT * FROM estudiantes WHERE dni = ?', [dni]);
        if (estudianteExistente.length > 0) {
            return res.status(400).json({ message: 'El DNI ya está registrado.' });
        }

        // Continuar con el registro si el DNI no existe
        const [domicilioResult] = await db.query(
            'INSERT INTO domicilios (calle, numero, idBarrio, idLocalidad, idProvincia) VALUES (?, ?, ?, ?, ?)',
            [calle, numero, idBarrio, idLocalidad, idProvincia]
        );
        const idDomicilio = domicilioResult.insertId;

        const [estudianteResult] = await db.query(
            'INSERT INTO estudiantes (nombre, apellido, dni, cuil, fechaNacimiento, foto, idDomicilio, idUsuarios) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, dni, cuil, fechaNacimiento, fotoUrl, idDomicilio, idUsuarios]
        );
        const idEstudiante = estudianteResult.insertId;

        res.status(201).json({
            success: true,
            message: 'Estudiante registrado con éxito',
            idEstudiante,
        });
    } catch (error) {
        console.error('Error en el registro de estudiante:', error.message, error.stack);
        return res.status(500).json({ message: `Error en el registro de estudiante: ${error.message}` });
    }
});

module.exports = router;