// utils/obtenerDocumentacionFaltante.js

/**
 * Devuelve un array con los nombres de la documentación faltante
 * según estado de inscripción, modalidad y plan.
 * 
 * @param {Object} params
 * @param {string} params.estadoInscripcion - "Aprobada" | "Pendiente"
 * @param {string} params.modalidad - "Presencial" | "Semipresencial"
 * @param {string|number} params.planAnio - Ej: "Plan A", 1, 4, etc.
 * @param {Array} params.documentacionPresentada - Array de nombres de archivos presentados
 * @returns {Array} - Array de nombres de documentación faltante
 */
function obtenerDocumentacionFaltante({ estadoInscripcion, modalidad, planAnio, documentacionPresentada }) {
    // Documentos requeridos por plan/modalidad
    const docsPrimario = [
        'Certificado Nivel Primario',
        'DNI',
        'CUIL',
        'Partida de Nacimiento',
        'Ficha Médica'
    ];
    const docsAnalitico = [
        'Analítico Parcial',
        'DNI',
        'CUIL',
        'Partida de Nacimiento',
        'Ficha Médica'
    ];

    // Si está aprobada, no mostrar faltantes
    if (estadoInscripcion?.toLowerCase() === 'aprobada') {
        return [];
    }

    // Determinar si es plan A/1er año
    const esPlanPrimario = (
        String(planAnio).toLowerCase().includes('a') ||
        String(planAnio) === '1' ||
        String(planAnio) === '4'
    );

    // Si presentó solicitud de pase pero no analítico, solo mostrar analítico como faltante
    if (documentacionPresentada.includes('Solicitud Pase') &&
        !documentacionPresentada.includes('Analítico Parcial')) {
        return ['Analítico Parcial'];
    }

    // Documentos requeridos según plan
    const requeridos = esPlanPrimario ? docsPrimario : docsAnalitico;

    // Filtrar los que faltan
    return requeridos.filter(doc => !documentacionPresentada.includes(doc));
}

module.exports = obtenerDocumentacionFaltante;

// Este módulo obtiene la documentación faltante para un estudiante dado su ID.
// Realiza una consulta que selecciona las documentaciones que no han sido entregadas por el