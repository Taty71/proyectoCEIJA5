import comprobanteStyles from '../estilos/comprobante.css?raw';
import jsPDF from 'jspdf';

// Documentos requeridos por plan/año
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

// Determina los requeridos según plan/año
function getDocsRequeridos(planAnio) {
    const val = String(planAnio).toLowerCase();
    if (val.includes('a') || val === '1' || val === '4') return docsPrimario;
    if (val.includes('b') || val.includes('c') || val === '2' || val === '3' || val === '5' || val === '6') return docsAnalitico;
    return docsPrimario; // fallback
}

// Obtiene los faltantes: solo los requeridos que no tienen archivo adjunto
function obtenerDocumentacionFaltante(estudiante) {
    const requeridos = getDocsRequeridos(estudiante.planAnio || estudiante.cursoPlan);
    const presentados = (estudiante.documentacion || [])
        .filter(doc => doc.archivoDocumentacion)
        .map(doc => doc.descripcionDocumentacion);

    if (presentados.includes('Solicitud Pase') &&
        !presentados.includes('Analítico Parcial')) {
        return ['Analítico Parcial'];
    }

    return requeridos.filter(doc => !presentados.includes(doc));
}

/**
 * Componente para generar comprobantes de inscripción en formato PDF
 * Optimizado para formato A5
 */
class ComprobanteGenerator {
  
