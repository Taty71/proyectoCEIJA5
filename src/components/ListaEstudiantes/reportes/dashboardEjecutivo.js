import jsPDF from 'jspdf';
import { generarKPIsAvanzados } from '../../Dashboard/ReportesVisualizacionService';
import { crearEncabezadoInstitucional, normalizarTexto, exportarExcel, crearControlPaginas } from './utils';

// ===== DASHBOARD EJECUTIVO PDF =====
export const generarDashboardEjecutivo = (estudiantes, showAlerta) => {
  try {
    const doc = new jsPDF();
    
    // Usar funciones centralizadas de control de páginas
    const { agregarPiePagina, verificarEspacio } = crearControlPaginas(doc);
    
    // Crear encabezado
    let yPos = crearEncabezadoInstitucional(doc, 'INFORME DE GESTION - INSCRIPCION ESTUDIANTES');
    
    // ===== RESUMEN EJECUTIVO EDUCATIVO =====
    doc.setFontSize(14); // Reducido de 16 a 14 para que quepa
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200); // Azul para títulos principales
    doc.text(normalizarTexto('RESUMEN EJECUTIVO - INDICADORES DEL PROCESO DE INSCRIPCION'), 14, yPos);
    yPos += 15;
    
    // Generar KPIs avanzados
    const { kpisAvanzados, kpisDecisiones, alertas, recomendaciones } = generarKPIsAvanzados(estudiantes);
    
    // === KPIs OPTIMIZADOS PARA TOMA DE DECISIONES ===
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro para texto base
    
    // Estado General con explicación clara
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 100, 200); // Azul para títulos de sección
    doc.text(`1. SITUACION ACTUAL DE ESTUDIANTES:`, 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Negro para contenido
    doc.text(`• Estudiantes Activos: ${kpisDecisiones.estadoGeneral.tasaEstudiantesActivos.valor}% (${kpisDecisiones.estadoGeneral.tasaEstudiantesActivos.interpretacion})`, 25, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`   Indica qué porcentaje de estudiantes continua activamente sus estudios`, 27, yPos);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro para siguiente línea
    yPos += 8;
    
    doc.text(`• Estudiantes Inactivos: ${kpisDecisiones.estadoGeneral.tasaEstudiantesInactivos.valor}%`, 25, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`   Estudiantes que necesitan reactivacion o seguimiento especial`, 27, yPos);
    doc.setFontSize(12);
    doc.setTextColor(0, 100, 200); // Azul para siguiente título
    yPos += 10;
    
    // Proceso de Inscripción con explicación clara
    doc.setFont('helvetica', 'bold');
    doc.text(`2. PROCESO DE MATRICULACION:`, 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    const pendienteValor = kpisDecisiones.procesoInscripcion.tasaInscripcionesPendientes.valor;
    // Usar solo negro para contenido
    doc.setTextColor(0, 0, 0); // Negro para todo el contenido
    
    doc.text(`• Inscripciones Pendientes: ${pendienteValor}% - ${kpisDecisiones.procesoInscripcion.tasaInscripcionesPendientes.interpretacion}`, 25, yPos);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    yPos += 6;
    doc.text(`   Estudiantes que iniciaron pero no completaron su inscripcion`, 27, yPos);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro para siguiente línea
    yPos += 8;
    
    doc.text(`• Inscripciones Completas: ${kpisDecisiones.procesoInscripcion.tasaInscripcionesCompletas.valor}%`, 25, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`   Estudiantes con documentacion completa y matricula finalizada`, 27, yPos);
    doc.setFontSize(12);
    doc.setTextColor(0, 100, 200); // Azul para siguiente título
    yPos += 10;
    
    // ===== DISTRIBUCIÓN POR MODALIDADES EDUCATIVAS =====
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(normalizarTexto('3. MODALIDADES EDUCATIVAS Y RENDIMIENTO:'), 20, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    // Mostrar distribución de matrícula con detalles claros
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200); // Azul para subtítulos
    doc.text('Distribución de Estudiantes:', 25, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Negro para contenido
    
    kpisDecisiones.distribucionMatricula.porcentajeMatriculaPorModalidad.forEach(modalidad => {
      doc.text(normalizarTexto(`• ${modalidad.modalidad.toUpperCase()}: ${modalidad.cantidad} estudiantes (${modalidad.valor}%)`), 30, yPos);
      yPos += 5;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`   Activos: ${modalidad.estudiantesActivos} | Inactivos: ${modalidad.estudiantesInactivos}`, 32, yPos);
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0); // Negro para siguiente línea
      yPos += 6;
    });
    
    // Mostrar eficiencia por modalidad con interpretación clara
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200); // Azul para subtítulos
    doc.text(normalizarTexto('Efectividad por Modalidad:'), 25, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    
    kpisDecisiones.eficienciaPorModalidad.tasaActividadPorModalidad.forEach(modalidad => {
      // Usar solo negro para toda la información
      doc.setTextColor(0, 0, 0); // Negro para todo el contenido
      doc.text(normalizarTexto(`• ${modalidad.modalidad}: ${modalidad.valor}% (${modalidad.interpretacion})`), 30, yPos);
      yPos += 6;
    });
    
    yPos += 10;
    
    // ===== ÍNDICE DE CALIDAD ADMINISTRATIVA =====
    // Verificar si necesitamos nueva página ANTES de agregar el título
    console.log('YPos antes de calidad administrativa:', yPos);
    if (yPos > 650) { // Ajustado para A4: dejar espacio para contenido completo
      agregarPiePagina();
      doc.addPage();
      yPos = 40;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200); // Azul para títulos principales
    doc.text(normalizarTexto('INDICE DE CALIDAD ADMINISTRATIVA:'), 20, yPos);
    yPos += 20;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    // Índice de Calidad Administrativa con interpretación clara
    // Usar azul solo para el valor principal
    doc.setTextColor(0, 100, 200); // Azul para dato importante
    doc.text(`• CALIDAD ADMINISTRATIVA GENERAL: ${kpisDecisiones.indiceCalidadEducativa.valor}%`, 25, yPos);
    yPos += 10;
    doc.setTextColor(0, 0, 0); // Negro para interpretación
    doc.text(`  ${kpisDecisiones.indiceCalidadEducativa.interpretacion}`, 30, yPos);
    yPos += 18;
    
    // Componentes del índice con descripción administrativa
    yPos = verificarEspacio(doc, yPos, 40); // Espacio para título de componentes
    doc.setTextColor(0, 0, 0); // Negro para todo
    doc.text(`• Componentes de la Calidad Administrativa:`, 25, yPos);
    yPos += 15;
    
    Object.entries(kpisDecisiones.indiceCalidadEducativa.componentes).forEach(([componente, data]) => {
      yPos = verificarEspacio(doc, yPos, 25); // Espacio para cada componente
      doc.setTextColor(0, 0, 0); // Negro para componentes
      doc.text(`  - ${componente}: ${data.valor.toFixed(1)}% (peso: ${data.peso}%)`, 30, yPos);
      yPos += 8;
      // Agregar descripción en letra más pequeña
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100); // Gris para descripciones
      doc.text(`    ${data.descripcion}`, 32, yPos);
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0); // Volver a negro
      yPos += 15;
    });
    
    yPos = verificarEspacio(doc, yPos, 30); // Espacio para indicadores
    doc.setTextColor(0, 0, 0); // Negro para indicadores
    doc.text(`• Indicadores Complementarios:`, 25, yPos);
    yPos += 12;
    doc.text(`  - Promedio Mensual de Inscripciones: ${kpisAvanzados.tendenciasTemporales.promedioMensual}`, 30, yPos);
    yPos += 8;
    doc.text(`  - Tendencia General: ${kpisAvanzados.tendenciasTemporales.tendenciaGeneral}`, 30, yPos);
    yPos += 20;
    
    // ===== ALERTAS DEL SISTEMA =====
    if (alertas.length > 0) {
      console.log('YPos antes de alertas:', yPos);
      if (yPos > 700) { // Ajustado para A4
        agregarPiePagina();
        doc.addPage();
        yPos = 40;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 200); // Azul para títulos principales
      doc.text(normalizarTexto('ALERTAS DEL SISTEMA:'), 20, yPos);
      yPos += 18;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      alertas.forEach(alerta => {
        yPos = verificarEspacio(doc, yPos, 15); // Espacio para cada alerta
        // Usar solo negro para todas las alertas
        doc.setTextColor(0, 0, 0); // Negro para todo
        
        doc.text(normalizarTexto(`• ${alerta.mensaje}`), 25, yPos);
        yPos += 15;
      });
      
      yPos += 15;
    }
    
    // ===== RECOMENDACIONES ESTRATÉGICAS =====
    if (recomendaciones.length > 0) {
      console.log('YPos antes de recomendaciones:', yPos);
      if (yPos > 720) { // Ajustado para A4
        agregarPiePagina();
        doc.addPage();
        yPos = 40;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 200); // Azul para títulos principales
      doc.text(normalizarTexto('RECOMENDACIONES ESTRATEGICAS:'), 20, yPos);
      yPos += 18;
      
      recomendaciones.forEach(rec => {
        if (yPos > 750) { // Ajustado para A4: cerca del final de página
          agregarPiePagina();
          doc.addPage();
          yPos = 40;
        }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`${rec.area}:`, 25, yPos);
        yPos += 5;
        
        doc.setFont('helvetica', 'normal');
        const textoRecomendacion = normalizarTexto(rec.recomendacion);
        const lineasTexto = doc.splitTextToSize(textoRecomendacion, 160);
        doc.text(lineasTexto, 25, yPos);
        yPos += lineasTexto.length * 5 + 5;
      });
    }
    
    // Pie de página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`, 20, 280);
    }
    
    // Añadir pie de página a la última página
    agregarPiePagina();
    
    // Guardar el PDF
    doc.save(`Dashboard_Ejecutivo_CEIJA5_${new Date().toISOString().split('T')[0]}.pdf`);
    showAlerta('Informe de Calidad Educativa generado exitosamente', 'success');
    
  } catch (error) {
    console.error('Error al generar dashboard ejecutivo PDF:', error);
    showAlerta('Error al generar dashboard ejecutivo PDF: ' + error.message, 'error');
  }
};

