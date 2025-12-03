import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { crearEncabezadoInstitucional, normalizarTexto, exportarExcel, calcularPorcentaje, crearControlPaginas } from './utils';

// ===== ESTADO DE INSCRIPCIONES ESTUDIANTILES PDF =====
export const generarAnalisisRendimiento = async (estudiantes, showAlerta, modalidadSeleccionada = 'todas') => {
  try {
    const analisis = analizarEstadoInscripciones(estudiantes, modalidadSeleccionada);
    
    const doc = new jsPDF();
    const { verificarEspacio, agregarPiePagina } = crearControlPaginas(doc);
    let yPos = crearEncabezadoInstitucional(doc, 'Distribución Cuantitativa de Estudiantes por Estado de Actividad');
    
    // ===== INFORMACIÓN GENERAL =====
    yPos = verificarEspacio(doc, yPos, 40); // Espacio para la sección de información general
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 65, 119);
    doc.text(normalizarTexto('INFORMACION GENERAL'), 14, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total de estudiantes: ${analisis.total}`, 20, yPos);
    yPos += 6;
    doc.text(`Modalidad analizada: ${modalidadSeleccionada.toUpperCase()}`, 20, yPos);
    yPos += 6;
    doc.text(`Ano lectivo: ${analisis.anioLectivo}`, 20, yPos);
    yPos += 15;
    
    // ===== RESUMEN DE ESTADOS =====
    yPos = verificarEspacio(doc, yPos, 60); // Espacio para la tabla de resumen
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 65, 119);
    doc.text(normalizarTexto('RESUMEN DE ESTADOS'), 14, yPos);
    yPos += 15;
    
    const resumenData = [
      ['Estudiantes activos', analisis.activos.toString(), `${analisis.porcentajeActivos}%`],
      ['Estudiantes inactivos', analisis.inactivos.toString(), `${analisis.porcentajeInactivos}%`]
    ];
    
    autoTable(doc, {
      head: [['Estado', 'Cantidad', 'Porcentaje']],
      body: resumenData,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: [45, 65, 119],
        textColor: 255,
        fontSize: 11,
        font: 'helvetica',
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        font: 'helvetica'
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 40, halign: 'center' }
      },
      margin: { left: 14, right: 14 }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // ===== DESGLOSE POR MODALIDAD =====
    yPos = verificarEspacio(doc, yPos, 80); // Espacio para la sección de desglose
    if (analisis.desglosePorModalidad && Object.keys(analisis.desglosePorModalidad).length > 0) {
      if (yPos > 180) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 65, 119);
      doc.text(normalizarTexto('DESGLOSE POR MODALIDAD'), 14, yPos);
      yPos += 15;
      
      const modalidadData = Object.entries(analisis.desglosePorModalidad).map(([modalidad, datos]) => [
        modalidad || 'Sin modalidad',
        datos.total.toString(),
        datos.activos.toString(),
        `${datos.porcentajeActivos}%`,
        datos.inactivos.toString(),
        `${datos.porcentajeInactivos}%`
      ]);
      
      autoTable(doc, {
        head: [['Modalidad', 'Total', 'Activos', '%', 'Inactivos', '%']],
        body: modalidadData,
        startY: yPos,
        theme: 'striped',
        headStyles: {
          fillColor: [45, 65, 119],
          textColor: 255,
          fontSize: 10,
          font: 'helvetica',
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          font: 'helvetica'
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 25, halign: 'center' },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 25, halign: 'center' },
          4: { cellWidth: 25, halign: 'center' },
          5: { cellWidth: 25, halign: 'center' }
        },
        margin: { left: 14, right: 14 }
      });
      
      yPos = doc.lastAutoTable.finalY + 15;
    }
    
    // ===== NOTAS ACLARATORIAS =====
    yPos = verificarEspacio(doc, yPos, 50); // Espacio para las notas
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 65, 119);
    doc.text(normalizarTexto('DEFINICIONES'), 14, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const notas = [
      `Estudiante ACTIVO: Estudiante con inscripcion vigente en el ano lectivo ${analisis.anioLectivo}`,
      'Estudiante INACTIVO: Estudiante sin inscripcion en el ano lectivo actual'
    ];
    
    notas.forEach(nota => {
      const textoNota = normalizarTexto(`• ${nota}`);
      const lineasTexto = doc.splitTextToSize(textoNota, 160);
      doc.text(lineasTexto, 20, yPos);
      yPos += lineasTexto.length * 5 + 3;
    });
    
    // Agregar pie de página antes de guardar
    agregarPiePagina();
    
    // Guardar el PDF
    doc.save(`Estado_Inscripciones_Estudiantiles_${new Date().toISOString().split('T')[0]}.pdf`);
    showAlerta('Estado de inscripciones estudiantiles PDF generado exitosamente', 'success');
    
  } catch (error) {
    console.error('Error al generar estado de inscripciones estudiantiles:', error);
    showAlerta('Error al generar estado de inscripciones estudiantiles: ' + error.message, 'error');
  }
};

// ===== ESTADO PORCENTUAL INSCRIPCIONES ACTIVAS-INACTIVAS EXCEL =====
export const generarAnalisisRendimientoExcel = async (estudiantes, showAlerta, modalidadSeleccionada = 'todas') => {
  try {
    const analisis = analizarEstadoInscripciones(estudiantes, modalidadSeleccionada);
    
    const datos = [
      // Información general
      ['=== INFORMACION GENERAL ==='],
      ['Métrica', 'Valor'],
      ['Modalidad analizada', modalidadSeleccionada.toUpperCase()],
      ['Total de estudiantes', analisis.total],
      ['Año lectivo', analisis.anioLectivo],
      ['Fecha del reporte', new Date().toLocaleDateString('es-ES')],
      [''],
      
      // Resumen de estados
      ['=== RESUMEN DE ESTADOS ==='],
      ['Estado', 'Cantidad', 'Porcentaje'],
      ['Activos', analisis.activos, `${analisis.porcentajeActivos}%`],
      ['Inactivos', analisis.inactivos, `${analisis.porcentajeInactivos}%`],
      ['']
    ];
    
    // Desglose por modalidad (si existe)
    if (analisis.desglosePorModalidad && Object.keys(analisis.desglosePorModalidad).length > 0) {
      datos.push(['=== DESGLOSE POR MODALIDAD ===']);
      datos.push(['Modalidad', 'Total', 'Activos', '% Activos', 'Inactivos', '% Inactivos']);
      
      Object.entries(analisis.desglosePorModalidad).forEach(([modalidad, info]) => {
        datos.push([
          modalidad || 'Sin modalidad',
          info.total,
          info.activos,
          `${info.porcentajeActivos}%`,
          info.inactivos,
          `${info.porcentajeInactivos}%`
        ]);
      });
      
      datos.push(['']);
    }
    
    // Definiciones
    datos.push(['=== DEFINICIONES ===']);
    datos.push(['Concepto', 'Definición']);
    datos.push(['Estudiante ACTIVO', `Inscripción vigente en el año ${analisis.anioLectivo}`]);
    datos.push(['Estudiante INACTIVO', 'Sin inscripción en el año lectivo actual']);
    
    const exito = exportarExcel(
      datos, 
      'Estado_Inscripciones_Estudiantiles', 
      'ESTADO PORCENTUAL INSCRIPCIONES ACTIVAS-INACTIVAS'
    );
    
    if (exito) {
      showAlerta('Estado porcentual inscripciones Excel generado exitosamente', 'success');
    } else {
      showAlerta('Error al generar estado porcentual inscripciones Excel', 'error');
    }
    
  } catch (error) {
    console.error('Error al generar estado porcentual inscripciones Excel:', error);
    showAlerta('Error al generar estado porcentual inscripciones Excel: ' + error.message, 'error');
  }
};

// ===== FUNCIÓN AUXILIAR PARA ANÁLISIS DE ESTADO DE INSCRIPCIONES =====
// ===== FUNCIÓN AUXILIAR PARA ANÁLISIS DE ESTADO DE INSCRIPCIONES =====
const analizarEstadoInscripciones = (estudiantes, modalidadSeleccionada) => {
  // Filtrar estudiantes por modalidad si es necesario
  let estudiantesFiltrados = estudiantes;
  if (modalidadSeleccionada !== 'todas') {
    estudiantesFiltrados = estudiantes.filter(est => 
      est.modalidad && est.modalidad.toLowerCase().includes(modalidadSeleccionada.toLowerCase())
    );
  }
  
  const total = estudiantesFiltrados.length;
  const anioActual = new Date().getFullYear();
  const desglosePorModalidad = {};
  
  let activos = 0;
  let inactivos = 0;
  
  // Funciones robustas para detectar estado
  const esActivo = (valor) => valor === true || valor === 1 || valor === '1' || valor === 'true';
  const esInactivo = (valor) => valor === false || valor === 0 || valor === '0' || valor === 'false';

  // Analizar cada estudiante
  estudiantesFiltrados.forEach(estudiante => {
    const modalidad = estudiante.modalidad || 'Sin modalidad';
    // Inicializar desglose por modalidad si no existe
    if (!desglosePorModalidad[modalidad]) {
      desglosePorModalidad[modalidad] = {
        total: 0,
        activos: 0,
        inactivos: 0
      };
    }
    desglosePorModalidad[modalidad].total++;
    if (esActivo(estudiante.activo)) {
      activos++;
      desglosePorModalidad[modalidad].activos++;
    } else if (esInactivo(estudiante.activo)) {
      inactivos++;
      desglosePorModalidad[modalidad].inactivos++;
    }
  });
  
  // Calcular porcentajes por modalidad
  Object.keys(desglosePorModalidad).forEach(modalidad => {
    const datos = desglosePorModalidad[modalidad];
    datos.porcentajeActivos = ((datos.activos / datos.total) * 100).toFixed(1);
    datos.porcentajeInactivos = ((datos.inactivos / datos.total) * 100).toFixed(1);
  });
  
  // Calcular porcentajes generales
  const porcentajeActivos = ((activos / total) * 100).toFixed(1);
  const porcentajeInactivos = ((inactivos / total) * 100).toFixed(1);
  
  return {
    total,
    activos,
    inactivos,
    porcentajeActivos,
    porcentajeInactivos,
    desglosePorModalidad,
    anioLectivo: anioActual
  };
};