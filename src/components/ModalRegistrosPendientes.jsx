import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { obtenerRegistrosSinDocumentacion, obtenerDocumentosRequeridos } from '../utils/registroSinDocumentacion';
import registrosPendientesService from '../services/serviceRegistrosPendientes';
import { enriquecerRegistroProcesado } from '../services/serviceVerificarEstudiante';
import { useAlerts } from '../hooks/useAlerts';
import jsPDF from 'jspdf';
import { exportarExcel } from './ListaEstudiantes/reportes/utils';
import AlertaMens from './AlertaMens';
import HeaderModal from './registrosPendientes/HeaderModal';
import ListaRegistrosPendientes from './registrosPendientes/ListaRegistrosPendientes';
// Secciones removidas: no se usan en este componente directo
import ModalEditarRegistro from './registrosPendientes/ModalEditarRegistro';
import ModalFooter from './registrosPendientes/ModalFooter';

import '../estilos/modalM.css';
import '../estilos/botones.css';
import '../estilos/ModalRegistrosPendientes.css';

const ModalRegistrosPendientes = ({ onClose }) => {
    const { showSuccess, showError, showWarning, showInfo, alerts, removeAlert, modal, closeModal, clearAlerts } = useAlerts();
    // Eliminar estado local de alerta, usar solo sistema global
    const [registros, setRegistros] = useState([]);
    const [_mensajeEmail, setMensajeEmail] = useState('');
    const [enviandoEmail, setEnviandoEmail] = useState(false);
    const [_descargando, setDescargando] = useState(false);
    const [estadoDuplicados, setEstadoDuplicados] = useState(null);
    const [cargandoRegistros, setCargandoRegistros] = useState(false);
    const [_limpiandoDuplicados, setLimpiandoDuplicados] = useState(false);
    const [registroEditando, setRegistroEditando] = useState(null);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    // Estado eliminado: estudiantesRegistrados (no es necesario, usamos estudianteEnBD del registro enriquecido)

    // Funciones para gestión de duplicados adaptadas para datos actuales
    const verificarEstadoDuplicados = useCallback(async () => {
        try {
            setEstadoDuplicados(null);

            // Usar los registros actuales en lugar del localStorage
            const registrosActuales = registros || [];

            // Contar DNIs
            const dniMap = new Map();
            registrosActuales.forEach(registro => {
                const dni = registro.datos?.dni || registro.dni;
                if (dni) {
                    dniMap.set(dni, (dniMap.get(dni) || 0) + 1);
                }
            });

            // Encontrar duplicados
            const duplicados = Array.from(dniMap.entries())
                .filter(([, cantidad]) => cantidad > 1)
                .map(([dni, cantidad]) => ({
                    dni,
                    cantidad,
                    registros: registrosActuales.filter(r => (r.datos?.dni || r.dni) === dni).map(r => ({
                        nombre: r.datos?.nombre || r.nombre,
                        apellido: r.datos?.apellido || r.apellido,
                        fecha: new Date(r.timestamp).toLocaleString('es-AR'),
                        tipo: r.tipo || 'REGISTRO_PENDIENTE'
                    }))
                }));

            const resultado = {
                totalRegistros: registrosActuales.length,
                dnisUnicos: dniMap.size,
                cantidadDuplicados: duplicados.length,
                duplicados
            };

            console.log('📊 Estado de duplicados (registros actuales):', resultado);

            setEstadoDuplicados(resultado);

            // Solo mostrar alertas cuando se ejecuta manualmente, no automáticamente
            // if (resultado.cantidadDuplicados > 0) {
            //     showWarning(`⚠️ Encontrados ${resultado.cantidadDuplicados} DNI(s) duplicados`);
            // } else {
            //     showSuccess('✅ No se encontraron registros duplicados');
            // }

        } catch (error) {
            console.error('Error al verificar duplicados:', error);
            showError('❌ Error al verificar duplicados');
        }
    }, [registros, showError]);

    // Función para verificación manual con alertas
    const verificarEstadoDuplicadosManual = async () => {
        await verificarEstadoDuplicados();

        if (estadoDuplicados) {
            if (estadoDuplicados.cantidadDuplicados > 0) {
                showWarning(`⚠️ Encontrados ${estadoDuplicados.cantidadDuplicados} DNI(s) duplicados`);
            } else {
                showSuccess('✅ No se encontraron registros duplicados');
            }
        }
    };

    // Función para recargar registros
    const recargarRegistros = async (esRecargaManual = false) => {
        try {
            console.log('🔄 Recargando registros pendientes desde servidor...');
            setMensajeEmail('Actualizando lista de registros...');

            const registrosActualizados = await registrosPendientesService.obtenerRegistrosPendientes();
            console.log('📋 Registros actualizados:', registrosActualizados);

            // Enriquecer registros procesados con documentación de BD
            console.log('🔍 Enriqueciendo registros procesados con documentación de BD...');
            const registrosEnriquecidos = await Promise.all(
                registrosActualizados.map(registro => enriquecerRegistroProcesado(registro))
            );

            const registrosAnteriores = registros.length;
            const registrosNuevos = registrosEnriquecidos.length;

            setRegistros(registrosEnriquecidos);

            if (registrosNuevos < registrosAnteriores) {
                const diferencia = registrosAnteriores - registrosNuevos;
                setMensajeEmail(`✅ Lista actualizada - ${diferencia} registro${diferencia > 1 ? 's' : ''} procesado${diferencia > 1 ? 's' : ''}`);
            } else if (registrosNuevos === registrosAnteriores) {
                setMensajeEmail('✅ Lista actualizada - sin cambios');
                if (esRecargaManual) {
                    showInfo('ℹ️ La lista de registros está actualizada, no hay cambios nuevos');
                }
            } else {
                setMensajeEmail('✅ Lista actualizada - nuevos registros pendientes');
                if (esRecargaManual) {
                    showWarning(`⚠️ Se encontraron ${registrosNuevos - registrosAnteriores} nuevos registros pendientes`);
                }
            }

            setTimeout(() => setMensajeEmail(''), 3000);

        } catch (error) {
            console.error('❌ Error al recargar registros:', error);
            setMensajeEmail(`❌ Error al actualizar: ${error.message}`);
            setTimeout(() => setMensajeEmail(''), 5000);
        }
    };

    // Función auxiliar para verificar y limpiar registros completados
    const verificarYLimpiarRegistrosCompletados = async () => {
        try {
            const registrosActuales = obtenerRegistrosSinDocumentacion();
            const idsActuales = new Set(registrosActuales.map(r => r.id));

            setRegistros(prevRegistros => {
                const registrosFiltrados = prevRegistros.filter(r => idsActuales.has(r.id));

                if (registrosFiltrados.length !== prevRegistros.length) {
                    const eliminados = prevRegistros.length - registrosFiltrados.length;
                    console.log(`🧹 Limpiados ${eliminados} registro(s) completado(s) de la lista local`);
                }

                return registrosFiltrados;
            });

        } catch (error) {
            console.error('Error al verificar registros completados:', error);
        }
    };

    // Funciones eliminadas: verificarEstudianteRegistrado y verificarTodosLosEstudiantes
    // Ya no son necesarias porque usamos el enriquecimiento con estudianteEnBD directamente

    // Cargar registros desde el archivo JSON del backend
    useEffect(() => {
        const cargarRegistrosPendientes = async () => {
            try {
                setCargandoRegistros(true);
                console.log('🔄 Cargando registros pendientes desde archivo JSON...');

                const registrosBackend = await registrosPendientesService.obtenerRegistrosPendientes();
                console.log('📋 Registros desde backend:', registrosBackend);

                // Enriquecer registros procesados con documentación de BD
                console.log('🔍 Enriqueciendo registros procesados con documentación de BD...');
                const registrosEnriquecidos = await Promise.all(
                    registrosBackend.map(registro => enriquecerRegistroProcesado(registro))
                );
                console.log('✅ Registros enriquecidos:', registrosEnriquecidos.filter(r => r.estudianteEnBD).length, 'con datos de BD');

                setRegistros(registrosEnriquecidos);

                if (registrosEnriquecidos.length === 0) {
                    setMensajeEmail('ℹ️ No hay registros pendientes en este momento. ¡Excelente trabajo!');
                } else {
                    setMensajeEmail(`📋 Cargados ${registrosEnriquecidos.length} registro(s) pendiente(s) de documentación`);
                }
                setTimeout(() => setMensajeEmail(''), 3000);

            } catch (error) {
                console.error('❌ Error al cargar registros:', error);
                setMensajeEmail(`❌ Error al cargar registros: ${error.message}`);
                setRegistros([]);
                setMensajeEmail('⚠️ No se pudieron cargar registros');
                setTimeout(() => setMensajeEmail(''), 3000);
            } finally {
                setCargandoRegistros(false);
            }
        };

        cargarRegistrosPendientes();

        const intervalo = setInterval(() => {
            verificarYLimpiarRegistrosCompletados();
        }, 30000);

        return () => clearInterval(intervalo);
    }, []); // useEffect solo se ejecuta al montar el componente

    // Función para obtener información del vencimiento
    const obtenerInfoVencimiento = (registro) => {
        // Si el registro tiene información de vencimiento del backend, usarla
        if (registro.vencimiento) {
            const info = registro.vencimiento;
            return {
                vencido: info.tipoNotificacion === 'vencido',
                diasRestantes: info.diasRestantes || 0,
                mensaje: info.mensaje || 'Sin información',
                color: 'var(--color-btn-main)',
                fechaVencimiento: info.fechaVencimiento || 'No disponible',
                puedeReiniciarAlarma: info.puedeReiniciarAlarma || false
            };
        }

        // Fallback: lógica original para registros sin información de vencimiento del backend
        const ahora = new Date();
        const fechaRegistro = new Date(registro.timestamp);
        const vencimiento = new Date(fechaRegistro.getTime() + (7 * 24 * 60 * 60 * 1000));
        const msRestantes = vencimiento.getTime() - ahora.getTime();

        if (msRestantes <= 0) {
            return {
                vencido: true,
                diasRestantes: 0,
                mensaje: 'VENCIDO',
                color: 'var(--color-btn-main)',
                fechaVencimiento: vencimiento.toLocaleString(),
                puedeReiniciarAlarma: true
            };
        }

        const diasRestantes = Math.ceil(msRestantes / (1000 * 60 * 60 * 24));
        const horasRestantes = Math.ceil(msRestantes / (1000 * 60 * 60));

        let mensaje, color;
        if (diasRestantes > 3) {
            mensaje = `${diasRestantes} días restantes`;
            color = 'var(--color-btn-main)';
        } else if (diasRestantes > 1) {
            mensaje = `${diasRestantes} días restantes`;
            color = 'var(--color-btn-main)';
        } else if (diasRestantes === 1) {
            mensaje = `1 día restante`;
            color = 'var(--color-btn-main)';
        } else {
            mensaje = `${horasRestantes}h restantes`;
            color = 'var(--color-btn-main)';
        }

        return {
            vencido: false,
            diasRestantes,
            mensaje,
            color,
            fechaVencimiento: vencimiento.toLocaleString(),
            puedeReiniciarAlarma: diasRestantes <= 3
        };
    };

    // Función para obtener icono de tipo de registro
    const getTipoIcon = (tipo) => {
        switch (tipo) {
            case 'SIN_DOCUMENTACION': return '📋';
            case 'DOCUMENTACION_INCOMPLETA': return '📄';
            default: return '📝';
        }
    };

    // Función para formatear tipo de registro
    const formatearTipo = (tipo) => {
        switch (tipo) {
            case 'SIN_DOCUMENTACION': return 'Sin Documentación';
            case 'DOCUMENTACION_INCOMPLETA': return 'Documentación Incompleta';
            default: return tipo;
        }
    };

    // Función para abrir modal de edición/completar registro
    const completarRegistro = (registro) => {
        console.log('📝 Abriendo modal de edición para:', registro.datos?.dni || registro.dni);
        setRegistroEditando(registro);
        setMostrarModalEdicion(true);
    };

    // Función para cerrar modal de edición
    const cerrarModalEdicion = () => {
        // Limpiar alertas al cerrar el modal
        clearAlerts();
        setMostrarModalEdicion(false);
        setRegistroEditando(null);
    };

    // Función para manejar guardado desde el modal
    // resultado incluye información detallada del backend sobre la operación
    const handleRegistroGuardado = async (registro, tipoOperacion, resultado = null) => {
        console.log(`✅ Registro ${tipoOperacion}:`, registro?.dni, 'resultado:', resultado);

        try {
            if (tipoOperacion === 'completado') {
                const nombreCompleto = `${registro.datos?.nombre || registro.nombre} ${registro.datos?.apellido || registro.apellido}`.trim();

                // Si fue actualización de un registro existente
                if (resultado?.yaExistia) {
                    // Mostrar más detalles del resultado de la actualización
                    if (resultado.mensaje) {
                        showSuccess(resultado.mensaje);
                    } else {
                        showSuccess(`📝 ${nombreCompleto} - Documentación actualizada exitosamente.`);
                    }
                } else {
                    // Si fue inserción de nuevo registro
                    showSuccess(`🎉 ${nombreCompleto} - Estudiante registrado exitosamente.`);
                }

                // Eliminar automáticamente de la lista local
                setRegistros(prevRegistros => prevRegistros.filter(r => r.dni !== registro.dni));

                // Refrescar listas desde el servidor
                await recargarRegistros(false);

                // Mostrar información adicional sobre el resultado si está disponible
                if (resultado && (resultado.insertId || resultado.insertId === 0)) {
                    const infoAdicional = [];
                    infoAdicional.push(`ID: ${resultado.insertId}`);

                    if (resultado.archivos) {
                        infoAdicional.push(`Archivos migrados: ${Object.keys(resultado.archivos).length}`);
                    }

                    if (resultado.modulosAsignados) {
                        infoAdicional.push(`Módulos: ${resultado.modulosAsignados.join(', ')}`);
                    }

                    showInfo(`ℹ️ Detalles: ${infoAdicional.join(' | ')}`);
                }

            } else if (tipoOperacion === 'ya_procesado') {
                const nombreCompleto = `${registro.datos?.nombre || registro.nombre} ${registro.datos?.apellido || registro.apellido}`.trim();

                // Mostrar mensaje detallado sobre el registro existente
                if (resultado?.mensaje) {
                    showWarning(resultado.mensaje);
                } else {
                    showWarning(`⚠️ ${nombreCompleto} ya está registrado en el sistema.`);
                }

                // Información adicional sobre el registro existente
                if (resultado?.detalles) {
                    showInfo(resultado.detalles);
                }

                // Eliminar de la lista local y sincronizar
                setRegistros(prevRegistros => prevRegistros.filter(r => r.dni !== registro.dni));
                await recargarRegistros(false);

            } else if (tipoOperacion === 'actualizado') {
                // Recargar lista después de una actualización
                await recargarRegistros(false);

                if (resultado?.mensaje) {
                    showSuccess(resultado.mensaje);
                } else {
                    showSuccess('✅ Registro actualizado exitosamente');
                }
            }
        } catch (error) {
            console.error('Error en handleRegistroGuardado:', error);
            showError(`❌ Error al procesar el registro: ${error.message}`);
        } finally {
            // Cerrar modal con delay para mostrar mensajes
            setTimeout(() => {
                cerrarModalEdicion();
            }, 500);
        }
    };

    // Función para manejar eliminación desde el modal
    const handleRegistroEliminado = (registro) => {
        console.log(`🗑️ Registro eliminado:`, registro.dni);
        // Eliminar de la lista local
        setRegistros(prevRegistros =>
            prevRegistros.filter(r => r.dni !== registro.dni)
        );
        cerrarModalEdicion();
    };
    // Función para eliminar un registro del listado de pendientes
    const procesarEliminacion = async (registro) => {
        // Construir nombre y apellido completo robusto
        const nombreCompleto = `${registro.datos?.nombre || registro.nombre || ''} ${registro.datos?.apellido || registro.apellido || ''}`.trim();
        try {
            showInfo(`🗑️ Eliminando ${nombreCompleto || 'registro'} del listado de pendientes...`);
            await registrosPendientesService.eliminarRegistroPendiente(registro.dni);
            console.log('✅ Registro eliminado del archivo de pendientes exitosamente');
            setRegistros(prevRegistros =>
                prevRegistros.filter(r => (r.datos?.dni || r.dni) !== registro.dni)
            );
            showSuccess(`✅ ${nombreCompleto || 'Registro'} eliminado del listado de pendientes`);
            setMensajeEmail('');
        } catch (error) {
            console.error('Error al eliminar registro:', error);
            showError(`❌ Error al eliminar: ${error.message}`);
        }
    };

    // Función para reiniciar alarma de vencimiento
    const reiniciarAlarma = async (registro, diasExtension = 7, motivo = 'Extensión solicitada') => {
        const nombreCompleto = `${registro.datos?.nombre || registro.nombre || ''} ${registro.datos?.apellido || registro.apellido || ''}`.trim();
        try {
            showInfo(`⏰ Reiniciando alarma para ${nombreCompleto || 'registro'}...`);
            const resultado = await registrosPendientesService.reiniciarAlarma(registro.dni, diasExtension, motivo);

            // El backend devuelve un objeto con 'mensaje' si es exitoso
            if (resultado && resultado.mensaje === 'Alarma reiniciada exitosamente') {
                // Marcar localmente y persistir autorización de extensión y estado de alarma
                const fechaReinicioISO = new Date().toISOString();
                try {
                    await registrosPendientesService.actualizarRegistroPendiente(registro.dni, {
                        alarmaReiniciada: true,
                        autorizacionExtension: true,
                        fechaReinicio: fechaReinicioISO,
                        motivoExtension: motivo,
                        diasExtension: diasExtension,
                        // añadir historial de extensiones si backend lo soporta
                    });
                } catch (errUpdate) {
                    console.warn('⚠️ No se pudo persistir campos de extensión, se mantendrán localmente:', errUpdate.message);
                }

                // Actualizar estado local inmediato para reflejar cambios en UI
                setRegistros(prev => prev.map(r => {
                    const dniR = r.datos?.dni || r.dni;
                    if (dniR === (registro.datos?.dni || registro.dni)) {
                        const nuevo = Object.assign({}, r, {
                            alarmaReiniciada: true,
                            autorizacionExtension: true,
                            fechaReinicio: fechaReinicioISO,
                            motivoExtension: motivo,
                            diasExtension: diasExtension,
                            historialExtensiones: Array.isArray(r.historialExtensiones) ? [...r.historialExtensiones, { fecha: fechaReinicioISO, dias: diasExtension, motivo, usuario: 'admin' }] : [{ fecha: fechaReinicioISO, dias: diasExtension, motivo, usuario: 'admin' }]
                        });
                        return nuevo;
                    }
                    return r;
                }));

                // Recargar registros para sincronizar con backend
                await recargarRegistros(false);
                showSuccess(`✅ Alarma reiniciada: ${nombreCompleto} tiene ${diasExtension} días adicionales`);
            } else {
                showError(`❌ Error al reiniciar alarma: ${resultado?.mensaje || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error al reiniciar alarma:', error);
            // Si es un error de HTTP (4xx, 5xx), extraer el mensaje del response
            if (error.response && error.response.data && error.response.data.mensaje) {
                showError(`❌ Error al reiniciar alarma: ${error.response.data.mensaje}`);
            } else {
                showError(`❌ Error al reiniciar alarma: ${error.message || 'Error desconocido'}`);
            }
        }
    };

    // Función para enviar email individual
    const enviarEmailIndividual = async (registro) => {
        const nombreCompleto = `${registro.datos?.nombre || registro.nombre} ${registro.datos?.apellido || registro.apellido}`;
        const email = registro.datos?.email || registro.email;

        if (!email || !email.includes('@')) {
            setMensajeEmail(`❌ ${nombreCompleto} no tiene email válido registrado`);
            showWarning(`⚠️ ${nombreCompleto} no tiene email válido registrado. Verifique la información de contacto.`);
            setTimeout(() => setMensajeEmail(''), 5000);
            return;
        }

        try {
            setEnviandoEmail(true);
            setMensajeEmail(`📧 Enviando notificación a ${nombreCompleto}...`);

            // Si el registro tiene alarma reiniciada/autorización, agregar nota para el email
            const opcionesEnvio = {};
            if (registro.alarmaReiniciada || registro.autorizacionExtension) {
                opcionesEnvio.extensionExcepcion = true;
                opcionesEnvio.nota = 'Extensión por excepción de gestión directiva';
            }

            const resultado = await registrosPendientesService.enviarNotificacion(registro.dni, opcionesEnvio);

            if (resultado && resultado.success) {
                setMensajeEmail(`✅ Email enviado exitosamente a ${nombreCompleto} (${email})`);
                setTimeout(() => setMensajeEmail(''), 3000);
            } else {
                setMensajeEmail(`❌ Error: ${resultado?.message || 'Error desconocido'}`);
                setTimeout(() => setMensajeEmail(''), 5000);
            }

        } catch (error) {
            console.error('Error al enviar email:', error);
            setMensajeEmail(`❌ Error al enviar email a ${nombreCompleto}: ${error.message}`);
            setTimeout(() => setMensajeEmail(''), 5000);
        } finally {
            setEnviandoEmail(false);
        }
    };

    // Funciones para emails masivos
    const enviarEmailsMasivos = async () => {
        setEnviandoEmail(true);
        try {
            setMensajeEmail('📧 Enviando notificaciones masivas a todos los estudiantes...');

            const response = await fetch('http://localhost:5000/api/notificaciones/enviar-masivo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resultado = await response.json();

            if (resultado.success) {
                setMensajeEmail(`✅ Emails masivos completados: ${resultado.enviados} enviados${resultado.fallidos > 0 ? `, ${resultado.fallidos} fallidos` : ''}`);
                setTimeout(() => setMensajeEmail(''), 4000);
            } else {
                setMensajeEmail(`❌ Error en envío masivo: ${resultado.message}`);
                setTimeout(() => setMensajeEmail(''), 5000);
            }

        } catch (error) {
            console.error('Error al enviar emails masivos:', error);
            setMensajeEmail(`❌ Error al enviar emails masivos: ${error.message}`);
            setTimeout(() => setMensajeEmail(''), 5000);
        } finally {
            setEnviandoEmail(false);
        }
    };

    const enviarEmailsUrgentes = async () => {
        setEnviandoEmail(true);
        try {
            setMensajeEmail('⚡ Enviando notificaciones urgentes (≤3 días)...');

            const response = await fetch('http://localhost:5000/api/notificaciones/enviar-urgentes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ diasUmbral: 3 })
            });

            const resultado = await response.json();

            if (resultado.success) {
                setMensajeEmail(`⚡ Emails urgentes completados: ${resultado.enviados} enviados${resultado.fallidos > 0 ? `, ${resultado.fallidos} fallidos` : ''}`);
                setTimeout(() => setMensajeEmail(''), 4000);
            } else {
                setMensajeEmail(`❌ Error en envío urgente: ${resultado.message}`);
                setTimeout(() => setMensajeEmail(''), 5000);
            }

        } catch (error) {
            console.error('Error al enviar emails urgentes:', error);
            setMensajeEmail(`❌ Error al enviar emails urgentes: ${error.message}`);
            setTimeout(() => setMensajeEmail(''), 5000);
        } finally {
            setEnviandoEmail(false);
        }
    };

    const limpiarDuplicadosManual = async () => {
        try {
            setLimpiandoDuplicados(true);
            showWarning('🧹 Analizando duplicados en registros actuales...');

            // Trabajar con registros actuales
            if (!estadoDuplicados || estadoDuplicados.cantidadDuplicados === 0) {
                showInfo('ℹ️ No hay duplicados para limpiar');
                return;
            }

            // Para registros pendientes, no eliminamos automáticamente
            // Solo informamos al administrador
            const mensaje = `⚠️ Se encontraron ${estadoDuplicados.cantidadDuplicados} DNI(s) duplicados. `;
            const detalles = estadoDuplicados.duplicados.map(dup =>
                `DNI ${dup.dni}: ${dup.cantidad} registros`
            ).join(', ');

            showWarning(`${mensaje} Detalles: ${detalles}. Revise manualmente.`);

        } catch (error) {
            console.error('Error al analizar duplicados:', error);
            showError('❌ Error al analizar duplicados');
        } finally {
            setLimpiandoDuplicados(false);
        }
    };

    const probarSistema7Dias = async () => {
        try {
            showInfo('🧪 Analizando sistema de vencimiento en registros actuales...');

            const registrosActuales = registros || [];
            const ahora = new Date();

            console.log('🧪 === ANÁLISIS SISTEMA VENCIMIENTOS ===');
            console.log(`📅 Fecha actual: ${ahora.toLocaleString('es-AR')}`);
            console.log(`📋 Total registros: ${registrosActuales.length}`);

            if (registrosActuales.length === 0) {
                showInfo('ℹ️ No hay registros para analizar');
                return;
            }

            const detalles = registrosActuales.map((registro, index) => {
                const fechaCreacion = new Date(registro.timestamp);
                const info = obtenerInfoVencimiento(registro);

                const detalle = {
                    indice: index + 1,
                    dni: registro.datos?.dni || registro.dni,
                    nombre: `${registro.datos?.nombre || registro.nombre} ${registro.datos?.apellido || registro.apellido}`,
                    fechaCreacion: fechaCreacion.toLocaleString('es-AR'),
                    estado: info.vencido ? '❌ VENCIDO' : '✅ VIGENTE',
                    mensaje: info.mensaje,
                    diasRestantes: info.diasRestantes,
                    color: info.color
                };

                console.log(`${detalle.indice}. ${detalle.nombre} (DNI: ${detalle.dni}):`);
                console.log(`   📅 Creado: ${detalle.fechaCreacion}`);
                console.log(`   📊 Estado: ${detalle.estado}`);
                console.log(`   💬 Mensaje: ${detalle.mensaje}`);
                console.log(`   ⏳ Días restantes: ${detalle.diasRestantes}`);
                console.log('   ---');

                return detalle;
            });

            const vigentes = detalles.filter(d => !d.estado.includes('VENCIDO')).length;
            const vencidos = detalles.filter(d => d.estado.includes('VENCIDO')).length;

            console.log('📊 === RESUMEN ===');
            console.log(`✅ Registros vigentes: ${vigentes}`);
            console.log(`❌ Registros vencidos: ${vencidos}`);

            showSuccess(`🧪 Análisis completado: ${vigentes} vigentes, ${vencidos} vencidos de ${registrosActuales.length} totales`);

        } catch (error) {
            console.error('Error en análisis de vencimientos:', error);
            showError('❌ Error en análisis de vencimientos');
        }
    };

    // Mapeo de documentos para reportes
    const mapeoDocumentos = {
        'cuil': 'CUIL',
        'dni': 'DNI',
        'fichaMedica': 'Ficha Médica',
        'certificadoNivelPrimario': 'Certificado Nivel Primario',
        'partidaNacimiento': 'Partida de Nacimiento',
        'foto': 'Foto',
        'certificadoNivelSecundario': 'Certificado Nivel Secundario',
        'constanciaAlumnoRegular': 'Constancia Alumno Regular'
    };

    // Función utilitaria para obtener estado de documentación
    const obtenerEstadoDocumentacion = (registro) => {
        // Si el registro tiene documentación de BD (fue procesado), usar esa
        if (registro.estudianteEnBD && registro.documentacionBD && registro.documentacionBD.length > 0) {
            console.log('📊 Usando documentación de BD para registro procesado:', registro.dni);

            const documentosEntregados = registro.documentacionBD.filter(
                doc => doc.estadoDocumentacion === 'Entregado'
            );

            const documentosFaltantes = registro.documentacionBD.filter(
                doc => doc.estadoDocumentacion === 'Faltante'
            );

            return {
                subidos: documentosEntregados.map(doc =>
                    mapeoDocumentos[doc.descripcionDocumentacion] || doc.descripcionDocumentacion
                ),
                faltantes: documentosFaltantes.map(doc =>
                    mapeoDocumentos[doc.descripcionDocumentacion] || doc.descripcionDocumentacion
                ),
                totalSubidos: documentosEntregados.length,
                totalRequeridos: registro.documentacionBD.length,
                porcentajeCompletado: Math.round((documentosEntregados.length / registro.documentacionBD.length) * 100),
                desdeBD: true
            };
        }

        // Lógica original para registros pendientes normales
        const modalidad = registro.datos?.modalidad || registro.modalidad || '';
        const planAnio = registro.datos?.planAnio || registro.planAnio || '';

        // Extraer modulos del campo directo o del array idModulo
        let modulos = registro.datos?.modulos || registro.modulos || '';

        // Si modulos está vacío, intentar extraerlo del array idModulo
        if ((!modulos || modulos === '') && registro.datos?.idModulo && Array.isArray(registro.datos.idModulo)) {
            const moduloValido = registro.datos.idModulo.find(id => id && id !== '' && id !== null);
            if (moduloValido) {
                modulos = moduloValido;
                console.log('🔄 [MODAL] Módulo extraído del array idModulo:', moduloValido, 'de array:', registro.datos.idModulo);
            }
        }

        console.log('[DEBUG] Llamando a obtenerDocumentosRequeridos desde ModalRegistrosPendientes.jsx con:', {
            modalidad, planAnio, modulos,
            idModulo: registro.datos?.idModulo,
            dni: registro.dni
        });
        const requerimientos = obtenerDocumentosRequeridos(modalidad, planAnio, modulos);
        const documentosRequeridosDinamicos = requerimientos.documentos || [];
        const documentosAlternativos = requerimientos.alternativos;

        let documentosSubidos = [];

        if (Array.isArray(registro.documentosSubidos)) {
            documentosSubidos = registro.documentosSubidos;
        } else if (registro.archivos && typeof registro.archivos === 'object') {
            documentosSubidos = Object.keys(registro.archivos).filter(key =>
                registro.archivos[key] && registro.archivos[key] !== null && registro.archivos[key] !== ''
            );
        }

        let documentosFaltantes = [];
        let documentosValidosSubidos = [];
        let documentoUsado = null;

        if (documentosAlternativos) {
            const tienePreferido = documentosSubidos.includes(documentosAlternativos.preferido);
            const tieneAlternativa = documentosSubidos.includes(documentosAlternativos.alternativa);

            if (tienePreferido) {
                documentoUsado = `${mapeoDocumentos[documentosAlternativos.preferido]} (Preferido)`;
                documentosValidosSubidos = documentosSubidos;
                documentosFaltantes = documentosRequeridosDinamicos.filter(doc =>
                    doc !== documentosAlternativos.preferido &&
                    doc !== documentosAlternativos.alternativa &&
                    !documentosSubidos.includes(doc)
                );
            } else if (tieneAlternativa) {
                documentoUsado = `${mapeoDocumentos[documentosAlternativos.alternativa]} (Alternativo)`;
                documentosValidosSubidos = documentosSubidos;
                documentosFaltantes = documentosRequeridosDinamicos.filter(doc =>
                    doc !== documentosAlternativos.preferido &&
                    doc !== documentosAlternativos.alternativa &&
                    !documentosSubidos.includes(doc)
                );
            } else {
                documentosValidosSubidos = documentosSubidos.filter(doc =>
                    doc !== documentosAlternativos.preferido &&
                    doc !== documentosAlternativos.alternativa
                );
                documentosFaltantes = documentosRequeridosDinamicos.filter(doc => !documentosSubidos.includes(doc));
            }
        } else {
            documentosValidosSubidos = documentosSubidos.filter(doc => documentosRequeridosDinamicos.includes(doc));
            documentosFaltantes = documentosRequeridosDinamicos.filter(doc => !documentosSubidos.includes(doc));
        }

        const totalRequeridos = documentosRequeridosDinamicos.length - (documentosAlternativos ? 1 : 0);

        return {
            subidos: documentosValidosSubidos.map(doc => mapeoDocumentos[doc] || doc),
            faltantes: documentosFaltantes.map(doc => mapeoDocumentos[doc] || doc),
            totalSubidos: documentosValidosSubidos.length,
            totalRequeridos: totalRequeridos,
            documentoUsado: documentoUsado,
            porcentajeCompletado: Math.round((documentosValidosSubidos.length / totalRequeridos) * 100),
            desdeBD: false
        };
    };

    // Funciones para descargas
    // Reportes: TXT, PDF, CSV
    const generarReporteAdministrativo = () => {
        try {
            setDescargando(true);
            // Encabezado institucional
            let contenido = `CEIJA5 LA CALERA CBA\n`;
            contenido += `Educacion Integral de Jóvenes y Adultos\n`;
            contenido += `REPORTE ADMINISTRATIVO - REGISTROS PENDIENTES DE DOCUMENTACIÓN\n`;
            contenido += `Fecha de generación: ${new Date().toLocaleString('es-AR')}\n`;
            contenido += `Total de registros: ${registros.length}\n`;
            contenido += `${'='.repeat(80)}\n\n`;

            registros.forEach((registro, index) => {
                const info = obtenerInfoVencimiento(registro);
                const estadoDoc = obtenerEstadoDocumentacion(registro);

                contenido += `${index + 1}. ${registro.datos?.nombre || registro.nombre} ${registro.datos?.apellido || registro.apellido}\n`;
                contenido += `   DNI: ${registro.datos?.dni || registro.dni}\n`;
                contenido += `   Email: ${registro.datos?.email || registro.email || 'Sin email'}\n`;
                contenido += `   Modalidad: ${registro.datos?.modalidad || registro.modalidad}\n`;
                contenido += `   Estado: ${info.vencido ? 'VENCIDO' : info.mensaje}\n`;
                contenido += `   Registrado: ${new Date(registro.timestamp).toLocaleString('es-AR')}\n`;

                // Información de documentación
                contenido += `   \n   📊 DOCUMENTACIÓN:\n`;
                contenido += `   Completado: ${estadoDoc.totalSubidos}/${estadoDoc.totalRequeridos} (${estadoDoc.porcentajeCompletado}%)\n`;

                if (estadoDoc.subidos.length > 0) {
                    contenido += `   ✅ Documentos presentados:\n`;
                    estadoDoc.subidos.forEach(doc => {
                        contenido += `      • ${doc}\n`;
                    });
                }

                if (estadoDoc.faltantes.length > 0) {
                    contenido += `   ❌ Documentos faltantes:\n`;
                    estadoDoc.faltantes.forEach(doc => {
                        contenido += `      • ${doc}\n`;
                    });
                } else {
                    contenido += `   ✅ Documentación completa\n`;
                }

                if (estadoDoc.documentoUsado) {
                    contenido += `   📝 ${estadoDoc.documentoUsado}\n`;
                }

                contenido += `\n${'─'.repeat(60)}\n\n`;
            });

            const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte-registros-pendientes-${new Date().toISOString().split('T')[0]}.txt`;
            link.click();
            URL.revokeObjectURL(url);

            showSuccess('📊 Reporte administrativo descargado');
        } catch (error) {
            showError(`Error al generar reporte: ${error.message}`);
        } finally {
            setDescargando(false);
        }
    };

    const generarReportePDF = () => {
        try {
            setDescargando(true);

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const margin = 20;
            let yPosition = 20;
            // Encabezado institucional azul oscuro y negrita
            doc.setTextColor(45, 65, 119);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('CEIJA5 LA CALERA CBA', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 5;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('Educacion Integral de Jóvenes y Adultos', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 2;
            // Blue separator line
            doc.setDrawColor(0, 0, 255);
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
            yPosition += 4;
            yPosition += 8;
            doc.setTextColor(45, 65, 119);
            // Encabezado de reporte
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(45, 65, 119);
            doc.text('REPORTE DE REGISTROS PENDIENTES', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(`Fecha: ${new Date().toLocaleString('es-AR')}`, pageWidth / 2, yPosition, { align: 'center' });
            doc.text(`Total: ${registros.length} registros`, pageWidth / 2, yPosition + 5, { align: 'center' });
            yPosition += 20;

            // Pie de página y paginación
            let pageNum = 1;
            const addFooter = (pageNum) => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                const footerText = `Reporte CEIJA5 Educativa`;
                const pageText = `Página ${pageNum}`;
                const yFooter = doc.internal.pageSize.height - 10;
                doc.text(footerText, margin, yFooter, { align: 'left' });
                doc.text(pageText, pageWidth - margin, yFooter, { align: 'right' });
            };

            registros.forEach((registro, index) => {
                if (yPosition > 200) {
                    addFooter(pageNum);
                    doc.addPage();
                    pageNum++;
                    yPosition = 20;
                    // Repetir encabezado en cada página (azul y negrita)
                    doc.setTextColor(45, 65, 119);
                    doc.setFontSize(14);
                    doc.setFont('helvetica', 'bold');
                    doc.text('CEIJA5 LA CALERA CBA', pageWidth / 2, yPosition, { align: 'center' });
                    yPosition += 5;
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Educacion Integral de Jóvenes y Adultos', pageWidth / 2, yPosition, { align: 'center' });
                    yPosition += 2;
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    // Blue separator line
                    doc.setDrawColor(0, 0, 255);
                    doc.setLineWidth(0.5);
                    doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
                    yPosition += 4;
                    yPosition += 8;
                    doc.setTextColor(45, 65, 119);
                    doc.text('REPORTE DE REGISTROS PENDIENTES', pageWidth / 2, yPosition, { align: 'center' });
                    yPosition += 10;
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(0, 0, 0);
                    doc.text(`Fecha: ${new Date().toLocaleString('es-AR')}`, pageWidth / 2, yPosition, { align: 'center' });
                    doc.text(`Total: ${registros.length} registros`, pageWidth / 2, yPosition + 5, { align: 'center' });
                    yPosition += 20;
                }
                const info = obtenerInfoVencimiento(registro);
                const estadoDoc = obtenerEstadoDocumentacion(registro);
                const nombre = `${registro.datos?.nombre || registro.nombre} ${registro.datos?.apellido || registro.apellido}`;
                // Número y nombre
                doc.setFont('helvetica', 'bold');
                doc.text(`${index + 1}. ${nombre}`, margin, yPosition);
                yPosition += 7;
                // Información básica
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.text(`DNI: ${registro.datos?.dni || registro.dni}`, margin + 5, yPosition);
                doc.text(`Email: ${registro.datos?.email || registro.email || 'Sin email'}`, margin + 5, yPosition + 3);
                doc.text(`Modalidad: ${registro.datos?.modalidad || registro.modalidad}`, margin + 5, yPosition + 6);
                doc.text(`Estado: ${info.vencido ? 'VENCIDO' : info.mensaje}`, margin + 5, yPosition + 9);
                doc.text(`Fecha: ${new Date(registro.timestamp).toLocaleDateString('es-AR')}`, margin + 5, yPosition + 12);
                yPosition += 18;
                // Información de documentación
                doc.setFont('helvetica', 'bold');
                doc.text(`Documentación: ${estadoDoc.totalSubidos}/${estadoDoc.totalRequeridos} (${estadoDoc.porcentajeCompletado}%)`, margin + 5, yPosition);
                yPosition += 4;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7);
                if (estadoDoc.subidos.length > 0) {
                    doc.text('Presentados: ' + estadoDoc.subidos.join(', '), margin + 5, yPosition, { maxWidth: pageWidth - 2 * margin });
                    yPosition += 3;
                }
                if (estadoDoc.faltantes.length > 0) {
                    doc.text('Faltantes: ' + estadoDoc.faltantes.join(', '), margin + 5, yPosition, { maxWidth: pageWidth - 2 * margin });
                    yPosition += 3;
                }
                if (estadoDoc.documentoUsado) {
                    doc.text(`Especial: ${estadoDoc.documentoUsado}`, margin + 5, yPosition);
                    yPosition += 3;
                }
                yPosition += 8;
                doc.setFontSize(10);
            });
            // Pie de página en la última página
            addFooter(pageNum);
            // Descargar PDF
            doc.save(`reporte-registros-pendientes-${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error('Error al generar reporte PDF:', error);
            showError('Error al generar el reporte PDF');
        } finally {
            setDescargando(false);
        }
    };

    // Reporte Excel real y legible
    const generarReporteExcel = () => {
        try {
            setDescargando(true);
            // Encabezado y datos
            const headers = [
                'Nombre', 'Apellido', 'DNI', 'Email', 'Modalidad', 'Estado', 'Días Restantes',
                'Fecha Registro', 'Docs Presentados', 'Docs Requeridos', '% Completado',
                'Documentos Subidos', 'Documentos Faltantes', 'Documento Especial'
            ];
            const datos = registros.map(registro => {
                const info = obtenerInfoVencimiento(registro);
                const estadoDoc = obtenerEstadoDocumentacion(registro);
                return [
                    registro.datos?.nombre || registro.nombre,
                    registro.datos?.apellido || registro.apellido,
                    registro.datos?.dni || registro.dni,
                    registro.datos?.email || registro.email || 'Sin email',
                    registro.datos?.modalidad || registro.modalidad,
                    info.vencido ? 'VENCIDO' : 'VIGENTE',
                    info.diasRestantes,
                    new Date(registro.timestamp).toLocaleString('es-AR'),
                    estadoDoc.totalSubidos,
                    estadoDoc.totalRequeridos,
                    `${estadoDoc.porcentajeCompletado}%`,
                    estadoDoc.subidos.join('; '),
                    estadoDoc.faltantes.join('; '),
                    estadoDoc.documentoUsado || ''
                ];
            });

            // Dos renglones libres antes del encabezado
            const datosFinal = [[], [], headers, ...datos];

            const extraHeaderRows = [];
            const customMerges = [];

            // --- SECCIÓN ANÁLISIS DE DATOS ---
            datosFinal.push(['']);

            const analysisTitleIndex = datosFinal.length;
            extraHeaderRows.push(analysisTitleIndex);
            // Relleno para cubrir A-D (col 0 + 3 vacías)
            datosFinal.push(['═══ ANÁLISIS DE DATOS ═══', '', '', '']);

            // Merge Título Sección A-D (0-3)
            // +6 offset por los headers institucionales en utils.js
            const titleRowExcelIndex = analysisTitleIndex + 6;
            customMerges.push({
                s: { r: titleRowExcelIndex, c: 0 },
                e: { r: titleRowExcelIndex, c: 3 }
            });

            const obsHeaderIndex = datosFinal.length;
            extraHeaderRows.push(obsHeaderIndex);
            datosFinal.push(['#', 'Detalle', '', '']);

            // Merge Header Row ("Detalle") B-D (1-3)
            const headerRowExcelIndex = obsHeaderIndex + 6;
            customMerges.push({
                s: { r: headerRowExcelIndex, c: 1 },
                e: { r: headerRowExcelIndex, c: 3 }
            });

            // Generar observaciones dinámicas
            const totalRegistros = registros.length;
            const vencidos = registros.filter(r => obtenerInfoVencimiento(r).vencido).length;
            const porcentajeVencidos = totalRegistros > 0 ? ((vencidos / totalRegistros) * 100).toFixed(1) : 0;

            const observaciones = [
                `Total de inscripciones pendientes: ${totalRegistros}`,
                `Inscripciones con plazo vencido: ${vencidos} (${porcentajeVencidos}%)`,
                'Estos estudiantes no figuran en el padrón oficial hasta regularizar su documentación.'
            ];

            observaciones.forEach((obs, index) => {
                const currentRowIndex = datosFinal.length;
                const excelRowIndex = currentRowIndex + 6;
                datosFinal.push([index + 1, obs, '', '']);

                // Merge cols B-D (1-3)
                customMerges.push({
                    s: { r: excelRowIndex, c: 1 },
                    e: { r: excelRowIndex, c: 3 }
                });
            });

            exportarExcel(
                datosFinal,
                'registros-pendientes',
                'ESTUDIANTES CON INSCRIPCION PENDIENTE POR DOCUMENTACION INCOMPLETA',
                extraHeaderRows,
                customMerges
            );
            showSuccess('📊 Archivo Excel generado');
        } catch (error) {
            showError(`Error al generar Excel: ${error.message}`);
        } finally {
            setDescargando(false);
        }
    };

    // Generar PDF de "Extensión Inscripción" — estudiantes con permiso de reinicio de alarma
    const handleExtensionInscripcion = () => {
        try {
            // Seleccionar únicamente los registros que tengan la alarma reiniciada o autorización explícita
            const seleccion = registros.filter(r => r && (r.alarmaReiniciada === true || r.autorizacionExtension === true));

            if (!seleccion || seleccion.length === 0) {
                showInfo('ℹ️ No hay estudiantes con alarma reiniciada/autorización para generar la extensión.');
                return;
            }

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const margin = 20;
            let y = 20;

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(45, 65, 119);
            doc.text('EXTENSIÓN DE INSCRIPCIÓN - Alumnos con reinicio de alarma', pageWidth / 2, y, { align: 'center' });
            y += 10;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generado: ${new Date().toLocaleString('es-AR')}`, margin, y);
            y += 8;

            seleccion.forEach((reg, idx) => {
                if (y > 250) {
                    doc.addPage();
                    y = 20;
                }
                const nombre = `${reg.datos?.nombre || reg.nombre || ''} ${reg.datos?.apellido || reg.apellido || ''}`.trim();
                const dni = reg.datos?.dni || reg.dni || '';
                const email = reg.datos?.email || reg.email || 'Sin email';
                const fechaReinicio = reg.fechaReinicio || reg.fechaReinicioISO || '';
                const motivo = reg.motivoExtension || reg.motivo || '';

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text(`${idx + 1}. ${nombre}`, margin, y);
                y += 6;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.text(`DNI: ${dni}   Email: ${email}`, margin + 4, y);
                y += 5;
                if (fechaReinicio) {
                    const fechaFmt = new Date(fechaReinicio).toLocaleString('es-AR');
                    doc.text(`Fecha reinicio: ${fechaFmt}   Motivo: ${motivo}`, margin + 4, y);
                    y += 6;
                }
                y += 4;
            });

            doc.save(`extension-inscripcion-${new Date().toISOString().split('T')[0]}.pdf`);
            showSuccess('📄 Extensión Inscripción generada');
        } catch (error) {
            console.error('Error generando extensión inscripción:', error);
            showError('❌ Error al generar Extensión Inscripción');
        }
    };

    // Calcular fecha de última actualización
    const fechaActualizacion = registros.length > 0
        ? new Date(Math.max(...registros.map(r => new Date(r.timestamp)))).toLocaleString('es-AR')
        : null;

    // Handler para cerrar/ocultar el estado de duplicados (prefijado para evitar linter cuando no se usa)
    const _limpiarEstadoDuplicados = () => setEstadoDuplicados(null);

    return (
        <div className="modal-registros-pendientes">
            <div className="modal-overlay">
                <div className="modal-container registros-pendientes">

                    {/* Header del modal */}
                    <HeaderModal
                        cantidadTotal={registros.length}
                        fechaActualizacion={fechaActualizacion}
                        onCerrar={onClose}
                    />
                    {/* ALERTAS FLOTANTES GLOBALES */}
                    <AlertaMens
                        mode="floating"
                        alerts={alerts}
                        onCloseAlert={removeAlert}
                        modal={modal}
                        onCloseModal={closeModal}
                    />
                    {/* Contenido principal */}
                    <div className="modal-content">
                        {/* Lista de registros */}
                        <ListaRegistrosPendientes
                            registros={registros}
                            cargandoRegistros={cargandoRegistros}
                            mapeoDocumentos={{
                                'cuil': 'CUIL',
                                'dni': 'DNI',
                                'fichaMedica': 'Ficha Médica',
                                'certificadoNivelPrimario': 'Certificado Nivel Primario',
                                'partidaNacimiento': 'Partida de Nacimiento',
                                'foto': 'Foto',
                                'certificadoNivelSecundario': 'Certificado Nivel Secundario',
                                'constanciaAlumnoRegular': 'Constancia Alumno Regular'
                            }}
                            enviandoEmail={enviandoEmail}
                            onCompletar={completarRegistro}
                            onEliminar={procesarEliminacion}
                            onEnviarEmail={enviarEmailIndividual}
                            obtenerInfoVencimiento={obtenerInfoVencimiento}
                            onReiniciarAlarma={reiniciarAlarma}
                            getTipoIcon={getTipoIcon}
                            formatearTipo={formatearTipo}
                        />
                    </div>

                    {/* Footer (componente unificado y responsive) */}
                    <ModalFooter
                        onUrgentes={enviarEmailsUrgentes}
                        onTodos={enviarEmailsMasivos}
                        onReporteTxt={generarReporteAdministrativo}
                        onReporteExcel={generarReporteExcel}
                        onReportePdf={generarReportePDF}
                        onExtensionInscripcion={handleExtensionInscripcion}
                        onTest7Dias={probarSistema7Dias}
                        onVerificarDuplicados={verificarEstadoDuplicadosManual}
                        onLimpiarDuplicados={limpiarDuplicadosManual}
                    />
                </div>
            </div>

            {/* Modal de edición de registro */}
            {mostrarModalEdicion && registroEditando && (
                <ModalEditarRegistro
                    registro={registroEditando}
                    onClose={cerrarModalEdicion}
                    onGuardado={handleRegistroGuardado}
                    onEliminado={handleRegistroEliminado}
                />
            )}
        </div>
    );
}

ModalRegistrosPendientes.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default ModalRegistrosPendientes;