// ===== DASHBOARD EJECUTIVO EXCEL =====
export const generarDashboardEjecutivoExcel = (estudiantes, showAlerta) => {
  try {
    const { kpisDecisiones, alertas, recomendaciones } = generarKPIsAvanzados(estudiantes);
    
    const datos = [
      // KPIs Optimizados para Toma de Decisiones
      ['=== KPIS OPTIMIZADOS PARA TOMA DE DECISIONES ==='],
      [''],
      ['ESTADO GENERAL'],
      ['KPI', 'Valor', 'Calculo', 'Justificacion'],
      ['Tasa de Estudiantes Activos', 
       `${kpisDecisiones.estadoGeneral.tasaEstudiantesActivos.valor}%`, 
       kpisDecisiones.estadoGeneral.tasaEstudiantesActivos.calculo,
       kpisDecisiones.estadoGeneral.tasaEstudiantesActivos.justificacion],
      ['Tasa de Estudiantes Inactivos', 
       `${kpisDecisiones.estadoGeneral.tasaEstudiantesInactivos.valor}%`, 
       kpisDecisiones.estadoGeneral.tasaEstudiantesInactivos.calculo,
       kpisDecisiones.estadoGeneral.tasaEstudiantesInactivos.justificacion],
      [''],
      ['PROCESO DE INSCRIPCION'],
      ['KPI', 'Valor', 'Interpretacion', 'Accion Requerida'],
      ['Tasa de Inscripciones Pendientes', 
       `${kpisDecisiones.procesoInscripcion.tasaInscripcionesPendientes.valor}%`, 
       kpisDecisiones.procesoInscripcion.tasaInscripcionesPendientes.interpretacion,
       kpisDecisiones.procesoInscripcion.tasaInscripcionesPendientes.accionRequerida],
      ['Tasa de Inscripciones Completas', 
       `${kpisDecisiones.procesoInscripcion.tasaInscripcionesCompletas.valor}%`, 
       kpisDecisiones.procesoInscripcion.tasaInscripcionesCompletas.interpretacion,
       kpisDecisiones.procesoInscripcion.tasaInscripcionesCompletas.accionRequerida],
      [''],
      ['DISTRIBUCION DE MATRICULA POR MODALIDAD'],
      ['Modalidad', 'Estudiantes', 'Porcentaje', 'Activos', 'Inactivos'],
      ...kpisDecisiones.distribucionMatricula.porcentajeMatriculaPorModalidad.map(modalidad => [
        modalidad.modalidad,
        modalidad.cantidad,
        `${modalidad.valor}%`,
        modalidad.estudiantesActivos,
        modalidad.estudiantesInactivos
      ]),
      [''],
      ['EFICIENCIA POR MODALIDAD'],
      ['Modalidad', 'Tasa Actividad', 'Interpretacion', 'Accion Requerida'],
      ...kpisDecisiones.eficienciaPorModalidad.tasaActividadPorModalidad.map(modalidad => [
        modalidad.modalidad,
        `${modalidad.valor}%`,
        modalidad.interpretacion,
        modalidad.accionRequerida
      ]),
      [''],
      ['INDICE DE CALIDAD AMINISTRATIVA'],
      ['Componente', 'Valor', 'Peso', 'Descripcion'],
      ['Indice General', `${kpisDecisiones.indiceCalidadEducativa.valor}%`, '', kpisDecisiones.indiceCalidadEducativa.interpretacion],
      ...Object.entries(kpisDecisiones.indiceCalidadEducativa.componentes).map(([componente, data]) => [
        componente,
        `${data.valor.toFixed(1)}%`,
        `${data.peso}%`,
        data.descripcion
      ]),
      [''],
      ['RECOMENDACIONES PRIORITARIAS'],
      ['Area', 'Accion Recomendada'],
      ...kpisDecisiones.indiceCalidadEducativa.recomendacionesPrioritarias.map((rec, index) => [
        `Prioridad ${index + 1}`,
        rec
      ]),
      [''],
      ['=== ALERTAS DEL SISTEMA ==='],
      ['Tipo', 'Mensaje', 'Accion'],
      ...alertas.map(alerta => [alerta.tipo, alerta.mensaje, alerta.accion]),
      [''],
      ['=== RECOMENDACIONES ESTRATEGICAS ==='],
      ['Prioridad', 'Area', 'Recomendacion', 'Impacto Estimado'],
      ...recomendaciones.map(rec => [rec.prioridad, rec.area, rec.recomendacion, rec.impactoEstimado])
    ];
    
    const exito = exportarExcel(datos, 'Dashboard_Ejecutivo_Calidad_Educativa', 'DASHBOARD EJECUTIVO - INDICADORES DE CALIDAD EDUCATIVA CEIJA 5');
    
    if (exito) {
      showAlerta('Informe de Calidad Educativa Excel generado exitosamente', 'success');
    } else {
      showAlerta('Error al generar informe de calidad educativa Excel', 'error');
    }
    
  } catch (error) {
    console.error('Error al generar informe de calidad educativa Excel:', error);
    showAlerta('Error al generar informe de calidad educativa Excel: ' + error.message, 'error');
  }
};