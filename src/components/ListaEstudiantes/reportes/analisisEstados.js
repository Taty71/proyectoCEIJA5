import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { analizarEstados } from '../../Dashboard/ReportesVisualizacionService';
import { crearEncabezadoInstitucional, normalizarTexto, exportarExcel, crearControlPaginas } from './utils';

// ===== DETERMINACIÓN PORCENTUAL DE INSCRIPCIONES PDF =====
export const generarAnalisisEstados = (estudiantes, showAlerta) => {
  try {
    const analisis = analizarEstados(estudiantes);
    
    const doc = new jsPDF();
    const { verificarEspacio, agregarPiePagina } = crearControlPaginas(doc);
    let yPos = crearEncabezadoInstitucional(doc, 'DETERMINACIÓN PORCENTUAL DE INSCRIPCIONES');
    
    // ===== RESUMEN GENERAL =====
    yPos = verificarEspacio(doc, yPos, 40); // Espacio para el resumen general
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 65, 119);
    doc.text(normalizarTexto('RESUMEN GENERAL'), 14, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total de inscripciones analizadas: ${analisis.resumen.total}`, 20, yPos);
    yPos += 6;
    doc.text(`Estados diferentes encontrados: ${analisis.resumen.estados}`, 20, yPos);
    yPos += 6;
    doc.text(`Fecha de análisis: ${analisis.resumen.fechaAnalisis}`, 20, yPos);
    yPos += 15;
    
    // ===== MÉTRICAS CLAVE =====
    yPos = verificarEspacio(doc, yPos, 60); // Espacio para las métricas clave
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 65, 119);
    doc.text(normalizarTexto('METRICAS CLAVE'), 14, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Estado más frecuente: ${analisis.metricas.estadoMasFrecuente}`, 20, yPos);
    yPos += 6;
    doc.text(`Tasa de inscripciones completas: ${analisis.metricas.tasaAprobacion}%`, 20, yPos);
    yPos += 6;
    doc.text(`Tasa de inscripciones pendientes: ${analisis.metricas.tasaPendientes}%`, 20, yPos);
    yPos += 6;
    
    // Calcular y mostrar inscripciones anuladas si existen
    const estadoAnulado = analisis.distribucion.find(d => d.estado && d.estado.toLowerCase().includes('anulad'));
    if (estadoAnulado) {
      doc.text(`Tasa de inscripciones anuladas: ${estadoAnulado.porcentaje}%`, 20, yPos);
      yPos += 6;
    }
    yPos += 10;
    
    // ===== DISTRIBUCIÓN DETALLADA POR ESTADO =====
    yPos = verificarEspacio(doc, yPos, 80); // Espacio para la distribución detallada
    if (yPos > 160) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 65, 119);
    doc.text(normalizarTexto('DISTRIBUCION POR ESTADO'), 14, yPos);
    yPos += 15;
    
    // Crear tabla con los datos de distribución
    const tableData = analisis.distribucion.map(estado => [
      estado.estado,
      estado.cantidad.toString(),
      `${estado.porcentaje}%`,
      estado.estudiantes.slice(0, 3).map(e => e.nombre).join(', ') + (estado.estudiantes.length > 3 ? '...' : '')
    ]);
    
    autoTable(doc, {
      head: [['Estado', 'Cantidad', 'Porcentaje', 'Ejemplos de Estudiantes']],
      body: tableData,
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
        0: { cellWidth: 40 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 80 }
      },
      margin: { left: 14, right: 14 }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // ===== DISTRIBUCIÓN POR MODALIDAD =====
    yPos = verificarEspacio(doc, yPos, 80); // Espacio para la distribución por modalidad
    if (analisis.distribucionPorModalidad && Object.keys(analisis.distribucionPorModalidad).length > 0) {
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 65, 119);
      doc.text(normalizarTexto('DESGLOSE POR MODALIDAD'), 14, yPos);
      yPos += 15;
      
      // Crear tabla con desglose por modalidad
      const modalidadData = Object.entries(analisis.distribucionPorModalidad).map(([modalidad, datos]) => [
        modalidad || 'Sin modalidad',
        datos.total.toString(),
        datos.completas.toString(),
        `${datos.porcentajeCompletas}%`,
        datos.pendientes.toString(),
        `${datos.porcentajePendientes}%`,
        datos.anuladas.toString(),
        `${datos.porcentajeAnuladas}%`
      ]);
      
      autoTable(doc, {
        head: [['Modalidad', 'Total', 'Completas', '%', 'Pendientes', '%', 'Anuladas', '%']],
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
          0: { cellWidth: 45 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 18, halign: 'center' },
          4: { cellWidth: 22, halign: 'center' },
          5: { cellWidth: 18, halign: 'center' },
          6: { cellWidth: 20, halign: 'center' },
          7: { cellWidth: 18, halign: 'center' }
        },
        margin: { left: 14, right: 14 }
      });
      
      yPos = doc.lastAutoTable.finalY + 15;
    }
    
    // ===== ALERTAS Y RECOMENDACIONES =====
    yPos = verificarEspacio(doc, yPos, 50); // Espacio para alertas y recomendaciones
    if (analisis.metricas.alertas.length > 0) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 65, 119);
      doc.text(normalizarTexto('ALERTAS Y RECOMENDACIONES'), 14, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      analisis.metricas.alertas.forEach(alerta => {
        const textoAlerta = normalizarTexto(`• ${alerta.mensaje}`);
        const lineasTexto = doc.splitTextToSize(textoAlerta, 160);
        doc.text(lineasTexto, 20, yPos);
        yPos += lineasTexto.length * 5 + 3;
      });
    }
    
    // Agregar pie de página antes de guardar
    agregarPiePagina();
    
    // Guardar el PDF
    doc.save(`Determinacion_Porcentual_Inscripciones_${new Date().toISOString().split('T')[0]}.pdf`);
    showAlerta('Determinación porcentual de inscripciones PDF generado exitosamente', 'success');
    
  } catch (error) {
    console.error('Error al generar determinación porcentual de inscripciones:', error);
    showAlerta('Error al generar determinación porcentual de inscripciones: ' + error.message, 'error');
  }
};

