import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { analizarPeriodos } from '../../Dashboard/ReportesVisualizacionService';
import { crearEncabezadoInstitucional, normalizarTexto, crearControlPaginas, exportarExcel } from './utils';

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
// ===== ANÁLISIS DE PERÍODOS EXCEL =====
export const generarAnalisisPeriodosExcel = async (estudiantes, showAlerta, modalidadSeleccionada = 'todas') => {
  try {
    const analisis = await analizarPeriodos(estudiantes, modalidadSeleccionada);

    if (analisis.error) {
      showAlerta(analisis.error, 'error');
      return;
    }

    // MATRIZ DE DOBLE ENTRADA
    // Filas: Períodos (Meses / Trimestres)
    // Columnas: Presencial, Semipresencial, Preinscripciones, Total

    // Obtener lista unificada de períodos
    const periodosMap = new Map();

    // Helper para normalizar claves de perido
    const normKey = (p) => normalizarTexto(p).toUpperCase();

    // 1. Procesar datos PRESENCIAL
    const presencialData = analisis.analisisPresencial?.distribucion || [];
    presencialData.forEach(item => {
      const key = normKey(item.periodo);
      if (!periodosMap.has(key)) periodosMap.set(key, { label: item.periodo, presencial: 0, semi: 0, web: 0 });

      if (item.esPreinscripcion) {
        periodosMap.get(key).web += (item.inscripciones || item.cantidad || 0);
      } else {
        periodosMap.get(key).presencial += (item.inscripciones || item.cantidad || 0);
      }
    });

    // 2. Procesar datos SEMIPRESENCIAL
    const semiData = analisis.analisisSemipresencial?.distribucionTrimestre || [];
    semiData.forEach(item => {
      const key = normKey(item.periodo);
      if (!periodosMap.has(key)) periodosMap.set(key, { label: item.periodo, presencial: 0, semi: 0, web: 0 });

      if (item.esPreinscripcion) {
        periodosMap.get(key).web += (item.inscripciones || item.cantidad || 0);
      } else {
        periodosMap.get(key).semi += (item.inscripciones || item.cantidad || 0);
      }
    });

    // Si modalidad seleccionada es específica, usar solo esos datos (aunque la lógica de arriba ya cubre "todas", 
    // si analisis.analisisPresencial es null, no pasa nada).
    // Si la función analizarPeriodos devuelve directamente la distribución en 'distribucion' (caso presencial solo)
    if (modalidadSeleccionada === 'PRESENCIAL' && analisis.distribucion) {
      analisis.distribucion.forEach(item => {
        const key = normKey(item.periodo);
        if (!periodosMap.has(key)) periodosMap.set(key, { label: item.periodo, presencial: 0, semi: 0, web: 0 });
        if (item.esPreinscripcion) periodosMap.get(key).web += item.cantidad;
        else periodosMap.get(key).presencial += item.cantidad;
      });
    }
    // Idem para Semipresencial solo
    if (modalidadSeleccionada === 'SEMIPRESENCIAL' && analisis.distribucionTrimestre) {
      analisis.distribucionTrimestre.forEach(item => {
        const key = normKey(item.periodo);
        if (!periodosMap.has(key)) periodosMap.set(key, { label: item.periodo, presencial: 0, semi: 0, web: 0 });
        if (item.esPreinscripcion) periodosMap.get(key).web += item.cantidad;
        else periodosMap.get(key).semi += item.cantidad;
      });
    }

    // Convertir Map a Array y ordenar (opcional, por orden de aparición original suele ser cronológico)
    const datosMatriz = Array.from(periodosMap.values());

    // Construir tabla final
    const headers = ['Período', 'Presencial', 'Semipresencial', 'Preinscripción Web', 'Total'];
    const tableRows = datosMatriz.map(row => {
      const total = row.presencial + row.semi + row.web;
      return [
        row.label,
        row.presencial,
        row.semi,
        row.web,
        total
      ];
    });

    // Agregar Fila de Totales Generales
    const totalPres = datosMatriz.reduce((acc, r) => acc + r.presencial, 0);
    const totalSemi = datosMatriz.reduce((acc, r) => acc + r.semi, 0);
    const totalWeb = datosMatriz.reduce((acc, r) => acc + r.web, 0);
    const totalGen = totalPres + totalSemi + totalWeb;

    tableRows.push([
      'TOTAL GENERAL',
      totalPres,
      totalSemi,
      totalWeb,
      totalGen
    ]);

    const datosFinales = [
      headers,
      ...tableRows
    ];

    const extraHeaderRows = [];
    const customMerges = [];

    // Agregar ANÁLISIS DE DATOS
    datosFinales.push(['']);

    const analysisTitleIndex = datosFinales.length;
    extraHeaderRows.push(analysisTitleIndex);
    datosFinales.push(['═══ ANÁLISIS DE DATOS ═══', '', '', '', '']); // Padding for 5 cols

    // Merge Título Sección A-D (0-3)
    const titleRowExcelIndex = analysisTitleIndex + 6;
    customMerges.push({
      s: { r: titleRowExcelIndex, c: 0 },
      e: { r: titleRowExcelIndex, c: 3 }
    });

    const obsHeaderIndex = datosFinales.length;
    extraHeaderRows.push(obsHeaderIndex);
    datosFinales.push(['#', 'Detalle', '', '', '']);

    // Merge Header Row ("Detalle") B-D (1-3)
    const headerRowExcelIndex = obsHeaderIndex + 6;
    customMerges.push({
      s: { r: headerRowExcelIndex, c: 1 },
      e: { r: headerRowExcelIndex, c: 3 }
    });

    if (analisis.recomendaciones && analisis.recomendaciones.length > 0) {
      analisis.recomendaciones.forEach((rec, index) => {
        const currentRowIndex = datosFinales.length;
        const excelRowIndex = currentRowIndex + 6;
        datosFinales.push([index + 1, rec, '', '', '']);

        customMerges.push({
          s: { r: excelRowIndex, c: 1 },
          e: { r: excelRowIndex, c: 3 } // Merge cols B-D (1-3)
        });
      });
    } else {
      const currentRowIndex = datosFinales.length;
      const excelRowIndex = currentRowIndex + 6;
      datosFinales.push(['-', 'Sin recomendaciones particulares.', '', '', '']);
      customMerges.push({
        s: { r: excelRowIndex, c: 1 },
        e: { r: excelRowIndex, c: 3 }
      });
    }

    const exito = exportarExcel(datosFinales, 'Analisis_Periodos', 'CANTIDADES INSCRIPTOS POR PERIODOS', extraHeaderRows, customMerges);

    if (exito) {
      showAlerta('Análisis de períodos Excel generado exitosamente', 'success');
    } else {
      showAlerta('Error al generar análisis de períodos Excel', 'error');
    }

  } catch (error) {
    console.error('Error al generar análisis de períodos Excel:', error);
    showAlerta('Error al generar análisis de períodos Excel: ' + error.message, 'error');
  }
};