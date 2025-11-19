// import React from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import { crearEncabezadoInstitucional, normalizarTexto } from './reportes/utils';
// import { useAlerts } from '../../hooks/useAlerts';

// `activo` es tinyint(1) en la BD (1=activo, 0=inactivo). Usamos Number() para comparar.
const opciones = [
  {
    label: 'Activos + Inscripción Pendiente',
    filtro: (e) => Number(e.activo) === 1 && (String(e.estadoInscripcion || '').toLowerCase() === 'pendiente'),
    nombre: 'Activos_Pendiente',
    titulo: 'Estudiantes Activos con Inscripción Pendiente',
  },
  {
    label: 'Activos + Inscripción Completa',
    filtro: (e) => Number(e.activo) === 1 && (String(e.estadoInscripcion || '').toLowerCase() === 'completa'),
    nombre: 'Activos_Completa',
    titulo: 'Estudiantes Activos con Inscripción Completa',
  },
  {
    label: 'Inactivos + Inscripción Completa',
    filtro: (e) => Number(e.activo) === 0 && (String(e.estadoInscripcion || '').toLowerCase() === 'completa'),
    nombre: 'Inactivos_Completa',
    titulo: 'Estudiantes Inactivos con Inscripción Completa',
  },
  {
    label: 'Inactivos + Inscripción Pendiente',
    filtro: (e) => Number(e.activo) === 0 && (String(e.estadoInscripcion || '').toLowerCase() === 'pendiente'),
    nombre: 'Inactivos_Pendiente',
    titulo: 'Estudiantes Inactivos con Inscripción Pendiente',
  },
];

