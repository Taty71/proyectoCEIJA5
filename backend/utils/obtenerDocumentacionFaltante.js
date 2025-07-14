// utils/obtenerDocumentacionFaltante.js

module.exports = async function obtenerDocumentacionFaltante(idEstudiante, db) {
    const [result] = await db.query(`
        SELECT d.id, d.descripcionDocumentacion
        FROM documentaciones d
        LEFT JOIN (
            SELECT di.idDocumentaciones
            FROM detalle_inscripcion di
            INNER JOIN inscripciones i ON i.id = di.idInscripcion
            WHERE i.idEstudiante = ?
        ) AS docs_entregados
        ON d.id = docs_entregados.idDocumentaciones
        WHERE docs_entregados.idDocumentaciones IS NULL
    `, [idEstudiante]);

    return result;
};
// Este módulo obtiene la documentación faltante para un estudiante dado su ID.
// Realiza una consulta que selecciona las documentaciones que no han sido entregadas por el