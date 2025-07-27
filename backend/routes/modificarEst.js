const express = require('express');
const router  = express.Router();
const db      = require('../db');

const buscarOInsertarProvincia  = require('../utils/buscarOInsertarProvincia');
const buscarOInsertarLocalidad  = require('../utils/buscarOInsertarLocalidad');
const buscarOInsertarBarrio     = require('../utils/buscarOInsertarBarrio');
const obtenerDocumentacionPorInscripcion = require('../utils/obtenerDocumentacion');

const path   = require('path');
const fs     = require('fs');
const multer = require('multer');

// ─── carpeta y multer ─────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '../archivosDocumentacion');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, {recursive:true});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const { nombre = 'sin_nombre', apellido = 'sin_apellido' } = req.body;
    const dni     = req.params.dni;
    const campo   = file.fieldname;               // dni, cuil, etc.
    const ext     = path.extname(file.originalname);
    cb(null, `${nombre.trim().replace(/\s+/g,'_')}_${apellido.trim().replace(/\s+/g,'_')}_${dni}_${campo}${ext}`);
  }
});
const upload = multer({ storage });

// ─── PUT /modificar-estudiante/:dni ───────────────────────
router.put('/:dni', upload.any(), async (req, res) => {
  const dni = Number(req.params.dni);
  if (!Number.isInteger(dni)) {
    return res.status(400).json({ success:false, message:'DNI inválido.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Debug: Mostrar datos recibidos
    console.log('Datos recibidos para modificar:', req.body);
    console.log('Archivos recibidos:', req.files);

    // Auto-asignar "Argentina" para documentos DNI si paisEmision está vacío
    if (req.body.tipoDocumento === 'DNI' && !req.body.paisEmision) {
      req.body.paisEmision = 'Argentina';
      console.log('Auto-asignando paisEmision = "Argentina" para DNI');
    }

    // ─── localizar estudiante & domicilio ─────────────────
    const [[est]] = await conn.query(
      'SELECT id, idDomicilio FROM estudiantes WHERE dni = ?',
      [dni]
    );
    if (!est) {
      await conn.rollback();
      return res.status(404).json({ success:false, message:'Estudiante no encontrado.' });
    }
    const idEst        = est.id;
    const idDomicilio  = est.idDomicilio;

    // ─── provincia / localidad / barrio ───────────────────
    const idProvincia = await buscarOInsertarProvincia(conn, req.body.provincia);
    const idLocalidad = await buscarOInsertarLocalidad(conn, req.body.localidad, idProvincia);
    const idBarrio    = await buscarOInsertarBarrio(conn, req.body.barrio, idLocalidad);

    // ─── actualización de domicilio ──────────────────────
    await conn.query(
      `UPDATE domicilios
         SET calle=?, numero=?, idBarrio=?, idLocalidad=?, idProvincia=?
       WHERE id=?`,
      [req.body.calle, req.body.numero, idBarrio, idLocalidad, idProvincia, idDomicilio]
    );

    // ─── actualización de estudiante ─────────────────────
    console.log('Actualizando estudiante con ID:', idEst);
    console.log('Datos para actualizar estudiante:', {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      dni: req.body.dni,
      cuil: req.body.cuil,
      email: req.body.email,
      fechaNacimiento: req.body.fechaNacimiento,
      tipoDocumento: req.body.tipoDocumento,
      paisEmision: req.body.paisEmision
    });
    
    const resultEstudiante = await conn.query(
      `UPDATE estudiantes
         SET nombre=?, apellido=?, dni=?, cuil=?, email=?, fechaNacimiento=?, tipoDocumento=?, paisEmision=?
       WHERE id=?`,
      [req.body.nombre, req.body.apellido, req.body.dni, req.body.cuil, req.body.email, req.body.fechaNacimiento, req.body.tipoDocumento, req.body.paisEmision, idEst]
    );
    if (resultEstudiante.affectedRows === 0) {
      console.error('No se pudo actualizar el estudiante. Verifica los datos enviados.');
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'No se pudo actualizar el estudiante.' });
    }

    // Validar que idAnioPlan exista en la tabla anio_plan
    console.log('Validando planAnioId:', req.body.planAnioId);
    const [[anioPlan]] = await conn.query(
      'SELECT id FROM anio_plan WHERE id = ?',
      [req.body.planAnioId]
    );
    if (!anioPlan) {
      await conn.rollback();
      console.error('planAnioId no válido:', req.body.planAnioId);
      return res.status(400).json({ success: false, message: 'El plan de año seleccionado no es válido.' });
    }

    // Validar que idEstadoInscripcion exista en la tabla estado_inscripciones
    console.log('Validando estadoInscripcionId:', req.body.estadoInscripcionId);
    const [[estadoInscripcion]] = await conn.query(
      'SELECT id FROM estado_inscripciones WHERE id = ?',
      [req.body.estadoInscripcionId]
    );
    if (!estadoInscripcion) {
      await conn.rollback();
      console.error('estadoInscripcionId no válido:', req.body.estadoInscripcionId);
      return res.status(400).json({ success: false, message: 'El estado de inscripción seleccionado no es válido.' });
    }

    // ─── actualización de inscripción ────────────────────
    const resultInscripcion = await conn.query(
      `UPDATE inscripciones
         SET idModalidad=?, idAnioPlan=?, idModulos=?, idEstadoInscripcion=?
       WHERE idEstudiante=? AND idModalidad=?`, // <-- filtra por modalidad
      [req.body.modalidadId, req.body.planAnioId, req.body.modulosId, req.body.estadoInscripcionId, idEst, req.body.modalidadId]
    );
    if (resultInscripcion.affectedRows === 0) {
      console.error('No se pudo actualizar la inscripción. Verifica los datos enviados.');
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'No se pudo actualizar la inscripción.' });
    }

    // ─── idInscripcion necesario para detalle_doc ────────
    const [[ins]] = await conn.query(
      'SELECT id FROM inscripciones WHERE idEstudiante=?',
      [idEst]
    );
    const idInscripcion = ins.id;
    const documentosExistentes = await obtenerDocumentacionPorInscripcion(idInscripcion);
    console.log('Documentación existente:', documentosExistentes);

    // ─── mapear archivos subidos ──────────────────────────
    const archivosMap = {};
    req.files?.forEach(f => {
      archivosMap[f.fieldname] = '/archivosDocumentacion/' + f.filename;
    });

    // ─── procesar detalleDocumentacion ───────────────────
    let detalle = [];
    try {
      detalle = JSON.parse(req.body.detalleDocumentacion || '[]');
    } catch {
      await conn.rollback();
      return res.status(400).json({ success:false, message:'detalleDocumentacion mal formado.' });
    }

    // Procesar detalleDocumentacion
for (const doc of detalle) {
  const archivoNuevo = archivosMap[doc.nombreArchivo];

  // Verificar si existe ya ese documento para la inscripción
  const [[row]] = await conn.query(
    `SELECT id, archivoDocumentacion FROM detalle_inscripcion
     WHERE idInscripcion=? AND idDocumentaciones=?`,
    [idInscripcion, doc.idDocumentaciones]
  );

  if (row) {
    // UPDATE - preservar archivo existente si no hay uno nuevo
    const urlFinal = archivoNuevo || row.archivoDocumentacion;
    await conn.query(
      `UPDATE detalle_inscripcion
       SET estadoDocumentacion=?, fechaEntrega=?, archivoDocumentacion=?
       WHERE id=?`,
      [doc.estadoDocumentacion, doc.fechaEntrega, urlFinal, row.id]
    );
  } else {
    // INSERT - solo insertar si hay archivo nuevo
    if (archivoNuevo) {
      await conn.query(
        `INSERT INTO detalle_inscripcion
         (idInscripcion, idDocumentaciones, estadoDocumentacion, fechaEntrega, archivoDocumentacion)
         VALUES (?,?,?,?,?)`,
        [idInscripcion, doc.idDocumentaciones, doc.estadoDocumentacion, doc.fechaEntrega, archivoNuevo]
      );
    }
  }
}

// ─── traer estado y fecha de inscripción actual ─────────────
const [[infoInscripcion]] = await conn.query(
  `SELECT i.fechaInscripcion, ei.descripcionEstado AS estado
   FROM inscripciones i
   LEFT JOIN estado_inscripciones ei ON ei.id = i.idEstadoInscripcion
   WHERE i.id = ?`,
  [idInscripcion]
);

// ─── obtener documentación actualizada ──────────────────────
const documentacionActualizada = await obtenerDocumentacionPorInscripcion(idInscripcion);

// ─── respuesta final ────────────────────────────────────────
await conn.commit();
res.json({
  success: true,
  message: 'Los datos del estudiante se han modificado con éxito.',
  documentacion: documentacionActualizada,
  estadoInscripcion: infoInscripcion?.estado || null,
  fechaInscripcion: infoInscripcion?.fechaInscripcion || null
});

   
  } catch (err) {
    await conn.rollback();
    console.error('Error al modificar estudiante:', err);
    res.status(500).json({ success:false, message:'Error interno del servidor.' });
  } finally {
    conn.release();
  }
});

module.exports = router;
