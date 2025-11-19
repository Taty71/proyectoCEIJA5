// ===================================================================
// SERVICIO DE VISUALIZACIÓN DE REPORTES
// Sistema completo de análisis de datos y generación de métricas
// ===================================================================

// Función para normalizar texto
const normalizarTexto = (texto) => {
  if (!texto) return '';
  return texto
    .replace(/á/g, 'a').replace(/Á/g, 'A')
    .replace(/é/g, 'e').replace(/É/g, 'E')
    .replace(/í/g, 'i').replace(/Í/g, 'I')
    .replace(/ó/g, 'o').replace(/Ó/g, 'O')
    .replace(/ú/g, 'u').replace(/Ú/g, 'U')
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U');
};

// Función para cargar registros web desde el archivo JSON (incluye datos de prueba)
const cargarRegistrosWeb = async () => {
  try {
    // console.log('🔄 === INICIO CARGA REGISTROS WEB ===');
    // console.log('📂 Intentando cargar desde backend...');
    
    let registros = [];
    
    // Intentar cargar desde el archivo real del BACKEND
    try {
      console.log('🌐 Haciendo fetch a: http://localhost:5000/proyectoCEIJA5/data/Registro_Web.json');
      const response = await fetch('http://localhost:5000/proyectoCEIJA5/data/Registro_Web.json');
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const registrosWeb = await response.json();
        registros = Array.isArray(registrosWeb) ? registrosWeb : [];
        console.log('✅ Registros web REALES cargados:', registros.length);
        console.log('📝 Primeros 3 registros:', registros.slice(0, 3).map(r => ({
          id: r.id,
          timestamp: r.timestamp,
          modalidad: r.datos?.modalidad,
          nombre: r.datos?.nombre
        })));
      } else {
        console.log('❌ Error en response:', response.status, response.statusText);
      }
    } catch (error) {
      console.log('⚠️ Error al cargar archivo real:', error.message);
      console.log('🔍 Detalles del error:', error);
    }
    
    // Cargar datos de prueba adicionales para verificar funcionamiento
    try {
      const responsePrueba = await fetch('/test-preinscripciones.json');
      if (responsePrueba.ok) {
        const datosPrueba = await responsePrueba.json();
        if (Array.isArray(datosPrueba)) {
          registros = [...registros, ...datosPrueba];
          console.log('🧪 Datos de PRUEBA agregados:', datosPrueba.length);
          console.log('📊 TOTAL registros disponibles:', registros.length);
        }
      }
    } catch (error) {
      console.log('⚠️ No se pudieron cargar datos de prueba:', error.message);
    }
    
    return registros;
    
  } catch (error) {
    console.error('❌ Error general cargando registros web:', error);
    return [];
  }
};

// Función para analizar preinscripciones web - AMBOS PERÍODOS (histórico y actual)
const analizarPreinscripcionesWeb = async (modalidadFiltro = null) => {
  console.log(`🌐 === INICIO ANÁLISIS PREINSCRIPCIONES WEB ===`);
  console.log(`🎯 Modalidad filtro recibida: "${modalidadFiltro}"`);
  console.log(`📍 Fecha/hora actual: ${new Date().toISOString()}`);
  
  const registrosWeb = await cargarRegistrosWeb();
  console.log(`📊 Total registros web cargados: ${registrosWeb.length}`);
  
  if (registrosWeb.length === 0) {
    console.log('⚠️ No se encontraron registros web - RETORNANDO VACÍO');
    return {
      total: 0,
      porModalidad: {},
      periodoHistorico: { texto: 'Nov 2024 - 20 Feb 2025', datos: [] },
      periodoActual: { texto: 'Nov 2025 - 20 Feb 2026', datos: [] }
    };
  }

  // Determinar años dinámicamente basado en fecha actual
  const fechaHoy = new Date();
  const anoActual = fechaHoy.getFullYear();
  const mesActual = fechaHoy.getMonth(); // 0-11
  
  // Si estamos antes de noviembre, el período actual es el año anterior
  const anoDelPeriodoActual = mesActual >= 10 ? anoActual : anoActual - 1; // >= Noviembre
  const anoDelPeriodoHistorico = anoDelPeriodoActual - 1;
  
  // PERÍODO HISTÓRICO: Nov [año-1] → 20 Feb [año]
  const fechaInicioHistorico = new Date(anoDelPeriodoHistorico, 10, 1); // Nov año anterior
  const fechaFinHistorico = new Date(anoDelPeriodoActual, 1, 20);        // 20 Feb año actual
  
  // PERÍODO ACTUAL: Nov [año] → 20 Feb [año+1] 
  const fechaInicioActual = new Date(anoDelPeriodoActual, 10, 1);        // Nov año actual
  const fechaFinActual = new Date(anoDelPeriodoActual + 1, 1, 20);      // 20 Feb año siguiente
  
  console.log(`📅 Período HISTÓRICO: ${fechaInicioHistorico.toLocaleDateString('es-AR')} → ${fechaFinHistorico.toLocaleDateString('es-AR')}`);
  console.log(`📅 Período ACTUAL: ${fechaInicioActual.toLocaleDateString('es-AR')} → ${fechaFinActual.toLocaleDateString('es-AR')}`);

  // Filtrar registros por ambos períodos
  const registrosHistorico = [];
  const registrosActual = [];

  registrosWeb.forEach(registro => {
    // Convertir timestamp a fecha - PRIORIZAR timestamp sobre fechaRegistro
    let fechaRegistro;
    
    // PRIMERO: intentar usar timestamp (formato ISO más confiable)
    if (registro.timestamp) {
      fechaRegistro = new Date(registro.timestamp);
      console.log(`📅 Usando TIMESTAMP: ${registro.timestamp} → ${fechaRegistro.toLocaleDateString('es-AR')}`);
    } 
    // SEGUNDO: si no hay timestamp, usar fechaRegistro (formato DD/MM/YYYY)
    else if (registro.fechaRegistro) {
      const partes = registro.fechaRegistro.split('/');
      if (partes.length === 3) {
        // Formato DD/MM/YYYY
        fechaRegistro = new Date(partes[2], partes[1] - 1, partes[0]);
        console.log(`📅 Usando FECHA_REGISTRO: ${registro.fechaRegistro} → ${fechaRegistro.toLocaleDateString('es-AR')}`);
      }
    }

    if (!fechaRegistro || isNaN(fechaRegistro.getTime())) {
      console.log(`⚠️ Registro ${registro.id} con fecha inválida - TIMESTAMP: ${registro.timestamp}, FECHA: ${registro.fechaRegistro}`);
      return;
    }

    // DEBUG: Mostrar información del registro
    console.log(`🔍 PROCESANDO REGISTRO: ${registro.datos?.nombre} ${registro.datos?.apellido}`);
    console.log(`   📅 Fecha procesada: ${fechaRegistro.toLocaleDateString('es-AR')} (${fechaRegistro.toISOString()})`);
    console.log(`   🏫 Modalidad original: "${registro.datos?.modalidad}"`);
    console.log(`   🎯 Filtro modalidad: "${modalidadFiltro}"`);

    // Verificar modalidad si se especifica
    const modalidadRegistro = (registro.datos?.modalidad || '').toLowerCase().trim();
    const cumpleModalidad = !modalidadFiltro || modalidadFiltro === 'todas' || modalidadRegistro === modalidadFiltro.toLowerCase();
    
    console.log(`   ✅ Modalidad procesada: "${modalidadRegistro}"`);
    console.log(`   ✅ Cumple modalidad: ${cumpleModalidad}`);
    
    if (!cumpleModalidad) {
      console.log(`   ❌ NO cumple filtro de modalidad - DESCARTADO`);
      return;
    }
    
    // Clasificar por período
    const enPeriodoHistorico = fechaRegistro >= fechaInicioHistorico && fechaRegistro <= fechaFinHistorico;
    const enPeriodoActual = fechaRegistro >= fechaInicioActual && fechaRegistro <= fechaFinActual;
    
    console.log(`   📊 En período histórico: ${enPeriodoHistorico} (${fechaInicioHistorico.toLocaleDateString('es-AR')} - ${fechaFinHistorico.toLocaleDateString('es-AR')})`);
    console.log(`   📊 En período actual: ${enPeriodoActual} (${fechaInicioActual.toLocaleDateString('es-AR')} - ${fechaFinActual.toLocaleDateString('es-AR')})`);
    
    if (enPeriodoHistorico) {
      console.log(`📜 HISTÓRICO: ${registro.datos?.nombre} ${registro.datos?.apellido} - ${fechaRegistro.toLocaleDateString('es-AR')} - Modalidad: ${registro.datos?.modalidad || 'Sin especificar'}`);
      registrosHistorico.push(registro);
    }
    
    if (enPeriodoActual) {
      console.log(`🔥 ACTUAL: ${registro.datos?.nombre} ${registro.datos?.apellido} - ${fechaRegistro.toLocaleDateString('es-AR')} - Modalidad: ${registro.datos?.modalidad || 'Sin especificar'}`);
      registrosActual.push(registro);
    }
    
    if (!enPeriodoHistorico && !enPeriodoActual) {
      console.log(`   ⚠️ NO está en ningún período - FUERA DE RANGO`);
    }
  });

  // Procesar modalidades para cada período
  const procesarModalidades = (registros) => {
    const porModalidad = agruparPor(registros, 'datos.modalidad');
    console.log('🔍 DEBUG AGRUPACIÓN - porModalidad:', porModalidad);
    console.log('🔍 DEBUG AGRUPACIÓN - Object.keys(porModalidad):', Object.keys(porModalidad));
    const modalidadesNormalizadas = {};
    
    Object.keys(porModalidad).forEach(modalidad => {
      console.log('🔄 Procesando modalidad key:', modalidad, 'con', porModalidad[modalidad].length, 'registros');
      const modalidadUpper = (modalidad || 'SIN_ESPECIFICAR').toUpperCase();
      
      if (modalidadUpper.includes('PRESENCIAL') && !modalidadUpper.includes('SEMI')) {
        modalidadesNormalizadas['Presencial'] = (modalidadesNormalizadas['Presencial'] || 0) + porModalidad[modalidad].length;
      } else if (modalidadUpper.includes('SEMIPRESENCIAL')) {
        modalidadesNormalizadas['Semipresencial'] = (modalidadesNormalizadas['Semipresencial'] || 0) + porModalidad[modalidad].length;
      } else {
        modalidadesNormalizadas['Sin Especificar'] = (modalidadesNormalizadas['Sin Especificar'] || 0) + porModalidad[modalidad].length;
      }
    });
    
    return modalidadesNormalizadas;
  };

  const modalidadesHistorico = procesarModalidades(registrosHistorico);
  const modalidadesActual = procesarModalidades(registrosActual);

  console.log('📜 HISTÓRICO - Por modalidad:', modalidadesHistorico);
  console.log('🔥 ACTUAL - Por modalidad:', modalidadesActual);

  return {
    total: registrosHistorico.length + registrosActual.length,
    porModalidad: {
      // Para compatibilidad con código existente, usar el actual como principal
      ...modalidadesActual
    },
    periodoHistorico: {
      texto: `Nov ${anoDelPeriodoHistorico} - 20 Feb ${anoDelPeriodoActual}`,
      modalidades: modalidadesHistorico,
      registros: registrosHistorico,
      total: registrosHistorico.length
    },
    periodoActual: {
      texto: `Nov ${anoDelPeriodoActual} - 20 Feb ${anoDelPeriodoActual + 1}`,
      modalidades: modalidadesActual,
      registros: registrosActual,
      total: registrosActual.length
    }
  };
};

// Utilidades para cálculos estadísticos avanzados
const calcularPorcentaje = (parte, total) => total > 0 ? parseFloat(((parte / total) * 100).toFixed(1)) : 0;

// Función auxiliar para cálculos estadísticos (reservada para uso futuro)
const _calcularDesviacionEstandar = (numeros) => {
  const promedio = numeros.reduce((a, b) => a + b, 0) / numeros.length;
  const varianza = numeros.reduce((sum, num) => sum + Math.pow(num - promedio, 2), 0) / numeros.length;
  return Math.sqrt(varianza);
};

const calcularTendencia = (datos) => {
  if (datos.length < 2) return 'estable';
  const primeros = datos.slice(0, Math.ceil(datos.length / 2));
  const ultimos = datos.slice(Math.floor(datos.length / 2));
  const promedioPrimeros = primeros.reduce((a, b) => a + b, 0) / primeros.length;
  const promedioUltimos = ultimos.reduce((a, b) => a + b, 0) / ultimos.length;
  
  const diferencia = ((promedioUltimos - promedioPrimeros) / promedioPrimeros) * 100;
  
  if (diferencia > 10) return 'creciente';
  if (diferencia < -10) return 'decreciente';
  return 'estable';
};

