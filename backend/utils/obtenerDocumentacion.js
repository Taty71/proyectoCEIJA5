const db = require('../db');

/**
 * Obtiene la documentación asociada a una inscripción
 * @param {number} idInscripcion - ID de la inscripción
 * @returns {Promise<Array>} - Lista de documentos
 * @throws {Error} - Si ocurre un error con la base de datos
 */
async function obtenerDocumentacionPorInscripcion(idInscripcion) {
  if (isNaN(idInscripcion)) {
    throw new Error('ID de inscripción inválido.');
  }

  const [rows] = await db.query(
    `SELECT
       d.idDocumentaciones,
       doc.descripcionDocumentacion,
       d.estadoDocumentacion,
       d.fechaEntrega,
       d.archivoDocumentacion
     FROM detalle_inscripcion d
     JOIN documentaciones doc ON doc.id = d.idDocumentaciones
     WHERE d.idInscripcion = ?`,
    [idInscripcion]
  );

  return rows;
}

module.exports = obtenerDocumentacionPorInscripcion;