const ModalReportesEstudiantes = ({ open, onClose, estudiantes, showInfo }) => {
  if (!open) return null;

  const generarPDF = (filtro, nombre, titulo) => {
    const lista = estudiantes.filter(filtro);
    if (lista.length === 0) {
      showInfo(`No hay registro de estudiantes para: ${titulo}`);
      return;
    }
    // Determinar modalidad (se asume que todos los registros tienen la misma modalidad)
    const modalidad = lista[0]?.modalidad || '';
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    // Encabezado institucional (sin título de listado)
    let yPos = crearEncabezadoInstitucional(doc, '');

    // Más espacio tras encabezado
    yPos += 18;

    // Modalidad como h2 (tamaño grande, azul, centrado)
    if (modalidad) {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 65, 119);
      doc.text(`Modalidad: ${normalizarTexto(modalidad)}`, doc.internal.pageSize.width / 2, yPos, { align: 'center' });
      yPos += 36; // dos renglones libres
    }

    // Título del listado (h3, centrado, azul, un renglón libre después)
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 65, 119);
    doc.text(normalizarTexto(titulo), doc.internal.pageSize.width / 2, yPos, { align: 'center' });
    yPos += 24;

    // Mostrar cantidad total de estudiantes en el reporte
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 65, 119);
    doc.text(`Cantidad de estudiantes: ${lista.length}`, doc.internal.pageSize.width / 2, yPos, { align: 'center' });
    yPos += 18;

    // Cabecera de tabla (sin columna Estado Inscripción)
    doc.setFontSize(11);
    doc.setTextColor(45, 65, 119);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 40, yPos);
    doc.text('DNI', 80, yPos);
    doc.text('Apellido', 150, yPos);
    doc.text('Nombre', 270, yPos);
    doc.text('Email', 390, yPos);
    yPos += 18;

    // Pie de página con fecha
    const agregarPiePagina = (doc) => {
      doc.setFontSize(9);
      doc.setTextColor(108, 117, 125);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`,
        doc.internal.pageSize.width / 2, 825, { align: 'center' });
    };

    // Filas de la tabla
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    lista.forEach((e, idx) => {
      doc.text(String(e.id), 40, yPos);
      doc.text(String(e.dni), 80, yPos);
      doc.text(normalizarTexto(e.apellido || ''), 150, yPos);
      doc.text(normalizarTexto(e.nombre || ''), 270, yPos);
      doc.text(normalizarTexto(e.email || ''), 390, yPos);
      yPos += 15;
      if (yPos > 780) {
        agregarPiePagina(doc);
        doc.addPage();
        let y2 = crearEncabezadoInstitucional(doc, '');
        y2 += 18;
        if (modalidad) {
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(45, 65, 119);
          doc.text(`Modalidad: ${normalizarTexto(modalidad)}`, doc.internal.pageSize.width / 2, y2, { align: 'center' });
          y2 += 36;
        }
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 65, 119);
        doc.text(normalizarTexto(titulo), doc.internal.pageSize.width / 2, y2, { align: 'center' });
        y2 += 24;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(45, 65, 119);
        doc.text(`Cantidad de estudiantes: ${lista.length}`, doc.internal.pageSize.width / 2, y2, { align: 'center' });
        y2 += 18;
        doc.setFontSize(11);
        doc.setTextColor(45, 65, 119);
        doc.setFont('helvetica', 'bold');
        doc.text('ID', 40, y2);
        doc.text('DNI', 80, y2);
        doc.text('Apellido', 150, y2);
        doc.text('Nombre', 270, y2);
        doc.text('Email', 390, y2);
        y2 += 18;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        yPos = y2;
      }
      // Pie de página en la última página
      if (idx === lista.length - 1) {
        agregarPiePagina(doc);
      }
    });
    // Nombre de archivo: incluir modalidad (normalizada) y fecha YYYY-MM-DD
    const fechaHoy = new Date().toISOString().slice(0, 10);
    const modalidadFilename = modalidad ? normalizarTexto(modalidad).replace(/\s+/g, '_') : 'SinModalidad';
    const fileName = `${nombre}_${modalidadFilename}_${fechaHoy}.pdf`;
    doc.save(fileName);
  };

  // Genera un único PDF que contiene las 4 secciones (cada una correspondiente a un elemento de `opciones`)
  const generarPDFTodos = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const fechaHoy = new Date().toISOString().slice(0, 10);
    const modalidad = (estudiantes && estudiantes.length) ? estudiantes[0].modalidad : '';
    const modalidadFilename = modalidad ? normalizarTexto(modalidad).replace(/\s+/g, '_') : 'SinModalidad';

    // Pie de página reutilizable
    const agregarPiePagina = (docInstance) => {
      docInstance.setFontSize(9);
      docInstance.setTextColor(108, 117, 125);
      docInstance.setFont('helvetica', 'normal');
      docInstance.text(`Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`,
        docInstance.internal.pageSize.width / 2, 825, { align: 'center' });
    };

    // Función que agrega una sección al documento y retorna si añadió contenido
    const agregarSeccion = (docInstance, tituloSeccion, lista) => {
      let yPos = crearEncabezadoInstitucional(docInstance, '');
      yPos += 18;
      if (modalidad) {
        docInstance.setFontSize(18);
        docInstance.setFont('helvetica', 'bold');
        docInstance.setTextColor(45, 65, 119);
        docInstance.text(`Modalidad: ${normalizarTexto(modalidad)}`, docInstance.internal.pageSize.width / 2, yPos, { align: 'center' });
        yPos += 36;
      }

      docInstance.setFontSize(15);
      docInstance.setFont('helvetica', 'bold');
      docInstance.setTextColor(45, 65, 119);
      docInstance.text(normalizarTexto(tituloSeccion), docInstance.internal.pageSize.width / 2, yPos, { align: 'center' });
      yPos += 24;

      docInstance.setFontSize(12);
      docInstance.setFont('helvetica', 'normal');
      docInstance.setTextColor(45, 65, 119);
      docInstance.text(`Cantidad de estudiantes: ${lista.length}`, docInstance.internal.pageSize.width / 2, yPos, { align: 'center' });
      yPos += 18;

      // Cabecera de tabla
      docInstance.setFontSize(11);
      docInstance.setTextColor(45, 65, 119);
      docInstance.setFont('helvetica', 'bold');
      docInstance.text('ID', 40, yPos);
      docInstance.text('DNI', 80, yPos);
      docInstance.text('Apellido', 150, yPos);
      docInstance.text('Nombre', 270, yPos);
      docInstance.text('Email', 390, yPos);
      yPos += 18;

      docInstance.setFont('helvetica', 'normal');
      docInstance.setFontSize(10);

      if (lista.length === 0) {
        docInstance.text('No hay registros para esta sección.', 40, yPos);
        yPos += 15;
      }

      lista.forEach((e, idx) => {
        docInstance.text(String(e.id), 40, yPos);
        docInstance.text(String(e.dni), 80, yPos);
        docInstance.text(normalizarTexto(e.apellido || ''), 150, yPos);
        docInstance.text(normalizarTexto(e.nombre || ''), 270, yPos);
        docInstance.text(normalizarTexto(e.email || ''), 390, yPos);
        yPos += 15;
        if (yPos > 780) {
          agregarPiePagina(docInstance);
          docInstance.addPage();
          yPos = crearEncabezadoInstitucional(docInstance, '');
          yPos += 18;
          if (modalidad) {
            docInstance.setFontSize(18);
            docInstance.setFont('helvetica', 'bold');
            docInstance.setTextColor(45, 65, 119);
            docInstance.text(`Modalidad: ${normalizarTexto(modalidad)}`, docInstance.internal.pageSize.width / 2, yPos, { align: 'center' });
            yPos += 36;
          }
          docInstance.setFontSize(11);
          docInstance.setTextColor(45, 65, 119);
          docInstance.setFont('helvetica', 'bold');
          docInstance.text('ID', 40, yPos);
          docInstance.text('DNI', 80, yPos);
          docInstance.text('Apellido', 150, yPos);
          docInstance.text('Nombre', 270, yPos);
          docInstance.text('Email', 390, yPos);
          yPos += 18;
          docInstance.setFont('helvetica', 'normal');
          docInstance.setFontSize(10);
        }
        if (idx === lista.length - 1) {
          agregarPiePagina(docInstance);
        }
      });
      return true;
    };

    // Recorrer las opciones y agregar secciones; separar secciones con página nueva
    opciones.forEach((op, index) => {
      const lista = estudiantes.filter(op.filtro);
      if (index > 0) {
        doc.addPage();
      }
      agregarSeccion(doc, op.titulo, lista);
    });

    const fileName = `Todos_Reportes_${modalidadFilename}_${fechaHoy}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="modal-reportes-overlay">
      <div className="modal-reportes-contenido">
        <div className="modal-reportes-header">
          <h3>Emitir Reportes PDF</h3>
          <button className="btn-cerrar-modal" onClick={onClose}>✖</button>
        </div>
        <div className="modal-reportes-body">
          <p>Elige el reporte que deseas emitir:</p>
          <div className="reportes-grid">
            {opciones.map((op) => (
              <button
                key={op.nombre}
                className="btn-reporte-accion"
                onClick={() => generarPDF(op.filtro, op.nombre, op.titulo)}
              >
                {op.label}
              </button>
            ))}
              <button
                key="Todos_Reportes"
                className="btn-reporte-accion btn-reporte-todos"
                onClick={() => generarPDFTodos()}
              >
                Emitir Todos los Reportes
              </button>
          </div>
        </div>
      
      </div>
    </div>
  );
};

ModalReportesEstudiantes.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  estudiantes: PropTypes.array.isRequired,
  showInfo: PropTypes.func.isRequired,
};

export default ModalReportesEstudiantes;