  /**
   * Formatea una fecha para mostrar en formato argentino
   * @param {string|Date} fecha - La fecha a formatear
   * @returns {string} - Fecha formateada o mensaje de error
   */
  static formatearFecha(fecha) {
    if (!fecha) return 'No disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-AR');
    } catch {
      return 'Fecha inválida';
    }
  }

  /**
   * Genera la sección de documentación según el estado de inscripción
   * @param {Object} estudiante - Datos del estudiante
   * @param {Array} documentosFaltantes - Lista de documentos faltantes
   * @returns {string} - HTML de la sección de documentación
   */
  static generarSeccionDocumentacion(estudiante, documentosFaltantes) {
    const estadoLower = estudiante.estadoInscripcion?.toLowerCase() || '';
    
    if (estadoLower.includes('aprobado')) {
      return `
        <div class="comprobante-inscripcion-completa">
          <h3 class="comprobante-h3">✅ Inscripción Completa</h3>
          <p class="comprobante-sin-documentos">La inscripción ha sido aprobada y se encuentra completa. Todos los requisitos han sido cumplidos satisfactoriamente.</p>
        </div>
      `;
    } else if (estadoLower.includes('pendiente') && documentosFaltantes?.length > 0) {
      return `
        <div class="comprobante-documentos-faltantes">
          <h3 class="comprobante-h3">⚠️ Documentos Pendientes de Presentación</h3>
          <p class="comprobante-p">Los siguientes documentos deben ser presentados para completar la inscripción:</p>
          <ul class="comprobante-ul">
            ${documentosFaltantes.map(doc => `<li class="comprobante-li">${doc}</li>`).join('')}
          </ul>
        </div>
      `;
    } else if (estadoLower.includes('pendiente')) {
      return `
        <div class="comprobante-documentos-faltantes">
          <h3 class="comprobante-h3">⚠️ Inscripción Pendiente</h3>
          <p class="comprobante-sin-documentos">La inscripción se encuentra pendiente de revisión. No se detectaron documentos faltantes específicos.</p>
        </div>
      `;
    } else {
      return `
        <div class="comprobante-documentos-faltantes">
          <h3 class="comprobante-h3">📋 Estado de Documentación</h3>
          <p class="comprobante-sin-documentos">Estado de inscripción: ${estudiante.estadoInscripcion || 'Sin definir'}</p>
        </div>
      `;
    }
  }

  /**
   * Genera el HTML completo del comprobante
   * @param {Object} estudiante - Datos del estudiante
   * @param {Array} documentosFaltantes - Lista de documentos faltantes
   * @returns {string} - HTML completo del comprobante
   */
  static generarHTML(estudiante, documentosFaltantes) {
    const fecha = new Date().toLocaleDateString('es-AR');
    const hora = new Date().toLocaleTimeString('es-AR');
    const seccionDocumentacion = this.generarSeccionDocumentacion(estudiante, documentosFaltantes);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Comprobante de Estado de Inscripción</title>
        <style>${comprobanteStyles}</style>
      </head>
      <body>
        <div class="comprobante-header">
          <div class="comprobante-logo">CEIJA 5</div>
          <div class="comprobante-institucion">Centro de Educación Integral para Jóvenes y Adultos N° 5</div>
          <div class="comprobante-subtitulo">Comprobante de Estado de Inscripción</div>
        </div>

        <div class="comprobante-info-estudiante">
          <h3 class="comprobante-h3">Información del Estudiante</h3>
          <p class="comprobante-p"><strong class="comprobante-strong">ID:</strong> ${estudiante.id}</p>
          <p class="comprobante-p"><strong class="comprobante-strong">DNI:</strong> ${estudiante.dni}</p>
          <p class="comprobante-p"><strong class="comprobante-strong">Nombre Completo:</strong> ${estudiante.nombre} ${estudiante.apellido}</p>
          <p class="comprobante-p"><strong class="comprobante-strong">Estado:</strong> <span class="comprobante-estado-activo">✅ Activo</span></p>
        </div>

        <div class="comprobante-info-academica">
          <h3 class="comprobante-h3">Información Académica</h3>
          <p class="comprobante-p"><strong class="comprobante-strong">Modalidad:</strong> ${estudiante.modalidad || 'Sin modalidad'}</p>
          <p class="comprobante-p"><strong class="comprobante-strong">Curso/Plan:</strong> ${estudiante.cursoPlan || 'Sin asignar'}</p>
          <p class="comprobante-p"><strong class="comprobante-strong">Fecha de Inscripción:</strong> ${this.formatearFecha(estudiante.fechaInscripcion)}</p>
          <p class="comprobante-p"><strong class="comprobante-strong">Estado de Inscripción:</strong> 
            <span class="${estudiante.estadoInscripcion?.toLowerCase().includes('pendiente') ? 'comprobante-estado-pendiente' : 'comprobante-estado-activo'}">
              ${estudiante.estadoInscripcion || 'Sin estado'}
            </span>
          </p>
        </div>

        ${seccionDocumentacion}

        <div class="comprobante-footer">
          <p>Comprobante emitido el ${fecha} a las ${hora}</p>
          <p>Este documento es válido como constancia del estado de inscripción del estudiante.</p>
          <p><strong class="comprobante-strong">CEIJA 5 - Centro de Educación Integral para Jóvenes y Adultos N° 5</strong></p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera y abre el comprobante para impresión
   * @param {Object} estudiante - Datos del estudiante
   * @param {Array} documentosFaltantes - Lista de documentos faltantes
   */
  static generar(estudiante, documentosFaltantes) {
    try {
      const contenidoHTML = this.generarHTML(estudiante, documentosFaltantes);
      
      // Crear ventana nueva para imprimir
      const ventanaImpresion = window.open('', '_blank');
      if (!ventanaImpresion) {
        throw new Error('No se pudo abrir la ventana de impresión. Verifique que los pop-ups estén habilitados.');
      }
      
      ventanaImpresion.document.write(contenidoHTML);
      ventanaImpresion.document.close();
      
      // Esperar a que cargue y luego abrir diálogo de impresión
      ventanaImpresion.onload = () => {
        ventanaImpresion.focus();
        ventanaImpresion.print();
      };
      
      return true;
    } catch (error) {
      console.error('Error al generar comprobante:', error);
      throw error;
    }
  }

  /**
   * Genera el comprobante PDF de inscripción y documentación.
   * @param {Object} estudiante - Datos del estudiante
   */
  static generarPDF(estudiante) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Comprobante de Estado de Inscripción', 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre: ${estudiante.nombre} ${estudiante.apellido}`, 20, 35);
    doc.text(`DNI: ${estudiante.dni}`, 20, 42);
    doc.text(`Modalidad: ${estudiante.modalidad}`, 20, 49);
    doc.text(`Curso/Plan: ${estudiante.planAnio || estudiante.cursoPlan}`, 20, 56);
    doc.text(`Estado de Inscripción: ${estudiante.estadoInscripcion}`, 20, 63);

    const presentados = (estudiante.documentacion || [])
        .filter(doc => doc.archivoDocumentacion)
        .map(doc => doc.descripcionDocumentacion);

    let y = 75;
    doc.setFontSize(13);
    doc.text('Documentos Presentados:', 20, y);
    y += 7;
    presentados.forEach(docName => {
        doc.text(`✓ ${docName}`, 25, y);
        y += 6;
    });

    const faltantes = obtenerDocumentacionFaltante(estudiante);

    if (estudiante.estadoInscripcion?.toLowerCase() === 'aprobada') {
        doc.setFontSize(13);
        doc.text('No hay documentación pendiente.', 20, y + 5);
    } else if (estudiante.estadoInscripcion?.toLowerCase() === 'anulado') {
        doc.setFontSize(13);
        doc.text('Inscripción anulada.', 20, y + 5);
    } else {
        doc.setFontSize(13);
        doc.text('Documentos Presentados:', 20, y + 5);
        y += 12;
        if (faltantes.length === 0) {
            doc.text('✓ No hay faltantes', 25, y);
        } else {
            faltantes.forEach(docFalt => {
                doc.text(`✗ ${docFalt}`, 25, y);
                y += 6;
            });
        }
    }

    doc.save(`Comprobante_Inscripcion_${estudiante.dni}.pdf`);
  }
}

export default ComprobanteGenerator;