const agruparPor = (array, propiedad) => {
  return array.reduce((acc, item) => {
    // Manejar propiedades anidadas como 'datos.modalidad'
    let key;
    if (propiedad.includes('.')) {
      const propiedades = propiedad.split('.');
      key = propiedades.reduce((obj, prop) => obj && obj[prop], item) || 'Sin definir';
    } else {
      key = item[propiedad] || 'Sin definir';
    }
    
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

// ===================================================================
// 1. ANÁLISIS DE ESTADOS
// ===================================================================
export const analizarEstados = (estudiantes) => {
  // FILTRAR SOLO ESTUDIANTES ACTIVOS para análisis de estados de inscripción
  const estudiantesActivos = estudiantes.filter(e => e.activo === true || e.activo === 1);
  
  console.log('🔍 Análisis de Estados de Inscripción:');
  console.log('- Total estudiantes originales:', estudiantes.length);
  console.log('- Estudiantes activos para análisis:', estudiantesActivos.length);
  
  // Debug: Mostrar estructura de datos completa del primer estudiante activo
  if (estudiantesActivos.length > 0) {
    console.log('🔍 Estructura del primer estudiante activo:', estudiantesActivos[0]);
    console.log('🔍 Campos disponibles:', Object.keys(estudiantesActivos[0]));
  }
  
  // Intentar múltiples campos posibles para el estado
  const campoEstado = estudiantesActivos.length > 0 ? (
    estudiantesActivos[0].estadoInscripcion ? 'estadoInscripcion' :
    estudiantesActivos[0].estado_inscripcion ? 'estado_inscripcion' :
    estudiantesActivos[0].estado ? 'estado' :
    estudiantesActivos[0].descripcionEstado ? 'descripcionEstado' :
    estudiantesActivos[0].idEstadoInscripcion ? 'idEstadoInscripcion' :
    null
  ) : null;
  
  console.log('📋 Campo de estado detectado:', campoEstado);
  
  const estados = agruparPor(estudiantesActivos, campoEstado);
  const total = estudiantesActivos.length;
  
  // Debug: Mostrar los estados encontrados
  console.log('🔍 Estados encontrados en estudiantes activos:', Object.keys(estados));
  console.log('📊 Distribución por estado:', Object.entries(estados).map(([estado, lista]) => ({
    estado,
    cantidad: lista.length
  })));
  
  // Mapear IDs a descripciones si el campo es numérico (idEstadoInscripcion)
  let estadosConDescripcion = {};
  if (campoEstado === 'idEstadoInscripcion') {
    Object.entries(estados).forEach(([estadoId, estudiantes]) => {
      let descripcion = 'Sin definir';
      switch (parseInt(estadoId)) {
        case 1:
          descripcion = 'pendiente';
          break;
        case 2:
          descripcion = 'completa';
          break;
        case 3:
          descripcion = 'anulado';
          break;
        default:
          descripcion = `Estado ${estadoId}`;
      }
      estadosConDescripcion[descripcion] = estudiantes;
    });
  } else {
    estadosConDescripcion = estados;
  }
  
  console.log('🏷️ Estados de inscripción con descripción:', Object.keys(estadosConDescripcion));
  
  // Identificar estados de aprobación y pendientes dinámicamente
  const estadosAprobacion = Object.keys(estadosConDescripcion).filter(estado => 
    estado && (
      estado.toLowerCase().includes('completa') ||
      estado.toLowerCase().includes('aprueba') ||
      estado.toLowerCase().includes('aceptado') ||
      estado.toLowerCase().includes('confirmado') ||
      estado.toLowerCase().includes('inscripto')
    )
  );

  const estadosPendientes = Object.keys(estadosConDescripcion).filter(estado => 
    estado && (
      estado.toLowerCase().includes('pendiente') ||
      estado.toLowerCase().includes('proceso') ||
      estado.toLowerCase().includes('revision') ||
      estado.toLowerCase().includes('espera') ||
      estado.toLowerCase().includes('anulado') ||
      estado.toLowerCase().includes('anulad')
    )
  );

  console.log('✅ Estados clasificados como aprobación:', estadosAprobacion);
  console.log('⏳ Estados clasificados como pendientes/problemáticos:', estadosPendientes);

  const cantidadCompletas = estadosAprobacion.reduce((total, estado) => total + (estadosConDescripcion[estado]?.length || 0), 0);
  const cantidadPendientes = estadosPendientes.reduce((total, estado) => total + (estadosConDescripcion[estado]?.length || 0), 0);
  
  // Calcular porcentajes de estados de inscripción (solo estudiantes activos)
  const tasaAprobacionFinal = calcularPorcentaje(cantidadCompletas, total);
  const tasaPendientesFinal = calcularPorcentaje(cantidadPendientes, total);
  
  // Identificar estados específicos para alertas
  const cantidadAnulados = estadosConDescripcion['anulado']?.length || 0;
  const cantidadPendientesReal = estadosConDescripcion['pendiente']?.length || 0;
  const porcentajeAnulados = calcularPorcentaje(cantidadAnulados, total);
  const porcentajePendientesReal = calcularPorcentaje(cantidadPendientesReal, total);

  console.log('📊 Estadísticas finales de estados de inscripción:', {
    Completas: cantidadCompletas,
    pendientes: cantidadPendientesReal,
    anulados: cantidadAnulados,
    tasaAprobacion: tasaAprobacionFinal,
    tasaPendientes: tasaPendientesFinal
  });
  
  // ===== DESGLOSE POR MODALIDAD =====
  const distribucionPorModalidad = {};
  const modalidades = {};
  
  // Agrupar estudiantes activos por modalidad
  estudiantesActivos.forEach(est => {
    const modalidad = est.modalidad || 'Sin modalidad';
    if (!modalidades[modalidad]) {
      modalidades[modalidad] = [];
    }
    modalidades[modalidad].push(est);
  });
  
  // Calcular estadísticas por cada modalidad
  Object.entries(modalidades).forEach(([modalidad, estudiantes]) => {
    const totalModalidad = estudiantes.length;
    
    // Clasificar por estado en esta modalidad
    const completasModalidad = estudiantes.filter(est => {
      const estado = est[campoEstado] ? est[campoEstado].toString().toLowerCase() : '';
      return estado.includes('completa') || estado.includes('completo') || estado === '2';
    }).length;
    
    const pendientesModalidad = estudiantes.filter(est => {
      const estado = est[campoEstado] ? est[campoEstado].toString().toLowerCase() : '';
      return estado.includes('pendiente') || estado === '1';
    }).length;
    
    const anuladasModalidad = estudiantes.filter(est => {
      const estado = est[campoEstado] ? est[campoEstado].toString().toLowerCase() : '';
      return estado.includes('anulad') || estado === '3';
    }).length;
    
    distribucionPorModalidad[modalidad] = {
      total: totalModalidad,
      completas: completasModalidad,
      porcentajeCompletas: calcularPorcentaje(completasModalidad, totalModalidad),
      pendientes: pendientesModalidad,
      porcentajePendientes: calcularPorcentaje(pendientesModalidad, totalModalidad),
      anuladas: anuladasModalidad,
      porcentajeAnuladas: calcularPorcentaje(anuladasModalidad, totalModalidad)
    };
  });
  
  console.log('📊 Desglose por modalidad:', distribucionPorModalidad);

  const analisis = {
    resumen: {
      total,
      estados: Object.keys(estadosConDescripcion).length,
      fechaAnalisis: new Date().toLocaleDateString('es-AR')
    },
    distribucion: Object.entries(estadosConDescripcion).map(([estado, lista]) => ({
      estado: estado || 'Sin definir',
      cantidad: lista.length,
      porcentaje: calcularPorcentaje(lista.length, total),
      estudiantes: lista.map(e => ({
        nombre: normalizarTexto(`${e.nombre || ''} ${e.apellido || ''}`),
        fechaInscripcion: e.fechaInscripcion,
        modalidad: e.modalidad
      }))
    })).sort((a, b) => b.cantidad - a.cantidad),
    distribucionPorModalidad, // Agregar el desglose por modalidad
    metricas: {
      estadoMasFrecuente: Object.keys(estadosConDescripcion).length > 0 ? 
        Object.keys(estadosConDescripcion).reduce((a, b) => estadosConDescripcion[a].length > estadosConDescripcion[b].length ? a : b) : 'Sin datos',
      tasaAprobacion: tasaAprobacionFinal,
      tasaPendientes: tasaPendientesFinal,
      alertas: []
    }
  };

  // Análisis de alertas específicas de estados de inscripción
  const porcentajePendientesRealNum = porcentajePendientesReal;
  const porcentajeAprobacionNum = tasaAprobacionFinal;
  const porcentajeAnuladosNum = porcentajeAnulados;
  
  // Alerta por alto porcentaje de inscripciones anuladas
  if (porcentajeAnuladosNum > 20) {
    analisis.metricas.alertas.push({
      tipo: 'danger',
      mensaje: `Alto porcentaje de inscripciones anuladas (${porcentajeAnulados}% - ${cantidadAnulados} estudiantes)`
    });
  }
  
  // Alerta por alto porcentaje de inscripciones pendientes
  if (porcentajePendientesRealNum > 40) {
    analisis.metricas.alertas.push({
      tipo: 'warning',
      mensaje: `Alto porcentaje de inscripciones pendientes (${porcentajePendientesReal}% - ${cantidadPendientesReal} estudiantes)`
    });
  }

  // Alerta por baja tasa de aprobación de inscripciones
  if (porcentajeAprobacionNum < 50) {
    analisis.metricas.alertas.push({
      tipo: 'warning',
      mensaje: `Baja tasa de inscripciones completas (${tasaAprobacionFinal}% - ${cantidadCompletas} estudiantes)`
    });
  }
  
  // Alerta por estados no definidos
  if (estadosConDescripcion['Sin definir'] && estadosConDescripcion['Sin definir'].length > 0) {
    analisis.metricas.alertas.push({
      tipo: 'info',
      mensaje: `${estadosConDescripcion['Sin definir'].length} inscripciones sin estado definido`
    });
  }

  // Alerta informativa sobre análisis
  if (total === 0) {
    analisis.metricas.alertas.push({
      tipo: 'info',
      mensaje: 'No hay estudiantes activos para analizar estados de inscripción'
    });
  } else {
    analisis.metricas.alertas.push({
      tipo: 'info',
      mensaje: `Análisis realizado sobre ${total} inscripciones activas de ${estudiantes.length} estudiantes totales`
    });
  }

  return analisis;
};

// ===================================================================
// 2. ANÁLISIS DE TENDENCIAS MODALIDAD
// ===================================================================
export const analizarTendenciasModalidad = (estudiantes, modalidadSeleccionada = 'todas') => {
  
  // Filtrar estudiantes por modalidad seleccionada si no es 'todas'
  let estudiantesFiltrados = estudiantes;
  if (modalidadSeleccionada !== 'todas') {
    estudiantesFiltrados = estudiantes.filter(est => 
      est.modalidad && est.modalidad.toUpperCase() === modalidadSeleccionada.toUpperCase()
    );
  }
  
  const modalidades = agruparPor(estudiantesFiltrados, 'modalidad');
  let presenciales = modalidades['PRESENCIAL'] || [];
  let semipresenciales = modalidades['SEMIPRESENCIAL'] || [];
  
  // Reclasificar años a PRESENCIAL
  const estudiantesParaMover = [];
  semipresenciales = semipresenciales.filter(est => {
    const plan = est.cursoPlan || est.planAnio || '';
    const esAno = plan.toLowerCase().includes('año') || 
                  plan.toLowerCase().includes('1er') || 
                  plan.toLowerCase().includes('2do') || 
                  plan.toLowerCase().includes('3er') ||
                  plan.toLowerCase().includes('4to');
    
    if (esAno) {
      estudiantesParaMover.push(est);
      return false;
    }
    return true;
  });
  
  presenciales = [...presenciales, ...estudiantesParaMover];
  
  // Análisis PRESENCIAL por curso
  const cursosPorAno = {};
  presenciales.forEach(est => {
    const plan = (est.cursoPlan || est.planAnio || '').toLowerCase();
    let anoDetectado = 'Sin clasificar';
    
    // Mejorar detección de años con múltiples patrones
    if (plan.includes('1') || plan.includes('primer') || plan.includes('1er') || plan.includes('primero')) {
      anoDetectado = '1er año';
    } else if (plan.includes('2') || plan.includes('segundo') || plan.includes('2do') || plan.includes('2°')) {
      anoDetectado = '2do año';
    } else if (plan.includes('3') || plan.includes('tercer') || plan.includes('3er') || plan.includes('tercero') || plan.includes('3°')) {
      anoDetectado = '3er año';
    } else if (plan.includes('4') || plan.includes('cuarto') || plan.includes('4to') || plan.includes('4°')) {
      anoDetectado = '4to año';
    }
    
    if (!cursosPorAno[anoDetectado]) cursosPorAno[anoDetectado] = [];
    cursosPorAno[anoDetectado].push(est);
  });

  // Análisis SEMIPRESENCIAL por plan
  const planesSemipresencial = {};
  semipresenciales.forEach(est => {
    const plan = est.cursoPlan || est.planAnio || 'Sin especificar';
    let planDetectado = 'Otro plan';
    
    if (plan.toLowerCase().includes('plan a')) {
      planDetectado = 'Plan A';
    } else if (plan.toLowerCase().includes('plan b')) {
      planDetectado = 'Plan B';
    } else if (plan.toLowerCase().includes('plan c')) {
      planDetectado = 'Plan C';
    }
    
    if (!planesSemipresencial[planDetectado]) planesSemipresencial[planDetectado] = [];
    planesSemipresencial[planDetectado].push(est);
  });

  // Filtrar resultados según modalidad seleccionada
  const resultadoPresencial = {
    cursos: Object.entries(cursosPorAno).map(([ano, lista]) => ({
      curso: ano,
      cantidad: lista.length,
      porcentajePresencial: calcularPorcentaje(lista.length, presenciales.length),
      porcentajeTotal: calcularPorcentaje(lista.length, estudiantesFiltrados.length),
      estudiantes: lista.map(e => normalizarTexto(`${e.nombre} ${e.apellido}`))
    })).sort((a, b) => {
      // Orden lógico: 1er año, 2do año, 3er año, 4to año, luego otros
      const ordenLogico = {
        '1er año': 1,
        '2do año': 2,
        '3er año': 3,
        '4to año': 4,
        'Sin clasificar': 5
      };
      const ordenA = ordenLogico[a.curso] || 6;
      const ordenB = ordenLogico[b.curso] || 6;
      return ordenA - ordenB;
    })
  };

  const resultadoSemipresencial = {
    planes: Object.entries(planesSemipresencial).map(([plan, lista]) => ({
      plan,
      cantidad: lista.length,
      porcentajeSemipresencial: calcularPorcentaje(lista.length, semipresenciales.length),
      porcentajeTotal: calcularPorcentaje(lista.length, estudiantesFiltrados.length),
      estudiantes: lista.map(e => normalizarTexto(`${e.nombre} ${e.apellido}`))
    })).sort((a, b) => {
      // Orden lógico: Plan A, Plan B, Plan C, luego otros
      const ordenLogico = {
        'Plan A': 1,
        'Plan B': 2,
        'Plan C': 3,
        'Otro plan': 4
      };
      const ordenA = ordenLogico[a.plan] || 5;
      const ordenB = ordenLogico[b.plan] || 5;
      return ordenA - ordenB;
    })
  };

  // Si se selecciona una modalidad específica, ocultar la otra
  if (modalidadSeleccionada.toUpperCase() === 'PRESENCIAL') {
    resultadoSemipresencial.planes = [];
  } else if (modalidadSeleccionada.toUpperCase() === 'SEMIPRESENCIAL') {
    resultadoPresencial.cursos = [];
  }

  return {
    resumen: {
      total: estudiantesFiltrados.length,
      totalPresencial: presenciales.length,
      totalSemipresencial: semipresenciales.length,
      modalidadAnalizada: modalidadSeleccionada.toUpperCase()
    },
    presencial: resultadoPresencial,
    semipresencial: resultadoSemipresencial,
    metricas: {
      modalidadDominante: presenciales.length > semipresenciales.length ? 'PRESENCIAL' : 'SEMIPRESENCIAL',
      distribucionEquitativa: Math.abs(presenciales.length - semipresenciales.length) / estudiantesFiltrados.length < 0.2,
      recomendaciones: []
    }
  };
};

// ===================================================================
// 3. ANÁLISIS DE PERÍODOS POR MODALIDAD
// ===================================================================
export const analizarPeriodos = async (estudiantes, modalidadSeleccionada = 'todas') => {
  console.log('=== INICIO analizarPeriodos ===');
  console.log('Total estudiantes recibidos:', estudiantes?.length || 0);
  console.log('Modalidad seleccionada:', modalidadSeleccionada);
  
  // Función para crear fecha de inscripción
  const crearFechaInscripcion = (fechaStr) => {
    if (!fechaStr) return null;
    return new Date(fechaStr);
  };

  const esFechaEnRango = (fecha, inicio, fin) => {
    return fecha >= inicio && fecha <= fin;
  };
  
  if (!estudiantes || estudiantes.length === 0) {
    console.log('ERROR: No hay estudiantes para analizar');
    return {
      error: 'No hay estudiantes para analizar',
      modalidad: modalidadSeleccionada,
      totalInscripciones: 0
    };
  }

  // Filtrar estudiantes por modalidad si se especifica
  let estudiantesFiltrados = estudiantes;
  if (modalidadSeleccionada !== 'todas') {
    estudiantesFiltrados = estudiantes.filter(est => 
      est.modalidad && est.modalidad.toUpperCase() === modalidadSeleccionada.toUpperCase()
    );
  }

  console.log('Estudiantes tras filtrar por modalidad:', estudiantesFiltrados.length);
  
  // Mostrar modalidades disponibles para debug
  const modalidades = [...new Set(estudiantes.map(est => est.modalidad).filter(Boolean))];
  console.log('Modalidades disponibles en datos:', modalidades);

  // Detectar rango de años en las fechas de inscripción para usar año apropiado
  const fechasInscripcion = estudiantesFiltrados
    .map(est => crearFechaInscripcion(est.fechaInscripcion))
    .filter(fecha => fecha !== null);
  
  let anoAnalisis = 2025; // año predeterminado basado en datos de BD
  
  if (fechasInscripcion.length > 0) {
    const anos = fechasInscripcion.map(fecha => fecha.getFullYear());
    const anoMasComun = anos.sort((a, b) =>
      anos.filter(v => v === a).length - anos.filter(v => v === b).length
    ).pop();
    anoAnalisis = anoMasComun;
  }

  // Definir períodos específicos para cada modalidad - usar año detectado
  const periodosPresencial = {
    inicio: new Date(anoAnalisis, 1, 20), // 20 febrero año detectado
    fin: new Date(anoAnalisis, 2, 31),    // 31 marzo año detectado
    ventanas: [
      { nombre: '20 Feb - 5 Mar', inicio: new Date(anoAnalisis, 1, 20), fin: new Date(anoAnalisis, 2, 5) },
      { nombre: '6 Mar - 19 Mar', inicio: new Date(anoAnalisis, 2, 6), fin: new Date(anoAnalisis, 2, 19) },
      { nombre: '20 Mar - 31 Mar', inicio: new Date(anoAnalisis, 2, 20), fin: new Date(anoAnalisis, 2, 31) }
    ]
  };

  const periodosSemipresencial = {
    inicio: new Date(anoAnalisis, 1, 20), // 20 febrero año detectado
    fin: new Date(anoAnalisis, 9, 31),    // 31 octubre año detectado
    ventanasTrimestre: [
      { nombre: 'Feb-Abr', inicio: new Date(anoAnalisis, 1, 20), fin: new Date(anoAnalisis, 3, 30) },
      { nombre: 'May-Jul', inicio: new Date(anoAnalisis, 4, 1), fin: new Date(anoAnalisis, 6, 31) },
      { nombre: 'Ago-Oct', inicio: new Date(anoAnalisis, 7, 1), fin: new Date(anoAnalisis, 9, 31) }
    ],
    ventanasSemestre: [
      { nombre: 'Feb-Jun', inicio: new Date(anoAnalisis, 1, 20), fin: new Date(anoAnalisis, 5, 30) },
      { nombre: 'Jul-Oct', inicio: new Date(anoAnalisis, 6, 1), fin: new Date(anoAnalisis, 9, 31) }
    ]
  };

  const analizarModalidadPresencial = async (estudiantes) => {
    const estudiantesEnPeriodo = estudiantes.filter(est => {
      const fecha = crearFechaInscripcion(est.fechaInscripcion);
      return fecha && esFechaEnRango(fecha, periodosPresencial.inicio, periodosPresencial.fin);
    });

    const distribucionVentanas = periodosPresencial.ventanas.map(ventana => {
      const estudiantesVentana = estudiantesEnPeriodo.filter(est => {
        const fecha = crearFechaInscripcion(est.fechaInscripcion);
        return fecha && esFechaEnRango(fecha, ventana.inicio, ventana.fin);
      });

      return {
        periodo: ventana.nombre,
        cantidad: estudiantesVentana.length,
        porcentaje: calcularPorcentaje(estudiantesVentana.length, estudiantesEnPeriodo.length),
        fechaInicio: ventana.inicio.toLocaleDateString(),
        fechaFin: ventana.fin.toLocaleDateString(),
        esPreinscripcion: false
      };
    });

    console.log('🎯 PRESENCIAL: Iniciando análisis de preinscripciones web...');
    // Agregar análisis de preinscripciones web - AMBOS PERÍODOS
    const preinscripcionesWeb = await analizarPreinscripcionesWeb('presencial');
    console.log('📊 PRESENCIAL: Resultado preinscripciones web:', preinscripcionesWeb);
    
    // Crear entradas para ambos períodos de preinscripciones
    const entradasPreinscripciones = [];
    
    // PERÍODO HISTÓRICO
    if (preinscripcionesWeb.periodoHistorico && preinscripcionesWeb.periodoHistorico.total > 0) {
      const cantidadPresencial = preinscripcionesWeb.periodoHistorico.modalidades['Presencial'] || 0;
      entradasPreinscripciones.push({
        periodo: `📜 Preinscripciones Históricas (${preinscripcionesWeb.periodoHistorico.texto})`,
        cantidad: cantidadPresencial,
        porcentaje: calcularPorcentaje(cantidadPresencial, estudiantesEnPeriodo.length + cantidadPresencial),
        esPreinscripcion: true,
        tipoPreinscripcion: 'historico',
        fechaInicio: preinscripcionesWeb.periodoHistorico.texto.split(' - ')[0],
        fechaFin: preinscripcionesWeb.periodoHistorico.texto.split(' - ')[1]
      });
    }
    
    // PERÍODO ACTUAL
    if (preinscripcionesWeb.periodoActual && preinscripcionesWeb.periodoActual.total > 0) {
      const cantidadPresencial = preinscripcionesWeb.periodoActual.modalidades['Presencial'] || 0;
      entradasPreinscripciones.push({
        periodo: `🔥 Preinscripciones Actuales (${preinscripcionesWeb.periodoActual.texto})`,
        cantidad: cantidadPresencial,
        porcentaje: calcularPorcentaje(cantidadPresencial, estudiantesEnPeriodo.length + cantidadPresencial),
        esPreinscripcion: true,
        tipoPreinscripcion: 'actual',
        fechaInicio: preinscripcionesWeb.periodoActual.texto.split(' - ')[0],
        fechaFin: preinscripcionesWeb.periodoActual.texto.split(' - ')[1]
      });
    }

    // Combinar distribución: preinscripciones primero, luego ventanas regulares
    const distribucionCompleta = [...entradasPreinscripciones, ...distribucionVentanas];

    // Calcular totales
    const totalPreinscripciones = entradasPreinscripciones.reduce((sum, entry) => sum + entry.cantidad, 0);

    return {
      modalidad: 'PRESENCIAL',
      periodoCompleto: `20 Feb - 31 Mar ${anoAnalisis}`,
      totalInscripciones: estudiantesEnPeriodo.length,
      totalConPreinscripciones: estudiantesEnPeriodo.length + totalPreinscripciones,
      distribucion: distribucionCompleta,
      preinscripcionesWeb: {
        historico: entradasPreinscripciones.find(e => e.tipoPreinscripcion === 'historico'),
        actual: entradasPreinscripciones.find(e => e.tipoPreinscripcion === 'actual')
      },
      resumen: {
        ventanasPorQuincena: 3,
        inscripcionesFueraPeriodo: estudiantes.length - estudiantesEnPeriodo.length,
        preinscripcionesHistoricas: preinscripcionesWeb.periodoHistorico.total || 0,
        preinscripcionesActuales: preinscripcionesWeb.periodoActual.total || 0
      }
    };
  };

  const analizarModalidadSemipresencial = async (estudiantes) => {
    console.log('=== analizarModalidadSemipresencial ===');
    console.log('Estudiantes recibidos:', estudiantes.length);
    
    console.log('🎯 SEMIPRESENCIAL: Iniciando análisis de preinscripciones web...');
    // Obtener preinscripciones web - AMBOS PERÍODOS
    const preinscripcionesWeb = await analizarPreinscripcionesWeb('semipresencial');
    console.log('📊 SEMIPRESENCIAL: Resultado preinscripciones web:', preinscripcionesWeb);
    
    if (!estudiantes || estudiantes.length === 0) {
      // Crear entradas para ambos períodos de preinscripciones incluso sin estudiantes regulares
      const entradasPreinscripciones = [];
      
      // PERÍODO HISTÓRICO
      if (preinscripcionesWeb.periodoHistorico && preinscripcionesWeb.periodoHistorico.total > 0) {
        const cantidadSemipresencial = preinscripcionesWeb.periodoHistorico.modalidades['Semipresencial'] || 0;
        entradasPreinscripciones.push({
          periodo: `📜 Preinscripciones Históricas (${preinscripcionesWeb.periodoHistorico.texto})`,
          cantidad: cantidadSemipresencial,
          porcentaje: '100.0',
          esPreinscripcion: true,
          tipoPreinscripcion: 'historico'
        });
      }
      
      // PERÍODO ACTUAL
      if (preinscripcionesWeb.periodoActual && preinscripcionesWeb.periodoActual.total > 0) {
        const cantidadSemipresencial = preinscripcionesWeb.periodoActual.modalidades['Semipresencial'] || 0;
        entradasPreinscripciones.push({
          periodo: `🔥 Preinscripciones Actuales (${preinscripcionesWeb.periodoActual.texto})`,
          cantidad: cantidadSemipresencial,
          porcentaje: '100.0',
          esPreinscripcion: true,
          tipoPreinscripcion: 'actual'
        });
      }

      return {
        modalidad: 'SEMIPRESENCIAL',
        periodoCompleto: `20 Feb - 31 Oct ${anoAnalisis}`,
        totalInscripciones: 0,
        totalConPreinscripciones: entradasPreinscripciones.reduce((sum, entry) => sum + entry.cantidad, 0),
        distribucionTrimestre: entradasPreinscripciones,
        distribucionSemestre: entradasPreinscripciones,
        preinscripcionesWeb: {
          historico: entradasPreinscripciones.find(e => e.tipoPreinscripcion === 'historico'),
          actual: entradasPreinscripciones.find(e => e.tipoPreinscripcion === 'actual')
        },
        resumen: {
          ventanasTrimestre: 3,
          ventanasSemestre: 2,
          inscripcionesFueraPeriodo: 0,
          preinscripcionesHistoricas: preinscripcionesWeb.periodoHistorico.total || 0,
          preinscripcionesActuales: preinscripcionesWeb.periodoActual.total || 0
        }
      };
    }

    const estudiantesEnPeriodo = estudiantes.filter(est => {
      const fecha = crearFechaInscripcion(est.fechaInscripcion);
      return fecha && esFechaEnRango(fecha, periodosSemipresencial.inicio, periodosSemipresencial.fin);
    });

    console.log('Estudiantes en período:', estudiantesEnPeriodo.length);
    console.log('Período análisis:', periodosSemipresencial.inicio.toLocaleDateString(), 'a', periodosSemipresencial.fin.toLocaleDateString());

    // Crear entradas para ambos períodos de preinscripciones
    const entradasPreinscripciones = [];
    
    // PERÍODO HISTÓRICO
    if (preinscripcionesWeb.periodoHistorico && preinscripcionesWeb.periodoHistorico.total > 0) {
      const cantidadSemipresencial = preinscripcionesWeb.periodoHistorico.modalidades['Semipresencial'] || 0;
      entradasPreinscripciones.push({
        periodo: `📜 Preinscripciones Históricas (${preinscripcionesWeb.periodoHistorico.texto})`,
        cantidad: cantidadSemipresencial,
        porcentaje: calcularPorcentaje(cantidadSemipresencial, estudiantesEnPeriodo.length + cantidadSemipresencial),
        esPreinscripcion: true,
        tipoPreinscripcion: 'historico',
        fechaInicio: preinscripcionesWeb.periodoHistorico.texto.split(' - ')[0],
        fechaFin: preinscripcionesWeb.periodoHistorico.texto.split(' - ')[1]
      });
    }
    
    // PERÍODO ACTUAL
    if (preinscripcionesWeb.periodoActual && preinscripcionesWeb.periodoActual.total > 0) {
      const cantidadSemipresencial = preinscripcionesWeb.periodoActual.modalidades['Semipresencial'] || 0;
      entradasPreinscripciones.push({
        periodo: `🔥 Preinscripciones Actuales (${preinscripcionesWeb.periodoActual.texto})`,
        cantidad: cantidadSemipresencial,
        porcentaje: calcularPorcentaje(cantidadSemipresencial, estudiantesEnPeriodo.length + cantidadSemipresencial),
        esPreinscripcion: true,
        tipoPreinscripcion: 'actual',
        fechaInicio: preinscripcionesWeb.periodoActual.texto.split(' - ')[0],
        fechaFin: preinscripcionesWeb.periodoActual.texto.split(' - ')[1]
      });
    }

    const distribucionTrimestre = periodosSemipresencial.ventanasTrimestre.map(ventana => {
      const estudiantesVentana = estudiantesEnPeriodo.filter(est => {
        const fecha = crearFechaInscripcion(est.fechaInscripcion);
        return fecha && esFechaEnRango(fecha, ventana.inicio, ventana.fin);
      });

      console.log(`Trimestre ${ventana.nombre}: ${estudiantesVentana.length} estudiantes`);

      return {
        periodo: ventana.nombre,
        cantidad: estudiantesVentana.length,
        porcentaje: calcularPorcentaje(estudiantesVentana.length, estudiantesEnPeriodo.length),
        tipo: 'trimestre'
      };
    });

    const distribucionSemestre = periodosSemipresencial.ventanasSemestre.map(ventana => {
      const estudiantesVentana = estudiantesEnPeriodo.filter(est => {
        const fecha = crearFechaInscripcion(est.fechaInscripcion);
        return fecha && esFechaEnRango(fecha, ventana.inicio, ventana.fin);
      });

      console.log(`Semestre ${ventana.nombre}: ${estudiantesVentana.length} estudiantes`);

      return {
        periodo: ventana.nombre,
        cantidad: estudiantesVentana.length,
        porcentaje: calcularPorcentaje(estudiantesVentana.length, estudiantesEnPeriodo.length),
        fechaInicio: ventana.inicio.toLocaleDateString(),
        fechaFin: ventana.fin.toLocaleDateString(),
        tipo: 'semestre',
        esPreinscripcion: false
      };
    });

    // Agregar preinscripciones como elementos separados SOLO en distribución trimestral
    // Las preinscripciones web NO pertenecen a períodos semestrales (Feb-Jun / Jul-Oct)
    const distribucionTrimestreCompleta = [...entradasPreinscripciones, ...distribucionTrimestre];
    const distribucionSemestreCompleta = [...distribucionSemestre]; // SIN preinscripciones web

    // Calcular totales
    const totalPreinscripciones = entradasPreinscripciones.reduce((sum, entry) => sum + entry.cantidad, 0);

    return {
      modalidad: 'SEMIPRESENCIAL',
      periodoCompleto: `20 Feb - 31 Oct ${anoAnalisis}`,
      totalInscripciones: estudiantesEnPeriodo.length,
      totalConPreinscripciones: estudiantesEnPeriodo.length + totalPreinscripciones,
      distribucionTrimestre: distribucionTrimestreCompleta,
      distribucionSemestre: distribucionSemestreCompleta,
      preinscripcionesWeb: {
        historico: entradasPreinscripciones.find(e => e.tipoPreinscripcion === 'historico'),
        actual: entradasPreinscripciones.find(e => e.tipoPreinscripcion === 'actual')
      },
      resumen: {
        ventanasTrimestre: 3,
        ventanasSemestre: 2,
        inscripcionesFueraPeriodo: estudiantes.length - estudiantesEnPeriodo.length,
        preinscripcionesHistoricas: preinscripcionesWeb.periodoHistorico.total || 0,
        preinscripcionesActuales: preinscripcionesWeb.periodoActual.total || 0
      }
    };
  }

  // Ejecutar análisis según modalidad seleccionada
  console.log('Ejecutando análisis para modalidad:', modalidadSeleccionada);
  
  if (modalidadSeleccionada === 'PRESENCIAL' || modalidadSeleccionada === 'presencial') {
    console.log('Analizando PRESENCIAL...');
    const resultado = await analizarModalidadPresencial(estudiantesFiltrados);
    console.log('Resultado PRESENCIAL:', resultado);
    return resultado;
  } else if (modalidadSeleccionada === 'SEMIPRESENCIAL' || modalidadSeleccionada === 'semipresencial') {
    console.log('Analizando SEMIPRESENCIAL...');
    const resultado = await analizarModalidadSemipresencial(estudiantesFiltrados);
    console.log('Resultado SEMIPRESENCIAL:', resultado);
    return resultado;
  } else {
    console.log('Analizando TODAS las modalidades...');
    // Análisis combinado para 'todas'
    const modalidades = agruparPor(estudiantesFiltrados, 'modalidad');
    const presenciales = modalidades['PRESENCIAL'] || [];
    const semipresenciales = modalidades['SEMIPRESENCIAL'] || [];

    return {
      modalidad: 'TODAS',
      analisisPresencial: await analizarModalidadPresencial(presenciales),
      analisisSemipresencial: await analizarModalidadSemipresencial(semipresenciales),
      resumen: {
        totalEstudiantes: estudiantesFiltrados.length,
        estudiantesPresencial: presenciales.length,
        estudiantesSemipresencial: semipresenciales.length,
        porcentajePresencial: calcularPorcentaje(presenciales.length, estudiantesFiltrados.length),
        porcentajeSemipresencial: calcularPorcentaje(semipresenciales.length, estudiantesFiltrados.length)
      }
    };
  }
};

// ===================================================================
// 4. ANÁLISIS DE DOCUMENTACIÓN
// ===================================================================
export const analizarDocumentacion = (estudiantes) => {
  const camposDocumentales = [
    'archivoDNI', 'archivoCUIL', 'archivoPartidaNacimiento',
    'archivoAnaliticoParcial', 'archivoCertificadoNivelPrimario',
    'archivoFichaMedica', 'archivoSolicitudPase'
  ];

  const analisisCompleto = estudiantes.map(estudiante => {
    const documentos = camposDocumentales.map(campo => ({
      tipo: campo.replace('archivo', ''),
      presente: !!estudiante[campo],
      valor: estudiante[campo] || null
    }));

    const documentosPresentes = documentos.filter(d => d.presente).length;
    const completitud = calcularPorcentaje(documentosPresentes, camposDocumentales.length);

    return {
      estudiante: normalizarTexto(`${estudiante.nombre} ${estudiante.apellido}`),
      documentos,
      completitud: parseFloat(completitud),
      estado: completitud == 100 ? 'completo' : 
              completitud >= 70 ? 'mayormente_completo' :
              completitud >= 40 ? 'incompleto' : 'critico'
    };
  });

  const estadosDocumentales = agruparPor(analisisCompleto, 'estado');
  const promedioCompletitud = analisisCompleto.reduce((sum, a) => sum + a.completitud, 0) / analisisCompleto.length;

  return {
    resumen: {
      totalEstudiantes: estudiantes.length,
      tiposDocumentos: camposDocumentales.length,
      completitudPromedio: promedioCompletitud.toFixed(1)
    },
    distribucion: Object.entries(estadosDocumentales).map(([estado, lista]) => ({
      estado,
      cantidad: lista.length,
      porcentaje: calcularPorcentaje(lista.length, estudiantes.length),
      estudiantes: lista.map(a => a.estudiante)
    })),
    documentosFaltantes: camposDocumentales.map(campo => {
      const faltantes = estudiantes.filter(e => !e[campo]);
      return {
        tipo: campo.replace('archivo', ''),
        faltantes: faltantes.length,
        porcentajeFaltante: calcularPorcentaje(faltantes.length, estudiantes.length),
        estudiantesSinDocumento: faltantes.map(e => normalizarTexto(`${e.nombre} ${e.apellido}`))
      };
    }).sort((a, b) => b.faltantes - a.faltantes),
    recomendaciones: []
  };
};

// ===================================================================
// 5. KPIs Y DASHBOARD EJECUTIVO MEJORADO CON ANÁLISIS PARA TOMA DE DECISIONES
// ===================================================================
export const generarKPIsAvanzados = (estudiantes, modalidadSeleccionada = 'todas', userRole = null) => {
  console.log('🎯 === GENERANDO KPIS AVANZADOS PARA TOMA DE DECISIONES ===');
  console.log('📊 Total estudiantes recibidos:', estudiantes.length);
  
  // Calcular KPIs específicos para toma de decisiones
  const kpisDecisiones = calcularKPIsDecisiones(estudiantes, modalidadSeleccionada, userRole);
  
  const total = estudiantes.length;
  
  // Detectar campo de estado automáticamente
  let campoEstado = 'estado';
  if (estudiantes.length > 0) {
    const primerEstudiante = estudiantes[0];
    if (primerEstudiante.estadoInscripcion) campoEstado = 'estadoInscripcion';
    else if (primerEstudiante.estado_inscripcion) campoEstado = 'estado_inscripcion';
    else if (primerEstudiante.idEstadoInscripcion) campoEstado = 'idEstadoInscripcion';
  }
  
  const estados = agruparPor(estudiantes, campoEstado);
  const modalidades = agruparPor(estudiantes, 'modalidad');
  
  console.log('📋 Campo de estado detectado:', campoEstado);
  console.log('📋 Estados encontrados:', Object.keys(estados));
  console.log('📋 Modalidades encontradas:', Object.keys(modalidades));
  
  // Clasificar estados dinámicamente
  const estadosCompletos = Object.keys(estados).filter(estado => 
    estado && (
      estado.toString().toLowerCase().includes('completa') ||
      estado.toString().toLowerCase().includes('completo') ||
      estado.toString() === '2' // ID 2 suele ser completa
    )
  );
  
  const estadosPendientes = Object.keys(estados).filter(estado => 
    estado && (
      estado.toString().toLowerCase().includes('pendiente') ||
      estado.toString() === '1' // ID 1 suele ser pendiente
    )
  );
  
  const cantidadCompletos = estadosCompletos.reduce((sum, estado) => sum + (estados[estado]?.length || 0), 0);
  const cantidadPendientes = estadosPendientes.reduce((sum, estado) => sum + (estados[estado]?.length || 0), 0);
  
  // Análisis de retención (campo activo)
  const estudiantesActivos = estudiantes.filter(e => e.activo === true || e.activo === 1);
  const estudiantesInactivos = estudiantes.filter(e => e.activo === false || e.activo === 0);
  
  // KPIs básicos mejorados con explicaciones detalladas
  const kpisBasicos = {
    totalEstudiantes: total,
    estudiantesActivos: estudiantesActivos.length,
    estudiantesInactivos: estudiantesInactivos.length,
    tasaRetencion: calcularPorcentaje(estudiantesActivos.length, total),
    tasaAbandono: calcularPorcentaje(estudiantesInactivos.length, total),
    tasaAprobacion: calcularPorcentaje(cantidadCompletos, total),
    tasaPendientes: calcularPorcentaje(cantidadPendientes, total),
    
    // Explicaciones detalladas de cada métrica - ESPECÍFICAMENTE SOBRE INSCRIPCIONES
    explicaciones: {
      totalEstudiantes: "Total de inscripciones registradas en el sistema educativo",
      estudiantesActivos: "Inscripciones de estudiantes que continúan cursando (campo 'activo'=true)",
      estudiantesInactivos: "Inscripciones de estudiantes que abandonaron o pausaron estudios (campo 'activo'=false)",
      tasaRetencion: "Porcentaje de inscripciones de estudiantes que mantienen estudios activos - IDEAL: >80%",
      tasaAbandono: "Porcentaje de inscripciones de estudiantes que abandonaron - CRÍTICO: >20%",
      tasaAprobacion: "Porcentaje de inscripciones administrativamente completas - IDEAL: >90%",
      tasaPendientes: "Porcentaje de inscripciones que requieren documentación pendiente - CRÍTICO: >30%"
    },
    
    // Interpretaciones según rangos - ESPECÍFICAMENTE SOBRE INSCRIPCIONES
    interpretaciones: {
      tasaRetencion: calcularPorcentaje(estudiantesActivos.length, total) >= 85 ? 'Excelente retención de inscripciones (≥85%)' :
                     calcularPorcentaje(estudiantesActivos.length, total) >= 70 ? 'Buena retención de inscripciones (70-84%)' :
                     calcularPorcentaje(estudiantesActivos.length, total) >= 50 ? 'Regular retención de inscripciones (50-69%)' : 'Retención crítica de inscripciones (<50%)',
      tasaAprobacion: calcularPorcentaje(cantidadCompletos, total) >= 90 ? 'Excelente procesamiento de inscripciones (≥90%)' :
                      calcularPorcentaje(cantidadCompletos, total) >= 75 ? 'Buen procesamiento de inscripciones (75-89%)' :
                      calcularPorcentaje(cantidadCompletos, total) >= 60 ? 'Procesamiento regular de inscripciones (60-74%)' : 'Procesamiento de inscripciones necesita mejora (<60%)',
      tasaPendientes: calcularPorcentaje(cantidadPendientes, total) < 15 ? 'Excelente - pocas inscripciones pendientes (<15%)' :
                      calcularPorcentaje(cantidadPendientes, total) < 25 ? 'Bueno - inscripciones pendientes controladas (15-24%)' :
                      calcularPorcentaje(cantidadPendientes, total) < 35 ? 'Regular - muchas inscripciones pendientes (25-34%)' : 'Crítico - demasiadas inscripciones pendientes (≥35%)'
    },
    
    distribucionModalidad: Object.entries(modalidades).map(([modalidad, lista]) => ({
      modalidad: modalidad || 'Sin especificar',
      cantidad: lista.length,
      porcentaje: calcularPorcentaje(lista.length, total),
      activos: lista.filter(e => e.activo === true || e.activo === 1).length,
      inactivos: lista.filter(e => e.activo === false || e.activo === 0).length
    }))
  };

  // KPIs avanzados con análisis temporal y tendencias
  const fechas = estudiantes
    .map(e => {
      // Intentar múltiples campos de fecha
      const fechaStr = e.fechaInscripcion || e.fecha_inscripcion || e.fecha;
      return fechaStr ? new Date(fechaStr) : null;
    })
    .filter(d => d && !isNaN(d.getTime()));
    
  console.log('📅 Fechas válidas encontradas:', fechas.length);
  
  const inscripcionesPorMes = {};
  const anoActual = new Date().getFullYear();
  
  fechas.forEach(fecha => {
    const mesAno = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    inscripcionesPorMes[mesAno] = (inscripcionesPorMes[mesAno] || 0) + 1;
  });

  const valores = Object.values(inscripcionesPorMes);
  const promedioMensual = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
  
  // Análisis de documentación
  const camposDocumentales = [
    'archivoDNI', 'archivoCUIL', 'archivoPartidaNacimiento',
    'archivoAnaliticoParcial', 'archivoCertificadoNivelPrimario',
    'archivoFichaMedica', 'archivoSolicitudPase'
  ];
  
  const analisisDocumental = estudiantes.map(estudiante => {
    const documentosPresentes = camposDocumentales.filter(campo => estudiante[campo]).length;
    const completitud = (documentosPresentes / camposDocumentales.length) * 100;
    return completitud;
  });
  
  const completitudPromedio = analisisDocumental.length > 0 ? 
    analisisDocumental.reduce((a, b) => a + b, 0) / analisisDocumental.length : 0;
    
  // Análisis por año académico
  const estudiantesEsteAno = estudiantes.filter(e => {
    const fecha = new Date(e.fechaInscripcion || e.fecha_inscripcion || e.fecha);
    return !isNaN(fecha.getTime()) && fecha.getFullYear() === anoActual;
  });
  
  const kpisAvanzados = {
    eficienciaProceso: {
      tasaRetencion: kpisBasicos.tasaRetencion,
      tasaFinalizacionAdministrativa: calcularPorcentaje(cantidadCompletos, total),
      eficienciaAdministrativa: calcularPorcentaje(cantidadCompletos, cantidadCompletos + cantidadPendientes),
      indicadorCalidad: kpisBasicos.tasaRetencion >= 85 ? 'Excelente' :
                       kpisBasicos.tasaRetencion >= 70 ? 'Buena' :
                       kpisBasicos.tasaRetencion >= 50 ? 'Regular' : 'Necesita mejora urgente',
      explicaciones: {
        tasaFinalizacionAdministrativa: "% de inscripciones que completan exitosamente todo el proceso administrativo de inscripción",
        eficienciaAdministrativa: "% de eficiencia del área administrativa en procesar inscripciones sin demoras",
        indicadorCalidad: "Evaluación integral del proceso educativo basada en retención de inscripciones estudiantiles"
      }
    },
    tendenciasTemporales: {
      promedioMensual: promedioMensual.toFixed(1),
      inscripcionesEsteAno: estudiantesEsteAno.length,
      porcentajeEsteAno: calcularPorcentaje(estudiantesEsteAno.length, total),
      tendenciaGeneral: calcularTendencia(valores),
      mesConMayorActividad: Object.entries(inscripcionesPorMes).length > 0 ? 
        Object.entries(inscripcionesPorMes).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 'N/A',
      picos: Object.entries(inscripcionesPorMes)
        .filter(([, cant]) => cant > promedioMensual * 1.3)
        .map(([mes, cant]) => ({ mes, cantidad: cant })),
      explicaciones: {
        promedioMensual: "Promedio de nuevas inscripciones procesadas por mes - ayuda a planificar recursos administrativos",
        tendenciaGeneral: "Dirección del crecimiento de inscripciones: 'creciente' (↗), 'estable' (→), 'decreciente' (↘)",
        inscripcionesEsteAno: "Nuevas inscripciones registradas en el año académico actual",
        mesConMayorActividad: "Mes con mayor volumen de nuevas inscripciones - útil para planificación de personal administrativo"
      }
    },
    indicadoresCalidad: {
      eficienciaAdministrativa: calcularPorcentaje(cantidadCompletos, cantidadCompletos + cantidadPendientes),
      distribucionEquitativa: Object.keys(modalidades).length > 1 ? 'Diversificado' : 'Concentrado',
      satisfaccionProceso: calcularPorcentaje(cantidadCompletos, total) >= 80 ? 'Alta' :
                          calcularPorcentaje(cantidadCompletos, total) >= 60 ? 'Media' : 'Baja',
      alertasActivas: [],
      explicaciones: {
        eficienciaAdministrativa: "Capacidad del sistema administrativo para procesar inscripciones sin demoras ni trabas burocráticas",
        distribucionEquitativa: "Equilibrio entre modalidades en las inscripciones - 'Diversificado' permite mejor atención personalizada",
        satisfaccionProceso: "Nivel de satisfacción inferido del proceso de inscripción basado en finalizaciones exitosas"
      }
    },
    metricas2025: {
      totalEstudiantes: total,
      totalInscripciones: total,
      nuevasInscripciones: estudiantesEsteAno.length,
      tasaRetencionInscripciones: kpisBasicos.tasaRetencion,
      modalidadDominanteInscripciones: Object.entries(modalidades).reduce((a, b) => 
        modalidades[a[0]].length > modalidades[b[0]].length ? a : b)[0],
      crecimientoAnualInscripciones: fechas.length > 0 ? ((estudiantesEsteAno.length / total) * 100).toFixed(1) + '%' : 'N/A'
    }
  };

  // Recomendaciones estratégicas mejoradas
  const recomendaciones = [];
  
  // Recomendaciones por retención
  const tasaRetencionNum = kpisBasicos.tasaRetencion;
  if (tasaRetencionNum < 70) {
    recomendaciones.push({
      prioridad: 'alta',
      area: 'Retención Estudiantil',
      recomendacion: 'Implementar programa de apoyo estudiantil y seguimiento personalizado',
      impactoEstimado: 'Mejora del 15-25% en retención',
      accionInmediata: 'Entrevistar estudiantes que abandonaron para identificar causas'
    });
  }

  // Recomendaciones por pendientes administrativos
  if (kpisBasicos.tasaPendientes > 30) {
    recomendaciones.push({
      prioridad: 'alta',
      area: 'Proceso Administrativo',
      recomendacion: 'Optimizar flujo de documentación y comunicación con estudiantes para reducir trabas burocráticas',
      impactoEstimado: 'Reducción del 25-40% en tiempos de procesamiento y mejora en satisfacción estudiantil',
      accionInmediata: 'Implementar recordatorios automáticos y crear ventanilla única de atención'
    });
  }

  // Recomendaciones por baja finalización administrativa
  const tasaFinalizacion = calcularPorcentaje(cantidadCompletos, total);
  if (tasaFinalizacion < 70) {
    recomendaciones.push({
      prioridad: 'alta',
      area: 'Eficiencia Administrativa',
      recomendacion: 'Simplificar proceso de inscripción y eliminar pasos innecesarios que generan abandono',
      impactoEstimado: 'Incremento del 20-35% en finalizaciones exitosas del proceso administrativo',
      accionInmediata: 'Digitalizar formularios y crear guías visuales paso a paso para estudiantes'
    });
  }

  // Recomendaciones por tendencias temporales
  if (kpisAvanzados.tendenciasTemporales.tendenciaGeneral === 'decreciente') {
    recomendaciones.push({
      prioridad: 'media',
      area: 'Captación y Marketing',
      recomendacion: 'Revisar estrategias de captación y canales de comunicación',
      impactoEstimado: 'Incremento del 15-30% en nuevas inscripciones',
      accionInmediata: 'Análizar competencia y ajustar propuesta de valor'
    });
  }

  // Recomendaciones por desequilibrio de modalidades
  const modalidadesArray = Object.entries(modalidades);
  if (modalidadesArray.length > 1) {
    const mayorModalidad = modalidadesArray.reduce((a, b) => a[1].length > b[1].length ? a : b);
    const porcentajeMayor = (mayorModalidad[1].length / total) * 100;
    if (porcentajeMayor > 80) {
      recomendaciones.push({
        prioridad: 'baja',
        area: 'Diversificación',
        recomendacion: `Promover modalidad ${modalidadesArray.find(m => m !== mayorModalidad)[0]} para equilibrar oferta`,
        impactoEstimado: 'Mejor distribución de recursos y atención personalizada',
        accionInmediata: 'Crear campaña específica para modalidad menos popular'
      });
    }
  }

  console.log('✅ KPIs Avanzados generados exitosamente');
  console.log('📊 Tasa de Retención:', kpisBasicos.tasaRetencion + '%');
  console.log('📋 Completitud Documental:', completitudPromedio.toFixed(1) + '%');
  console.log('🎯 Recomendaciones generadas:', recomendaciones.length);

  return {
    kpisBasicos,
    kpisAvanzados,
    kpisDecisiones, // Nuevos KPIs para toma de decisiones
    recomendaciones,
    alertas: [
      // Alertas críticas por retención usando nuevos KPIs
      ...(kpisDecisiones.estadoGeneral.tasaEstudiantesActivos.valor < 60 ? [{
        tipo: 'critica',
        mensaje: `Tasa de estudiantes activos crítica (${kpisDecisiones.estadoGeneral.tasaEstudiantesActivos.valor}%). Requiere intervención inmediata.`,
        accion: kpisDecisiones.estadoGeneral.tasaEstudiantesActivos.accionRequerida
      }] : []),
      
      // Alertas por proceso de inscripción
      ...(kpisDecisiones.procesoInscripcion.tasaInscripcionesPendientes.valor > 50 ? [{
        tipo: 'critica',
        mensaje: `Cuello de botella crítico en inscripciones (${kpisDecisiones.procesoInscripcion.tasaInscripcionesPendientes.valor}% pendientes).`,
        accion: kpisDecisiones.procesoInscripcion.tasaInscripcionesPendientes.accionRequerida
      }] : []),
      
      // Alertas por eficiencia por modalidad
      ...kpisDecisiones.eficienciaPorModalidad.tasaActividadPorModalidad
        .filter(modalidad => modalidad.valor < 60)
        .map(modalidad => ({
          tipo: 'warning',
          mensaje: `Modalidad ${modalidad.modalidad} con retención crítica (${modalidad.valor}%).`,
          accion: modalidad.accionRequerida
        })),
      
      // Alerta por brecha entre modalidades
      ...(kpisDecisiones.analisisComparativo.brechaRetencionModalidades > 20 ? [{
        tipo: 'warning',
        mensaje: `Brecha significativa entre modalidades (${kpisDecisiones.analisisComparativo.brechaRetencionModalidades.toFixed(1)}%).`,
        accion: kpisDecisiones.analisisComparativo.recomendacionEstrategica
      }] : []),
      
      // Alerta por índice de salud institucional
      ...(parseFloat(kpisDecisiones.indiceCalidadEducativa.valor) < 60 ? [{
        tipo: 'critica',
        mensaje: `Índice de Calidad Educativa crítico (${kpisDecisiones.indiceCalidadEducativa.valor}%). Requiere mejoras urgentes en el centro educativo.`,
        accion: kpisDecisiones.indiceCalidadEducativa.recomendacionesPrioritarias[0]
      }] : []),
      
      // Alertas críticas por retención original
      ...(tasaRetencionNum < 50 ? [{
        tipo: 'critica',
        mensaje: `Tasa de retención crítica (${kpisBasicos.tasaRetencion}%). Requiere intervención inmediata.`,
        accion: 'Implementar programa de retención urgente'
      }] : []),
      
      // Alertas por pendientes administrativos
      ...(kpisBasicos.tasaPendientes > 40 ? [{
        tipo: 'warning',
        mensaje: `Alto porcentaje de inscripciones pendientes (${kpisBasicos.tasaPendientes}%)`,
        accion: 'Revisar y agilizar proceso administrativo'
      }] : []),
      
      // Alertas por retención baja pero no crítica
      ...(tasaRetencionNum >= 50 && tasaRetencionNum < 70 ? [{
        tipo: 'warning',
        mensaje: `Tasa de retención necesita mejora (${kpisBasicos.tasaRetencion}%)`,
        accion: 'Implementar seguimiento estudiantil'
      }] : []),
      
      // Alertas positivas
      ...(tasaRetencionNum >= 85 ? [{
        tipo: 'success',
        mensaje: `Excelente tasa de retención (${kpisBasicos.tasaRetencion}%)`,
        accion: 'Mantener y documentar estrategias exitosas'
      }] : []),
      
      // Alertas por completitud documental
      ...(completitudPromedio < 60 ? [{
        tipo: 'warning',
        mensaje: `Completitud documental baja (${completitudPromedio.toFixed(1)}%)`,
        accion: 'Mejorar proceso de carga de documentos'
      }] : []),
      
      // Alertas informativas
      [{
        tipo: 'info',
        mensaje: `Análisis realizado sobre ${total} estudiantes`,
        accion: `Modalidades: ${Object.keys(modalidades).join(', ')}`
      }]
    ],
    metadatos: {
      fechaAnalisis: new Date().toLocaleDateString('es-AR'),
      horaAnalisis: new Date().toLocaleTimeString('es-AR'),
      totalRegistros: total,
      modalidadesAnalizadas: Object.keys(modalidades),
      campoEstadoUsado: campoEstado,
      fechasValidasEncontradas: fechas.length
    }
  };
};

// ===================================================================
// 6. ANÁLISIS DE MODALIDADES
// ===================================================================
export const analizarModalidades = (estudiantes) => {
  const modalidades = agruparPor(estudiantes, 'modalidad');
  const total = estudiantes.length;

  return {
    resumen: {
      totalEstudiantes: total,
      modalidadesDetectadas: Object.keys(modalidades).length
    },
    distribucion: Object.entries(modalidades).map(([modalidad, lista]) => {
      const estados = agruparPor(lista, 'estado');
      return {
        modalidad: normalizarTexto(modalidad),
        cantidad: lista.length,
        porcentaje: calcularPorcentaje(lista.length, total),
        estados: Object.entries(estados).map(([estado, estudiantesEstado]) => ({
          estado: normalizarTexto(estado),
          cantidad: estudiantesEstado.length,
          porcentaje: calcularPorcentaje(estudiantesEstado.length, lista.length)
        })),
        estudiantes: lista.map(e => ({
          nombre: normalizarTexto(`${e.nombre} ${e.apellido}`),
          estado: e.estado,
          fechaInscripcion: e.fechaInscripcion
        }))
      };
    }).sort((a, b) => b.cantidad - a.cantidad),
    metricas: {
      modalidadPrincipal: Object.keys(modalidades).reduce((a, b) => 
        modalidades[a].length > modalidades[b].length ? a : b),
      diversidadIndice: Object.keys(modalidades).length > 1 ? 'Diversificado' : 'Concentrado'
    }
  };
};

// ===================================================================
// 7. KPIs MEJORADOS PARA TOMA DE DECISIONES - ANÁLISIS EXPERTO
// ===================================================================
export const calcularKPIsDecisiones = (estudiantes, modalidadSeleccionada = 'todas', userRole = null) => {
  console.log('🎯 === CALCULANDO KPIS PARA TOMA DE DECISIONES ===');
  console.log('📊 Total estudiantes recibidos:', estudiantes.length);
  console.log('👤 Rol de usuario:', userRole);
  
  // Filtrar estudiantes por modalidad si se especifica
  let estudiantesFiltrados = estudiantes;
  if (modalidadSeleccionada !== 'todas') {
    estudiantesFiltrados = estudiantes.filter(est => 
      est.modalidad && est.modalidad.toUpperCase() === modalidadSeleccionada.toUpperCase()
    );
  }
  
  // Información contextual según rol
  const contextoPorRol = {
    'secretario': {
      modalidadEnfoque: 'PRESENCIAL',
      descripcionDocumentacion: 'Toda la documentación de inscripciones modalidad PRESENCIAL - Certificados, analíticos, fichas médicas, etc.',
      procesoEspecifico: 'Gestión integral de inscripciones y documentación modalidad PRESENCIAL'
    },
    'coordinador': {
      modalidadEnfoque: 'SEMIPRESENCIAL', 
      descripcionDocumentacion: 'Toda la documentación de inscripciones modalidad SEMIPRESENCIAL - Analíticos, certificados, validaciones, etc.',
      procesoEspecifico: 'Gestión integral de inscripciones y documentación modalidad SEMIPRESENCIAL'
    },
    'coordinadoradministrativo': {
      modalidadEnfoque: 'SEMIPRESENCIAL',
      descripcionDocumentacion: 'Toda la documentación de inscripciones modalidad SEMIPRESENCIAL - Analíticos, certificados, validaciones, etc.', 
      procesoEspecifico: 'Gestión integral de inscripciones y documentación modalidad SEMIPRESENCIAL'
    },
    'administrador': {
      modalidadEnfoque: 'TODAS',
      descripcionDocumentacion: 'Supervisión de documentación PRESENCIAL y SEMIPRESENCIAL - Procesos integrales de ambas modalidades',
      procesoEspecifico: 'Supervisión integral de inscripciones y validaciones académicas'
    },
    'admdirector': {
      modalidadEnfoque: 'TODAS',
      descripcionDocumentacion: 'Supervisión de documentación PRESENCIAL y SEMIPRESENCIAL - Procesos integrales de ambas modalidades',
      procesoEspecifico: 'Supervisión integral de inscripciones y validaciones académicas'
    }
  };
  
  const contextoActual = contextoPorRol[userRole?.toLowerCase()] || contextoPorRol['administrador'];
  
  // === CATEGORÍA: ESTADO GENERAL ===
  const estudiantesActivos = estudiantesFiltrados.filter(e => e.activo === 1 || e.activo === true);
  const estudiantesInactivos = estudiantesFiltrados.filter(e => e.activo === 0 || e.activo === false);
  
  const kpisEstadoGeneral = {
    tasaEstudiantesActivos: {
      valor: calcularPorcentaje(estudiantesActivos.length, estudiantesFiltrados.length),
      calculo: `(${estudiantesActivos.length}/${estudiantesFiltrados.length}) × 100`,
      justificacion: 'Mide la salud general de la matrícula estudiantil. KPI fundamental para evaluar retención.',
      fuenteDatos: 'Campo activo de tabla estudiantes',
      categoria: 'Estado General',
      interpretacion: estudiantesActivos.length / estudiantesFiltrados.length >= 0.85 ? 'Excelente' :
                     estudiantesActivos.length / estudiantesFiltrados.length >= 0.70 ? 'Buena' :
                     estudiantesActivos.length / estudiantesFiltrados.length >= 0.60 ? 'Regular' : 'Crítica',
      meta: '≥85% para considerarse excelente',
      accionRequerida: estudiantesActivos.length / estudiantesFiltrados.length < 0.70 ? 
        'Implementar programa de retención urgente' : 'Mantener estrategias actuales'
    },
    tasaEstudiantesInactivos: {
      valor: calcularPorcentaje(estudiantesInactivos.length, estudiantesFiltrados.length),
      calculo: `(${estudiantesInactivos.length}/${estudiantesFiltrados.length}) × 100`,
      justificacion: 'Identifica porcentaje de estudiantes para contactar en procesos de reinscripción/actualización.',
      fuenteDatos: 'Campo activo de tabla estudiantes',
      categoria: 'Estado General',
      interpretacion: estudiantesInactivos.length / estudiantesFiltrados.length <= 0.15 ? 'Excelente' :
                     estudiantesInactivos.length / estudiantesFiltrados.length <= 0.25 ? 'Buena' :
                     estudiantesInactivos.length / estudiantesFiltrados.length <= 0.35 ? 'Regular' : 'Crítica',
      meta: '≤15% para considerarse excelente',
      accionRequerida: estudiantesInactivos.length / estudiantesFiltrados.length > 0.25 ? 
        'Contactar estudiantes inactivos para reactivación' : 'Seguimiento regular'
    }
  };
  
  // === CATEGORÍA: PROCESO DE INSCRIPCIÓN ===
  // Detectar campo de estado dinámicamente
  let campoEstado = 'estado';
  if (estudiantesFiltrados.length > 0) {
    const primerEstudiante = estudiantesFiltrados[0];
    if (primerEstudiante.estadoInscripcion) campoEstado = 'estadoInscripcion';
    else if (primerEstudiante.estado_inscripcion) campoEstado = 'estado_inscripcion';
    else if (primerEstudiante.idEstadoInscripcion) campoEstado = 'idEstadoInscripcion';
  }
  
  // Solo analizar estudiantes activos para proceso de inscripción
  const inscripcionesActivas = estudiantesActivos;
  const estadosInscripcion = agruparPor(inscripcionesActivas, campoEstado);
  
  // Clasificar estados dinámicamente
  const estadosCompletos = Object.keys(estadosInscripcion).filter(estado => 
    estado && (
      estado.toString().toLowerCase().includes('completa') ||
      estado.toString().toLowerCase().includes('completo') ||
      estado.toString() === '2' // ID 2 suele ser completa
    )
  );
  
  const estadosPendientes = Object.keys(estadosInscripcion).filter(estado => 
    estado && (
      estado.toString().toLowerCase().includes('pendiente') ||
      estado.toString() === '1' // ID 1 suele ser pendiente
    )
  );
  
  const inscripcionesCompletas = estadosCompletos.reduce((sum, estado) => sum + (estadosInscripcion[estado]?.length || 0), 0);
  const inscripcionesPendientes = estadosPendientes.reduce((sum, estado) => sum + (estadosInscripcion[estado]?.length || 0), 0);
  
  const kpisProcesoInscripcion = {
    tasaInscripcionesPendientes: {
      valor: calcularPorcentaje(inscripcionesPendientes, inscripcionesActivas.length),
      calculo: `(${inscripcionesPendientes}/${inscripcionesActivas.length}) × 100`,
      justificacion: `${contextoActual.procesoEspecifico}. ${contextoActual.descripcionDocumentacion}`,
      fuenteDatos: `Campo ${campoEstado} de estudiantes activos`,
      categoria: 'Evaluación Académica Pendiente',
      contextoRol: contextoActual.modalidadEnfoque,
      interpretacion: inscripcionesPendientes / inscripcionesActivas.length <= 0.30 ? 'Flujo normal de evaluación' :
                     inscripcionesPendientes / inscripcionesActivas.length <= 0.50 ? 'Volumen esperado en evaluación' :
                     inscripcionesPendientes / inscripcionesActivas.length <= 0.70 ? 'Alto volumen - proceso normal' : 'Requiere priorización directiva',
      meta: 'Proceso continuo según complejidad académica',
      accionRequerida: inscripcionesPendientes / inscripcionesActivas.length > 0.80 ? 
        'Priorizar evaluaciones académicas pendientes' : 'Proceso de evaluación académica en marcha'
    },
    tasaInscripcionesCompletas: {
      valor: calcularPorcentaje(inscripcionesCompletas, inscripcionesActivas.length),
      calculo: `(${inscripcionesCompletas}/${inscripcionesActivas.length}) × 100`,
      justificacion: `${contextoActual.procesoEspecifico}. Pendientes aguardan evaluación directiva de documentos (${contextoActual.descripcionDocumentacion}).`,
      fuenteDatos: `Campo ${campoEstado} de estudiantes activos`,
      categoria: 'Proceso de Validación Académica',
      contextoRol: contextoActual.modalidadEnfoque,
      interpretacion: inscripcionesCompletas / inscripcionesActivas.length >= 0.80 ? 'Excelente procesamiento académico' :
                     inscripcionesCompletas / inscripcionesActivas.length >= 0.50 ? 'Buen flujo de validación académica' :
                     inscripcionesCompletas / inscripcionesActivas.length >= 0.30 ? 'Flujo normal - evaluación en proceso' : 'Requiere seguimiento de validaciones',
      meta: 'Proceso continuo - pendientes normales por evaluación académica',
      accionRequerida: inscripcionesCompletas / inscripcionesActivas.length < 0.20 ? 
        'Acelerar evaluación de equivalencias académicas' : 'Proceso de validación académica en marcha normal'
    }
  };
  
  // === CATEGORÍA: DISTRIBUCIÓN DE MATRÍCULA ===
  const modalidades = agruparPor(estudiantesFiltrados, 'modalidad');
  const totalInscripciones = estudiantesFiltrados.length;
  
  const kpisDistribucionMatricula = {
    porcentajeMatriculaPorModalidad: Object.entries(modalidades).map(([modalidad, estudiantes]) => ({
      modalidad: modalidad || 'Sin especificar',
      valor: calcularPorcentaje(estudiantes.length, totalInscripciones),
      calculo: `(${estudiantes.length}/${totalInscripciones}) × 100`,
      justificacion: 'Muestra preferencia estudiantil y carga operativa de cada modalidad para asignación de recursos.',
      fuenteDatos: 'Campo modalidad de tabla estudiantes',
      categoria: 'Distribución de Matrícula',
      cantidad: estudiantes.length,
      estudiantesActivos: estudiantes.filter(e => e.activo === 1 || e.activo === true).length,
      estudiantesInactivos: estudiantes.filter(e => e.activo === 0 || e.activo === false).length
    }))
  };
  
  // === CATEGORÍA: DISTRIBUCIÓN ESPECÍFICA POR MODALIDAD ===
  const kpisDistribucionEspecifica = {};
  
  // Análisis SEMIPRESENCIAL por planes
  const semipresenciales = modalidades['SEMIPRESENCIAL'] || [];
  if (semipresenciales.length > 0) {
    const planesSemipresencial = agruparPor(semipresenciales, 'cursoPlan');
    kpisDistribucionEspecifica.semipresencial = {
      porcentajeInscripcionPorPlan: Object.entries(planesSemipresencial).map(([plan, estudiantes]) => ({
        plan: plan || 'Sin plan especificado',
        valor: calcularPorcentaje(estudiantes.length, semipresenciales.length),
        calculo: `(${estudiantes.length}/${semipresenciales.length}) × 100`,
        justificacion: 'Clave para asignar recursos: docentes, tutores, aulas y materiales en modalidad semipresencial.',
        fuenteDatos: 'Campo cursoPlan de estudiantes semipresenciales',
        categoria: 'Distribución Semipresencial',
        cantidad: estudiantes.length,
        estudiantesActivos: estudiantes.filter(e => e.activo === 1 || e.activo === true).length
      }))
    };
  }
  
  // Análisis PRESENCIAL por cursos/años
  const presenciales = modalidades['PRESENCIAL'] || [];
  if (presenciales.length > 0) {
    const cursosPorAno = {};
    presenciales.forEach(est => {
      const plan = est.cursoPlan || est.planAnio || 'Sin año especificado';
      // Extraer año del plan (ej: "Plan 2021" -> "2021", "1º Año" -> "1º Año")
      const ano = plan.includes('º') ? plan : (plan.match(/\d{4}/) ? plan.match(/\d{4}/)[0] : plan);
      if (!cursosPorAno[ano]) cursosPorAno[ano] = [];
      cursosPorAno[ano].push(est);
    });
    
    kpisDistribucionEspecifica.presencial = {
      porcentajeInscripcionPorAnio: Object.entries(cursosPorAno).map(([ano, estudiantes]) => ({
        año: ano,
        valor: calcularPorcentaje(estudiantes.length, presenciales.length),
        calculo: `(${estudiantes.length}/${presenciales.length}) × 100`,
        justificacion: 'Clave para planificar estructura académica, horarios y recursos en modalidad presencial.',
        fuenteDatos: 'Campo cursoPlan/planAnio de estudiantes presenciales',
        categoria: 'Distribución Presencial',
        cantidad: estudiantes.length,
        estudiantesActivos: estudiantes.filter(e => e.activo === 1 || e.activo === true).length
      }))
    };
  }
  
  // === CATEGORÍA: EFICIENCIA POR MODALIDAD ===
  const kpisEficienciaPorModalidad = {
    tasaActividadPorModalidad: Object.entries(modalidades).map(([modalidad, estudiantes]) => {
      const activos = estudiantes.filter(e => e.activo === 1 || e.activo === true);
      return {
        modalidad: modalidad || 'Sin especificar',
        valor: calcularPorcentaje(activos.length, estudiantes.length),
        calculo: `(${activos.length}/${estudiantes.length}) × 100`,
        justificacion: 'Compara salud de matrícula entre modalidades. Identifica cuál modalidad retiene mejor a sus estudiantes.',
        fuenteDatos: 'Campo activo agrupado por modalidad',
        categoria: 'Eficiencia por Modalidad',
        totalEstudiantes: estudiantes.length,
        estudiantesActivos: activos.length,
        estudiantesInactivos: estudiantes.length - activos.length,
        interpretacion: activos.length / estudiantes.length >= 0.95 ? 'Excelente retención modalidad' :
                       activos.length / estudiantes.length >= 0.80 ? 'Muy buena retención modalidad' :
                       activos.length / estudiantes.length >= 0.50 ? 'Buena retención modalidad' : 'Regular retención modalidad',
        accionRequerida: activos.length / estudiantes.length < 0.50 ? 
          `Revisar urgentemente estrategias específicas para modalidad ${modalidad}` :
          activos.length / estudiantes.length < 0.80 ?
          `Mejorar estrategias para modalidad ${modalidad}` : 'Mantener estrategias actuales'
      };
    })
  };
  
  // === ANÁLISIS COMPARATIVO ENTRE MODALIDADES ===
  const analisisComparativo = {
    modalidadConMejorRetencion: kpisEficienciaPorModalidad.tasaActividadPorModalidad.length > 0 ?
      kpisEficienciaPorModalidad.tasaActividadPorModalidad.reduce((mejor, actual) => 
        actual.valor > mejor.valor ? actual : mejor
      ) : null,
    brechaRetencionModalidades: kpisEficienciaPorModalidad.tasaActividadPorModalidad.length > 1 ?
      Math.max(...kpisEficienciaPorModalidad.tasaActividadPorModalidad.map(m => m.valor)) -
      Math.min(...kpisEficienciaPorModalidad.tasaActividadPorModalidad.map(m => m.valor)) : 0,
    recomendacionEstrategica: null
  };
  
  if (analisisComparativo.brechaRetencionModalidades > 15) {
    analisisComparativo.recomendacionEstrategica = 'Brecha significativa entre modalidades. Investigar mejores prácticas de la modalidad con mayor retención.';
  } else if (analisisComparativo.brechaRetencionModalidades > 10) {
    analisisComparativo.recomendacionEstrategica = 'Diferencia moderada entre modalidades. Considerar ajustes en modalidad con menor retención.';
  } else {
    analisisComparativo.recomendacionEstrategica = 'Retención equilibrada entre modalidades. Mantener estrategias actuales.';
  }
  
  // === KPI INTEGRADO: ÍNDICE DE CALIDAD ADMINISTRATIVA ===
  const indiceCalidadEducativa = {
    valor: (
      (kpisEstadoGeneral.tasaEstudiantesActivos.valor * 0.4) +
      (kpisProcesoInscripcion.tasaInscripcionesCompletas.valor * 0.3) +
      ((100 - Math.max(...kpisEficienciaPorModalidad.tasaActividadPorModalidad.map(m => 100 - m.valor))) * 0.3)
    ).toFixed(1),
    componentes: {
      'Retención Estudiantil': { 
        peso: 40, 
        valor: kpisEstadoGeneral.tasaEstudiantesActivos.valor,
        descripcion: 'Capacidad de mantener estudiantes activos en el centro'
      },
      'Validación Académica': { 
        peso: 30, 
        valor: kpisProcesoInscripcion.tasaInscripcionesCompletas.valor,
        descripcion: 'Progreso en validación de equivalencias y certificaciones académicas'
      },
      'Equilibrio Modalidades': { 
        peso: 30, 
        valor: (100 - Math.max(...kpisEficienciaPorModalidad.tasaActividadPorModalidad.map(m => 100 - m.valor))),
        descripcion: 'Balance entre modalidades educativas ofrecidas'
      }
    },
    interpretacion: null,
    recomendacionesPrioritarias: []
  };
  
  const valorIndice = parseFloat(indiceCalidadEducativa.valor);
  if (valorIndice >= 85) {
    indiceCalidadEducativa.interpretacion = 'EXCELENTE - Centro con alta calidad administrativa';
    indiceCalidadEducativa.recomendacionesPrioritarias = ['Documentar mejores prácticas administrativas', 'Mantener estándares de excelencia', 'Considerar expansión de servicios'];
  } else if (valorIndice >= 70) {
    indiceCalidadEducativa.interpretacion = 'BUENA - Centro con calidad administrativa satisfactoria';
    indiceCalidadEducativa.recomendacionesPrioritarias = ['Identificar oportunidades de mejora administrativa', 'Optimizar procesos de gestión'];
  } else if (valorIndice >= 55) {
    indiceCalidadEducativa.interpretacion = 'REGULAR - Centro administrativo necesita mejoras';
    indiceCalidadEducativa.recomendacionesPrioritarias = ['Implementar plan de mejora administrativa integral', 'Priorizar área con menor rendimiento'];
  } else {
    indiceCalidadEducativa.interpretacion = 'CRÍTICA - Centro administrativo requiere intervención urgente';
    indiceCalidadEducativa.recomendacionesPrioritarias = ['Plan de rescate administrativo inmediato', 'Intervención en todas las áreas de gestión', 'Revisión completa de métodos administrativos'];
  }
  
  console.log('✅ KPIs para toma de decisiones calculados exitosamente');
  
  return {
    estadoGeneral: kpisEstadoGeneral,
    procesoInscripcion: kpisProcesoInscripcion,
    distribucionMatricula: kpisDistribucionMatricula,
    distribucionEspecifica: kpisDistribucionEspecifica,
    eficienciaPorModalidad: kpisEficienciaPorModalidad,
    analisisComparativo,
    indiceCalidadEducativa,
    metadatos: {
      fechaAnalisis: new Date().toLocaleDateString('es-AR'),
      modalidadAnalizada: modalidadSeleccionada,
      totalEstudiantesAnalizados: estudiantesFiltrados.length,
      campoEstadoUsado: campoEstado,
      modalidadesDetectadas: Object.keys(modalidades)
    }
  };
};

// ===================================================================
// 8. ANÁLISIS DE RETENCIÓN Y ABANDONO ESTUDIANTIL - BASADO EN CAMPO 'ACTIVO' DE BD
// ===================================================================
export const analizarRendimiento = (estudiantes) => {
  console.log('🎯 === ANÁLISIS DE RETENCIÓN Y ABANDONO ESTUDIANTIL ===');
  console.log('📊 Total estudiantes recibidos:', estudiantes.length);
  
  // SEPARAR POR CAMPO 'ACTIVO' DE LA BASE DE DATOS
  // activo = 1 → Estudiante activo (continúa estudios)
  // activo = 0 → Estudiante inactivo (abandono de estudios)
  const estudiantesActivos = estudiantes.filter(e => e.activo === 1 || e.activo === true);
  const estudiantesInactivos = estudiantes.filter(e => e.activo === 0 || e.activo === false);
  
  console.log('✅ Estudiantes ACTIVOS (activo=1):', estudiantesActivos.length);
  console.log('❌ Estudiantes INACTIVOS (activo=0):', estudiantesInactivos.length);
  
  // Si hay inconsistencia, informar
  const totalSeparados = estudiantesActivos.length + estudiantesInactivos.length;
  if (totalSeparados !== estudiantes.length) {
    console.warn('⚠️ Inconsistencia en campo activo:', {
      total: estudiantes.length,
      activos: estudiantesActivos.length,
      inactivos: estudiantesInactivos.length,
      calculado: totalSeparados
    });
  }

  // Analizar distribución por modalidad en cada grupo
  const modalidadesActivos = agruparPor(estudiantesActivos, 'modalidad');
  const modalidadesInactivos = agruparPor(estudiantesInactivos, 'modalidad');
  
  return {
    resumen: {
      totalEstudiantes: estudiantes.length,
      activos: estudiantesActivos.length,
      inactivos: estudiantesInactivos.length,
      tasaActividad: calcularPorcentaje(estudiantesActivos.length, estudiantes.length),
      tasaAbandonoCambio: calcularPorcentaje(estudiantesInactivos.length, estudiantes.length)
    },
    detalleActivos: {
      estudiantes: estudiantesActivos.map(e => ({
        nombre: normalizarTexto(`${e.nombre} ${e.apellido}`),
        modalidad: e.modalidad || 'Sin modalidad',
        fechaInscripcion: e.fechaInscripcion || 'Sin fecha',
        plan: e.cursoPlan || e.planAnio || 'Sin plan',
        estadoInscripcion: e.estadoInscripcion || 'Sin estado'
      })),
      distribucionModalidad: Object.entries(modalidadesActivos).map(([modalidad, lista]) => ({
        modalidad: normalizarTexto(modalidad || 'Sin modalidad'),
        cantidad: lista.length,
        porcentaje: calcularPorcentaje(lista.length, estudiantesActivos.length)
      }))
    },
    detalleInactivos: {
      razon: 'Abandono o cambio de institución (activo = 0)',
      estudiantes: estudiantesInactivos.map(e => ({
        nombre: normalizarTexto(`${e.nombre} ${e.apellido}`),
        modalidad: e.modalidad || 'Sin modalidad',
        fechaInscripcion: e.fechaInscripcion || 'Sin fecha',
        plan: e.cursoPlan || e.planAnio || 'Sin plan',
        estadoInscripcion: e.estadoInscripcion || 'Sin estado'
      })),
      distribucionModalidad: Object.entries(modalidadesInactivos).map(([modalidad, lista]) => ({
        modalidad: normalizarTexto(modalidad || 'Sin modalidad'),
        cantidad: lista.length,
        porcentaje: calcularPorcentaje(lista.length, estudiantesInactivos.length)
      }))
    }
  };
};

// ===================================================================
// EXPLICACIONES Y CONTEXTO DE KPIs PARA USUARIOS
// ===================================================================
export const obtenerExplicacionesKPIs = () => {
  return {
    conceptosGenerales: {
      que_son_kpis: "KPIs (Indicadores Clave de Rendimiento) son métricas específicas que miden el rendimiento del proceso de inscripciones en la institución educativa",
      para_que_sirven: "Permiten evaluar la eficiencia del sistema de inscripciones, identificar problemas administrativos temprano y mejorar la experiencia de los estudiantes",
      como_interpretarlos: "Cada KPI de inscripciones tiene rangos que indican rendimiento: Excelente, Bueno, Regular, o Crítico"
    },
    
    metricas_principales: {
      tasa_retencion: {
        definicion: "Porcentaje de inscripciones de estudiantes que mantienen sus estudios activos",
        interpretacion: {
          excelente: "≥85% - Excelente retención de inscripciones estudiantiles",
          buena: "70-84% - Buena retención con oportunidades menores de mejora",
          regular: "50-69% - Retención de inscripciones requiere atención y mejoras estratégicas",
          critica: "<50% - Retención crítica de inscripciones, necesita intervención inmediata"
        },
        factores_influyen: ["Calidad educativa", "Apoyo estudiantil", "Situación económica", "Relevancia del programa"],
        acciones_mejora: ["Tutorías personalizadas", "Becas y apoyo financiero", "Actualización curricular", "Seguimiento temprano"]
      },
      
      tasa_finalizacion_administrativa: {
        definicion: "Porcentaje de inscripciones que completan exitosamente todo el proceso administrativo de inscripción",
        interpretacion: {
          excelente: "≥85% - Proceso de inscripciones muy eficiente y sin trabas burocráticas",
          buena: "70-84% - Proceso de inscripciones satisfactorio con oportunidades menores de mejora",
          regular: "50-69% - Proceso de inscripciones necesita revisión para eliminar barreras administrativas",
          critica: "<50% - Proceso de inscripciones problemático con múltiples obstáculos burocráticos"
        },
        factores_influyen: ["Claridad de requisitos", "Simplicidad de formularios", "Tiempo de respuesta", "Comunicación efectiva", "Disponibilidad de personal"],
        acciones_mejora: ["Digitalizar formularios", "Crear guías visuales paso a paso", "Implementar recordatorios automáticos", "Capacitar personal de atención", "Establecer ventanilla única"]
      },
      
      promedio_mensual: {
        definicion: "Número promedio de nuevas inscripciones procesadas por mes",
        utilidad: "Ayuda a planificar recursos humanos, espacios físicos y materiales para el proceso de inscripciones",
        como_usarlo: "Valores altos en ciertos meses indican necesidad de reforzar personal administrativo temporalmente"
      },
      
      tendencia_temporal: {
        definicion: "Dirección del crecimiento de nuevas inscripciones en el tiempo",
        valores_posibles: {
          creciente: "↗️ Más inscripciones en períodos recientes - Indicador positivo",
          estable: "→ Cantidad de inscripciones constantes - Situación controlada",
          decreciente: "↘️ Menos inscripciones recientemente - Requiere análisis de causas"
        },
        que_hacer: {
          creciente: "Preparar infraestructura para sostener el crecimiento de inscripciones",
          estable: "Mantener estrategias actuales de inscripción y buscar innovación",
          decreciente: "Revisar competencia, ajustar oferta educativa y estrategias de captación"
        }
      },
      
      completitud_documental: {
        definicion: "Porcentaje promedio de documentos completos por estudiante",
        importancia: "Documentación completa permite procesos administrativos ágiles y cumplimiento normativo",
        rangos: {
          excelente: "≥80% - Proceso documental muy eficiente",
          buena: "65-79% - Buen nivel con oportunidades menores",
          regular: "50-64% - Necesita mejoras en comunicación y seguimiento",
          critica: "<50% - Sistema documental problemático"
        }
      }
    },
    
    alertas_y_recomendaciones: {
      como_leer_alertas: {
        critica: "🔴 Requiere acción inmediata - puede afectar funcionamiento institucional",
        warning: "🟡 Situación que necesita atención - puede empeorar si no se aborda",
        success: "🟢 Indicador positivo - documentar y mantener estrategias exitosas",
        info: "ℹ️ Información contextual - ayuda a entender el panorama general"
      },
      
      como_usar_recomendaciones: {
        prioridad_alta: "Implementar en las próximas 2-4 semanas",
        prioridad_media: "Planificar para el próximo trimestre",
        prioridad_baja: "Considerar para el próximo ciclo académico"
      }
    },
    
    preguntas_frecuentes: {
      "¿Qué significa 'Tasa Finalización Administrativa 65%'?": "De cada 100 inscripciones que inician el proceso, 65 logran completar exitosamente todos los trámites administrativos. Un 35% queda con documentación pendiente o incompleta.",
      
      "¿Por qué es importante el 'Promedio Mensual de Inscripciones'?": "Te ayuda a saber cuántas inscripciones nuevas esperar cada mes, para planificar personal administrativo, espacios de clase y materiales necesarios.",
      
      "¿Qué hacer si la tendencia de inscripciones es 'decreciente'?": "Investigar causas: ¿cambió la competencia?, ¿hay problemas económicos locales?, ¿la oferta educativa sigue siendo relevante?. Luego ajustar estrategias de captación y marketing.",
      
      "¿Cuál es un buen porcentaje de retención de inscripciones?": "Para educación de adultos como CEIJA5, una retención de inscripciones del 70-80% es excelente, considerando las responsabilidades laborales y familiares de los estudiantes.",
      
      "¿Cómo mejorar la 'Calidad de Proceso de Inscripciones' de 'Buena' a 'Excelente'?": "La calidad se basa principalmente en retención de inscripciones. Mejora con: seguimiento personalizado, flexibilidad horaria, apoyo psicopedagógico y actualización constante de contenidos.",
      
      "¿Qué significa 'Eficiencia Administrativa de Inscripciones 78%'?": "Del total de inscripciones que ingresan al sistema administrativo, el 78% se procesa sin demoras ni trabas. El 22% experimenta demoras o problemas burocráticos."
    }
  };
};

// ===================================================================
// GENERADOR DE DESCRIPCIONES DETALLADAS PARA REPORTES PDF
// ===================================================================
export const generarDescripcionesParaPDF = (kpisCompletos) => {
  const { kpisBasicos, kpisAvanzados, recomendaciones, _alertas } = kpisCompletos;
  
  const descripciones = {
    resumenEjecutivo: {
      titulo: "RESUMEN EJECUTIVO DE INSCRIPCIONES",
      contenido: `
Este reporte analiza ${kpisBasicos.totalEstudiantes} inscripciones registradas en el sistema CEIJA5.
Los indicadores muestran una tasa de retención de inscripciones del ${kpisBasicos.tasaRetencion}% y una 
finalización administrativa de inscripciones del ${kpisAvanzados.eficienciaProceso.tasaFinalizacionAdministrativa}%.

El análisis temporal indica una tendencia ${kpisAvanzados.tendenciasTemporales.tendenciaGeneral} 
en las inscripciones, con un promedio de ${kpisAvanzados.tendenciasTemporales.promedioMensual} nuevas inscripciones mensuales.
      `.trim()
    },
    
    analisisRetencion: {
      titulo: "ANÁLISIS DE RETENCIÓN DE INSCRIPCIONES ESTUDIANTILES",
      descripcion: `
La retención de inscripciones estudiantiles es el indicador más importante para medir la calidad educativa. 
Actualmente ${kpisBasicos.estudiantesActivos} inscripciones mantienen estudios activos 
(${kpisBasicos.tasaRetencion}%) mientras que ${kpisBasicos.estudiantesInactivos} corresponden a estudiantes que han 
abandonado o pausado (${kpisBasicos.tasaAbandono}%).
      `.trim(),
      interpretacion: kpisBasicos.interpretaciones.tasaRetencion,
      accionesRecomendadas: [
        "Implementar sistema de alerta temprana para identificar inscripciones de estudiantes en riesgo",
        "Establecer tutorías personalizadas para apoyo académico a inscripciones activas",
        "Crear programas de apoyo socioeconómico para sostener inscripciones (becas, flexibilidad horaria)",
        "Realizar seguimiento telefónico mensual a inscripciones de estudiantes ausentes"
      ]
    },
    
    analisisAdministrativo: {
      titulo: "ANÁLISIS DE EFICIENCIA ADMINISTRATIVA DE INSCRIPCIONES",
      descripcion: `
El proceso administrativo de inscripciones presenta una tasa de finalización del ${kpisAvanzados.eficienciaProceso.tasaFinalizacionAdministrativa}%, 
lo que significa que de cada 100 inscripciones que inician el proceso, 
${kpisAvanzados.eficienciaProceso.tasaFinalizacionAdministrativa.toFixed(0)} completan exitosamente 
todos los trámites administrativos.

Actualmente hay ${kpisBasicos.tasaPendientes}% de inscripciones con trámites pendientes, 
indicando posibles trabas burocráticas en el proceso de inscripciones.
      `.trim(),
      interpretacion: kpisBasicos.interpretaciones.tasaPendientes,
      accionesRecomendadas: [
        "Digitalizar formularios de inscripción para reducir errores de completado",
        "Crear ventanilla única para centralizar todos los trámites de inscripción",
        "Implementar recordatorios automáticos por email/SMS para inscripciones pendientes",
        "Capacitar personal en atención al público y resolución de consultas sobre inscripciones",
        "Establecer plazos máximos para respuesta a consultas de inscripciones (24-48 horas)"
      ]
    },
    
    analisisTendencias: {
      titulo: "ANÁLISIS DE TENDENCIAS TEMPORALES DE INSCRIPCIONES",
      descripcion: `
El análisis temporal muestra una tendencia ${kpisAvanzados.tendenciasTemporales.tendenciaGeneral} 
en las nuevas inscripciones, con un promedio mensual de ${kpisAvanzados.tendenciasTemporales.promedioMensual} inscripciones.

El mes con mayor actividad de inscripciones fue ${kpisAvanzados.tendenciasTemporales.mesConMayorActividad}, 
lo que permite planificar mejor los recursos administrativos para períodos de alta demanda de inscripciones.
      `.trim(),
      interpretacion: kpisAvanzados.tendenciasTemporales.tendenciaGeneral === 'creciente' ? 
        'Tendencia positiva - la institución está atrayendo más inscripciones de estudiantes' :
        kpisAvanzados.tendenciasTemporales.tendenciaGeneral === 'decreciente' ?
        'Tendencia preocupante - requiere análisis de competencia y ajuste de estrategias de captación de inscripciones' :
        'Tendencia estable de inscripciones - mantener estrategias actuales y buscar oportunidades de crecimiento',
      accionesRecomendadas: kpisAvanzados.tendenciasTemporales.tendenciaGeneral === 'creciente' ? [
        "Preparar infraestructura administrativa para sostener el crecimiento de inscripciones",
        "Reforzar equipo administrativo en períodos de alta demanda de inscripciones",
        "Documentar estrategias exitosas de captación de inscripciones para replicarlas",
        "Planificar expansión de recursos para procesar más inscripciones"
      ] : kpisAvanzados.tendenciasTemporales.tendenciaGeneral === 'decreciente' ? [
        "Investigar causas de la disminución de inscripciones (competencia, factores económicos)",
        "Revisar y actualizar la propuesta educativa para atraer más inscripciones",
        "Implementar estrategias de marketing digital para generar más inscripciones",
        "Realizar encuestas para identificar barreras en el proceso de inscripciones"
      ] : [
        "Implementar estrategias de captación para generar crecimiento de inscripciones",
        "Diversificar oferta educativa para atraer nuevos segmentos de inscripciones",
        "Mejorar presencia digital y marketing para aumentar inscripciones",
        "Establecer alianzas para facilitar más inscripciones estudiantiles"
      ]
    },
    
    recomendacionesPrioritarias: {
      titulo: "RECOMENDACIONES PRIORITARIAS PARA INSCRIPCIONES",
      descripcion: "Basado en el análisis de datos de inscripciones, se identificaron las siguientes áreas de mejora ordenadas por prioridad de implementación:",
      recomendaciones: recomendaciones.map(rec => ({
        prioridad: rec.prioridad.toUpperCase(),
        area: rec.area,
        accion: rec.recomendacion,
        impacto: rec.impactoEstimado,
        inmediata: rec.accionInmediata
      }))
    }
  };

  return descripciones;
};