import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { analizarPeriodos } from '../../Dashboard/ReportesVisualizacionService';
import { crearEncabezadoInstitucional, normalizarTexto, crearControlPaginas } from './utils';

// ===== ANÁLISIS DE PERÍODOS DE INSCRIPCIÓN PDF =====
export const generarAnalisisPeriodos = async (estudiantes, showAlerta, modalidadSeleccionada = 'todas') => {
  try {
    console.log('🔍 Generando análisis de períodos para modalidad:', modalidadSeleccionada);
    console.log('📊 Total estudiantes recibidos:', estudiantes.length);
    
    const analisis = await analizarPeriodos(estudiantes, modalidadSeleccionada);
    
    console.log('✅ Análisis de períodos obtenido:', analisis);
    
    // Verificar si hay error en el análisis
    if (analisis.error) {
      showAlerta('Error: ' + analisis.error, 'error');
      return;
    }
    
    const doc = new jsPDF();
    const { verificarEspacio, agregarPiePagina } = crearControlPaginas(doc);
    let yPos = crearEncabezadoInstitucional(doc, `CANTIDADES INSCRIPTOS POR PERIODOS EN EL AÑO EN CURSO`);
    
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
    
    // Determinar el total correcto según la modalidad
    let totalInscripciones = 0;
    if (analisis.modalidad === 'TODAS') {
      totalInscripciones = (analisis.resumen?.totalEstudiantes || 0);
    } else {
      totalInscripciones = analisis.totalInscripciones || analisis.totalConPreinscripciones || 0;
    }
    
    doc.text(`Total de inscripciones analizadas: ${totalInscripciones}`, 20, yPos);
    yPos += 6;
    doc.text(`Modalidad seleccionada: ${modalidadSeleccionada}`, 20, yPos);
    yPos += 6;
    
    // Mostrar período según modalidad
    if (analisis.periodoCompleto) {
      doc.text(`Período analizado: ${normalizarTexto(analisis.periodoCompleto)}`, 20, yPos);
      yPos += 6;
    }
    yPos += 10;
    
    // ===== DISTRIBUCIÓN POR VENTANAS TEMPORALES =====
    yPos = verificarEspacio(doc, yPos, 80); // Espacio para la tabla de distribución
    // Manejar diferentes estructuras según la modalidad
    let distribucionData = [];
    
    if (analisis.modalidad === 'PRESENCIAL') {
      // Modalidad PRESENCIAL - mostrar todos los períodos mensuales
      if (analisis.distribucion && analisis.distribucion.length > 0) {
        distribucionData = analisis.distribucion.map(periodo => [
          normalizarTexto(periodo.periodo || 'Sin período'),
          (periodo.inscripciones || periodo.cantidad || 0).toString(),
          `${(parseFloat(periodo.porcentaje) || 0).toFixed(1)}%`,
          periodo.esPreinscripcion ? 'Web' : 'Regular'
        ]);
      }
    } else if (analisis.modalidad === 'SEMIPRESENCIAL') {
      // Modalidad SEMIPRESENCIAL - Usar distribución trimestral completa
      if (analisis.distribucionTrimestre && analisis.distribucionTrimestre.length > 0) {
        distribucionData = analisis.distribucionTrimestre.map(periodo => [
          normalizarTexto(periodo.periodo || 'Sin período'),
          (periodo.inscripciones || periodo.cantidad || 0).toString(),
          `${(parseFloat(periodo.porcentaje) || 0).toFixed(1)}%`,
          periodo.esPreinscripcion ? 'Web' : 'Regular'
        ]);
      }
    } else if (analisis.modalidad === 'TODAS') {
      // Modalidad TODAS - Combinar ambas modalidades de forma organizada
      
      // Primero: Preinscripciones Web de ambas modalidades
      const preinscripciones = [];
      if (analisis.analisisPresencial && analisis.analisisPresencial.distribucion) {
        analisis.analisisPresencial.distribucion.forEach(p => {
          if (p.esPreinscripcion) {
            preinscripciones.push([
              normalizarTexto(p.periodo || 'Sin periodo'),
              (p.inscripciones || p.cantidad || 0).toString(),
              `${(parseFloat(p.porcentaje) || 0).toFixed(1)}%`,
              'Preinscripcion Web (Presencial)'
            ]);
          }
        });
      }
      if (analisis.analisisSemipresencial && analisis.analisisSemipresencial.distribucionTrimestre) {
        analisis.analisisSemipresencial.distribucionTrimestre.forEach(p => {
          if (p.esPreinscripcion) {
            preinscripciones.push([
              normalizarTexto(p.periodo || 'Sin periodo'),
              (p.inscripciones || p.cantidad || 0).toString(),
              `${(parseFloat(p.porcentaje) || 0).toFixed(1)}%`,
              'Preinscripcion Web (Semipresencial)'
            ]);
          }
        });
      }
      
      // Segundo: Períodos regulares SEMIPRESENCIAL (trimestres)
      if (analisis.analisisSemipresencial && analisis.analisisSemipresencial.distribucionTrimestre) {
        analisis.analisisSemipresencial.distribucionTrimestre.forEach(p => {
          if (!p.esPreinscripcion) {
            distribucionData.push([
              `SEMIPRESENCIAL: ${normalizarTexto(p.periodo)}`,
              (p.inscripciones || p.cantidad || 0).toString(),
              `${(parseFloat(p.porcentaje) || 0).toFixed(1)}%`,
              'Regular'
            ]);
          }
        });
      }
      
      // Tercero: Períodos regulares PRESENCIAL (mensuales)
      if (analisis.analisisPresencial && analisis.analisisPresencial.distribucion) {
        analisis.analisisPresencial.distribucion.forEach(p => {
          if (!p.esPreinscripcion) {
            distribucionData.push([
              `PRESENCIAL: ${normalizarTexto(p.periodo)}`,
              (p.inscripciones || p.cantidad || 0).toString(),
              `${(parseFloat(p.porcentaje) || 0).toFixed(1)}%`,
              'Regular'
            ]);
          }
        });
      }
      
      // Insertar preinscripciones al inicio
      distribucionData = [...preinscripciones, ...distribucionData];
    }
    
    if (distribucionData.length > 0) {
      if (yPos > 180) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 65, 119);
      doc.text(normalizarTexto('DISTRIBUCION POR PERIODOS'), 14, yPos);
      yPos += 15;
      
      autoTable(doc, {
        head: [['Período', 'Inscripciones', 'Porcentaje', 'Tipo']],
        body: distribucionData,
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
          0: { cellWidth: 75 },
          1: { cellWidth: 35, halign: 'center' },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 50 }
        },
        margin: { left: 14, right: 14 }
      });
      
      yPos = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(220, 38, 38);
      doc.text('No se encontraron datos de períodos para esta modalidad.', 20, yPos);
      yPos += 15;
    }
    
    // ===== ESTADÍSTICAS TEMPORALES (si existen) =====
    yPos = verificarEspacio(doc, yPos, 50); // Espacio para las estadísticas
    if (analisis.resumen && (analisis.resumen.preinscripcionesHistoricas > 0 || analisis.resumen.preinscripcionesActuales > 0)) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 65, 119);
      doc.text(normalizarTexto('ESTADISTICAS DE PREINSCRIPCIONES WEB'), 14, yPos);
      yPos += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      if (analisis.resumen.preinscripcionesHistoricas > 0) {
        doc.text(`Preinscripciones período histórico: ${analisis.resumen.preinscripcionesHistoricas}`, 20, yPos);
        yPos += 6;
      }
      if (analisis.resumen.preinscripcionesActuales > 0) {
        doc.text(`Preinscripciones período actual: ${analisis.resumen.preinscripcionesActuales}`, 20, yPos);
        yPos += 6;
      }
      yPos += 10;
    }
    
    // ===== ESTADÍSTICAS TEMPORALES =====
    if (analisis.estadisticas) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 65, 119);
      doc.text(normalizarTexto('ESTADISTICAS TEMPORALES'), 14, yPos);
      yPos += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Promedio mensual de inscripciones: ${analisis.estadisticas.promedio}`, 20, yPos);
      yPos += 6;
      doc.text(`Tendencia general: ${analisis.estadisticas.tendencia}`, 20, yPos);
      yPos += 6;
      if (analisis.estadisticas.mesConMayorActividad) {
        doc.text(`Mes con mayor actividad: ${analisis.estadisticas.mesConMayorActividad}`, 20, yPos);
        yPos += 6;
      }
      yPos += 10;
    }
    
    // ===== RECOMENDACIONES (si existen) =====
    yPos = verificarEspacio(doc, yPos, 40); // Espacio para las recomendaciones
    const recomendaciones = [];
    
    if (analisis.resumen) {
      if (analisis.resumen.inscripcionesFueraPeriodo > 0) {
        recomendaciones.push(`${analisis.resumen.inscripcionesFueraPeriodo} inscripciones registradas fuera de los períodos regulares`);
      }
    }
    
    if (recomendaciones.length > 0) {
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 65, 119);
      doc.text(normalizarTexto('RECOMENDACIONES'), 14, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      analisis.recomendaciones.forEach((recomendacion, index) => {
        const texto = normalizarTexto(`${index + 1}. ${recomendacion}`);
        const lineasTexto = doc.splitTextToSize(texto, 160);
        doc.text(lineasTexto, 20, yPos);
        yPos += lineasTexto.length * 5 + 3;
      });
    }
    
    // Agregar pie de página antes de guardar
    agregarPiePagina();
    
    // Guardar el PDF
    doc.save(`Analisis_Periodos_${new Date().toISOString().split('T')[0]}.pdf`);
    showAlerta('Análisis de períodos PDF generado exitosamente', 'success');
    
  } catch (error) {
    console.error('Error al generar análisis de períodos:', error);
    showAlerta('Error al generar análisis de períodos: ' + error.message, 'error');
  }
};

// ===== ANÁLISIS DE PERÍODOS EXCEL =====
export const generarAnalisisPeriodosExcel = async (estudiantes, showAlerta, modalidadSeleccionada = 'todas') => {
  try {
    console.log('Generando Excel de análisis de períodos...');
    
    const analisis = await analizarPeriodos(estudiantes, modalidadSeleccionada);
    console.log('Análisis para Excel:', analisis);
    
    if (analisis.error) {
      showAlerta(analisis.error, 'error');
      return;
    }
    
    const fecha = new Date().toLocaleDateString('es-AR');
    
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Preparar datos para la hoja de Excel
    const datosExcel = [];
    
    // Encabezado
    datosExcel.push(['CEIJA 5 EDUCATIVA']);
    datosExcel.push(['CANTIDADES INSCRIPTOS POR PERIODOS EN EL ANO EN CURSO']);
    datosExcel.push([`Fecha: ${fecha}`]);
    datosExcel.push(['']); // Línea en blanco
    
    // Información general
    let totalInscripciones = 0;
    const modalidadTexto = analisis.modalidad || 'TODAS';
    
    if (analisis.modalidad === 'PRESENCIAL') {
      totalInscripciones = analisis.totalInscripciones || 0;
    } else if (analisis.modalidad === 'SEMIPRESENCIAL') {
      totalInscripciones = analisis.totalInscripciones || 0;
    } else if (analisis.modalidad === 'TODAS') {
      totalInscripciones = (analisis.resumen && analisis.resumen.totalEstudiantes) || 0;
    } else {
      totalInscripciones = analisis.totalInscripciones || 0;
    }
    
    datosExcel.push(['INFORMACION GENERAL']);
    datosExcel.push([`Modalidad analizada: ${modalidadTexto}`]);
    datosExcel.push([`Total de inscripciones: ${totalInscripciones}`]);
    datosExcel.push(['']); // Línea en blanco
    
    // Encabezados de la tabla de distribución
    datosExcel.push(['DISTRIBUCION POR PERIODOS']);
    datosExcel.push(['Periodo', 'Inscripciones', 'Porcentaje', 'Tipo']);
    
    // Obtener datos de distribución según modalidad
    let distribucionData = [];
    
    if (analisis.modalidad === 'PRESENCIAL' && Array.isArray(analisis.distribucion)) {
      distribucionData = analisis.distribucion;
    } else if (analisis.modalidad === 'SEMIPRESENCIAL' && Array.isArray(analisis.distribucionTrimestre)) {
      distribucionData = analisis.distribucionTrimestre;
    } else if (analisis.modalidad === 'TODAS') {
      // Organizar jerárquicamente: Preinscripciones -> SEMIPRESENCIAL -> PRESENCIAL
      
      // Primero: Recolectar preinscripciones
      const preinscripciones = [];
      const presencial = analisis.analisisPresencial?.distribucion || [];
      const semipresencial = analisis.analisisSemipresencial?.distribucionTrimestre || [];
      
      presencial.forEach(p => {
        if (p.esPreinscripcion) preinscripciones.push({ ...p, modalidadLabel: 'PRESENCIAL', periodo: normalizarTexto(p.periodo || 'Sin periodo') });
      });
      semipresencial.forEach(p => {
        if (p.esPreinscripcion) preinscripciones.push({ ...p, modalidadLabel: 'SEMIPRESENCIAL', periodo: normalizarTexto(p.periodo || 'Sin periodo') });
      });
      
      // Segundo: Períodos regulares
      const regulares = [];
      
      // Agregar SEMIPRESENCIAL primero
      semipresencial.forEach(p => {
        if (!p.esPreinscripcion) regulares.push({ ...p, modalidadLabel: 'SEMIPRESENCIAL' });
      });
      
      // Luego PRESENCIAL
      presencial.forEach(p => {
        if (!p.esPreinscripcion) regulares.push({ ...p, modalidadLabel: 'PRESENCIAL' });
      });
      
      distribucionData = [...preinscripciones, ...regulares];
    }
    
    // Agregar datos de distribución
    if (distribucionData.length > 0) {
      distribucionData.forEach(periodo => {
        const label = periodo.modalidadLabel ? `${periodo.modalidadLabel} ` : '';
        const nombrePeriodo = `${label}${normalizarTexto(periodo.periodo || 'Sin periodo')}`;
        const cantidad = periodo.inscripciones || periodo.cantidad || 0;
        const porcentaje = `${(parseFloat(periodo.porcentaje) || 0).toFixed(1)}%`;
        const tipo = periodo.esPreinscripcion ? 'Web' : 'Regular';
        
        datosExcel.push([nombrePeriodo, cantidad, porcentaje, tipo]);
      });
    } else {
      datosExcel.push(['No se encontraron datos de distribucion por periodos', '', '', '']);
    }
    
    // Crear hoja de trabajo
    const worksheet = XLSX.utils.aoa_to_sheet(datosExcel);
    
    // Aplicar estilos básicos (ancho de columnas)
    worksheet['!cols'] = [
      { wch: 40 }, // Columna A (Período)
      { wch: 15 }, // Columna B (Inscripciones)
      { wch: 12 }, // Columna C (Porcentaje)
      { wch: 15 }  // Columna D (Tipo)
    ];
    
    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analisis Periodos');
    
    // Generar y descargar el archivo Excel
    const nombreArchivo = `Analisis_Periodos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);
    
    showAlerta('Análisis de períodos Excel generado exitosamente', 'success');
    
  } catch (error) {
    console.error('Error al generar análisis de períodos Excel:', error);
    showAlerta('Error al generar análisis de períodos Excel: ' + error.message, 'error');
  }
};