// ===== DETERMINACIÓN PORCENTUAL DE INSCRIPCIONES EXCEL =====
export const generarAnalisisEstadosExcel = (estudiantes, showAlerta) => {
  try {
    const analisis = analizarEstados(estudiantes);
    
    // Calcular estado anulado si existe
    const estadoAnulado = analisis.distribucion.find(d => d.estado && d.estado.toLowerCase().includes('anulad'));
    const tasaAnuladas = estadoAnulado ? estadoAnulado.porcentaje : '0.0';
    
    const datos = [
      // Título principal
      ['DETERMINACIÓN PORCENTUAL DE INSCRIPCIONES'],
      [''],
      // Resumen General - Tabla Doble Entrada
      ['═══ RESUMEN GENERAL ═══'],
      ['Métrica', 'Valor'],
      ['─────────────────────────', '─────────────────'],
      ['Total inscripciones', analisis.resumen.total],
      ['Estados diferentes', analisis.resumen.estados],
      ['Fecha análisis', analisis.resumen.fechaAnalisis],
      [''],
      // Métricas Clave - Tabla Doble Entrada
      ['═══ MÉTRICAS CLAVE ═══'],
      ['Métrica', 'Valor'],
      ['─────────────────────────', '─────────────────'],
      ['Estado más frecuente', analisis.metricas.estadoMasFrecuente],
      ['Tasa inscripciones completas', analisis.metricas.tasaAprobacion + '%'],
      ['Tasa inscripciones pendientes', analisis.metricas.tasaPendientes + '%'],
      ['Tasa inscripciones anuladas', tasaAnuladas + '%'],
      [''],
      // Distribución Detallada - Tabla Doble Entrada
      ['═══ DISTRIBUCIÓN POR ESTADO ═══'],
      ['Estado', 'Cantidad', 'Porcentaje', 'Estudiantes (primeros 5)'],
      ['─────────────', '──────────', '────────────', '──────────────────────────────────'],
      ...analisis.distribucion.map(estado => [
        estado.estado,
        estado.cantidad,
        estado.porcentaje + '%',
        estado.estudiantes.slice(0, 5).map(e => e.nombre).join(', ')
      ]),
      [''],
      // Desglose por Modalidad - Tabla Doble Entrada
      ['═══ DESGLOSE POR MODALIDAD ═══'],
      ['Modalidad', 'Total', 'Completas', '% Completas', 'Pendientes', '% Pendientes', 'Anuladas', '% Anuladas'],
      ['──────────────', '────────', '──────────', '───────────', '────────────', '──────────────', '──────────', '────────────'],
      ...(analisis.distribucionPorModalidad ? Object.entries(analisis.distribucionPorModalidad).map(([modalidad, datos]) => [
        modalidad || 'Sin modalidad',
        datos.total,
        datos.completas,
        datos.porcentajeCompletas + '%',
        datos.pendientes,
        datos.porcentajePendientes + '%',
        datos.anuladas,
        datos.porcentajeAnuladas + '%'
      ]) : [['Sin datos', 0, 0, '0%', 0, '0%', 0, '0%']]),
      [''],
      // Alertas - Tabla Doble Entrada
      ['═══ ALERTAS ═══'],
      ['Tipo', 'Mensaje'],
      ['─────────────', '──────────────────────────────────────────────'],
      ...analisis.metricas.alertas.map(alerta => [alerta.tipo, alerta.mensaje])
    ];
    
    const exito = exportarExcel(datos, 'Determinacion_Porcentual_Inscripciones', 'DETERMINACIÓN PORCENTUAL DE INSCRIPCIONES');
    
    if (exito) {
      showAlerta('Determinación porcentual de inscripciones Excel generada exitosamente', 'success');
    } else {
      showAlerta('Error al generar determinación porcentual de inscripciones Excel', 'error');
    }
    
  } catch (error) {
    console.error('Error al generar determinación porcentual de inscripciones Excel:', error);
    showAlerta('Error al generar determinación porcentual de inscripciones Excel: ' + error.message, 'error');
  }
};