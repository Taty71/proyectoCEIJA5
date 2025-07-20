import { useState } from 'react';
import PropTypes from 'prop-types';
import ConsultaOpciones from './ConsultaOpciones';
import BusquedaDNI from './BusquedaDNI';
import ListaEstudiantes from './ListaEstudiantes';
import GestionEstudiante from '../pages/GestionEstudiante';
import ModificarEstd from '../pages/ModificarEstd';
import VisorEstudiante from './VisorEstudiante';
import EditorEstudiante from './EditorEstudiante';
import EliminarEstd from '../pages/EliminarEstd';
import AlertaMens from './AlertaMens';
import serviceInscripcion from '../services/serviceInscripcion';
import '../estilos/gestionCRUD.css';

const GestionCRUD = ({ isAdmin, onClose, vistaInicial = 'opciones', esModificacion = false }) => {
    const [vistaActual, setVistaActual] = useState(vistaInicial); // Usar vistaInicial como estado inicial
    const [estudiante, setEstudiante] = useState(null);
    const [alert, setAlert] = useState({ text: '', variant: '' });
    const [vistaAnterior, setVistaAnterior] = useState(null); // Para rastrear la vista anterior
    const [refreshKey, setRefreshKey] = useState(0); // Para forzar recarga de la lista
    // Inicializar modoModificacion basado en prop esModificacion o vista inicial
    const [modoModificacion, setModoModificacion] = useState(
        esModificacion || vistaInicial === 'opcionesModificar'
    );
    // Detectar si estamos en modo eliminación basado en la vista inicial
    const [modoEliminacion] = useState(
        vistaInicial === 'opcionesEliminar' || vistaInicial === 'busquedaDNIEliminar' || vistaInicial === 'listaEliminar'
    );

    const handleSeleccionOpcion = (opcion) => {
        if (opcion === 'dni') {
            setVistaActual('busquedaDNI');
        } else if (opcion === 'inscripciones') {
            setVistaActual('lista');
        } else if (opcion === 'eliminar') {
            setVistaActual('opcionesEliminar');
        }
    };

    const handleSeleccionOpcionModificar = (opcion) => {
        console.log('handleSeleccionOpcionModificar llamado con:', opcion);
        setModoModificacion(true); // Activar modo modificación
        if (opcion === 'dni') {
            console.log('Cambiando vista a busquedaDNI con modoModificacion=true');
            setVistaActual('busquedaDNI');
        } else if (opcion === 'inscripciones') {
            console.log('Cambiando vista a lista con modoModificacion=true');
            setVistaActual('lista');
        }
    };

    const handleSeleccionOpcionEliminar = (opcion) => {
        console.log('handleSeleccionOpcionEliminar llamado con:', opcion);
        if (opcion === 'dni') {
            setVistaActual('busquedaDNIEliminar');
        } else if (opcion === 'inscripciones') {
            setVistaActual('listaEliminar');
        }
    };

    const handleEstudianteEncontrado = (resultado) => {
        if (resultado?.success && resultado.estudiante) {
            // Estructurar los datos para el VisorEstudiante
            const estudianteCompleto = {
                ...resultado.estudiante,
                // Datos de domicilio
                calle: resultado.domicilio?.calle || '',
                numero: resultado.domicilio?.numero || '',
                barrio: resultado.domicilio?.barrio || '',
                localidad: resultado.domicilio?.localidad || '',
                pcia: resultado.domicilio?.provincia || '',
                // Datos académicos
                modalidad: resultado.inscripcion?.modalidad || '',
                planAnio: resultado.inscripcion?.plan || '',
                modulo: resultado.inscripcion?.modulo || '',
                estadoInscripcion: resultado.inscripcion?.estado || '',
                fechaInscripcion: resultado.inscripcion?.fechaInscripcion || '',
                idInscripcion: resultado.inscripcion?.idInscripcion || null,
                // Documentación
                documentacion: resultado.documentacion || []
            };
            
            console.log('Estudiante completo estructurado:', estudianteCompleto);
            setEstudiante(estudianteCompleto);
            setVistaAnterior(vistaActual); // Guardar la vista actual antes de cambiar
            setVistaActual('visor'); // Ir directamente al visor modal del estudiante
        }
        // Remover el else para evitar alertas duplicadas - el error se maneja en BusquedaDNI
    };

    const handleEstudianteEncontradoParaModificar = (resultado) => {
        console.log('handleEstudianteEncontradoParaModificar llamado - modoModificacion:', modoModificacion);
        if (resultado?.success && resultado.estudiante) {
            // Estructurar los datos para el VisorEstudiante (igual que consulta)
            const estudianteCompleto = {
                ...resultado.estudiante,
                // Datos de domicilio
                calle: resultado.domicilio?.calle || '',
                numero: resultado.domicilio?.numero || '',
                barrio: resultado.domicilio?.barrio || '',
                localidad: resultado.domicilio?.localidad || '',
                pcia: resultado.domicilio?.provincia || '',
                // Datos académicos
                modalidad: resultado.inscripcion?.modalidad || '',
                planAnio: resultado.inscripcion?.plan || '',
                modulo: resultado.inscripcion?.modulo || '',
                estadoInscripcion: resultado.inscripcion?.estado || '',
                fechaInscripcion: resultado.inscripcion?.fechaInscripcion || '',
                idInscripcion: resultado.inscripcion?.idInscripcion || null,
                // Documentación
                documentacion: resultado.documentacion || []
            };
            
            console.log('Estudiante encontrado para modificar:', estudianteCompleto);
            console.log('Antes de setear vista - modoModificacion:', modoModificacion);
            setEstudiante(estudianteCompleto);
            setVistaAnterior(vistaActual); // Guardar la vista actual antes de cambiar
            setVistaActual('visor'); // Ir al visor primero (Detalle Estudiante)
        } else {
            setAlert({ 
                text: resultado?.error || 'No se encontró un estudiante con ese DNI', 
                variant: 'error' 
            });
        }
    };

    const handleAccionEstudiante = (accion, estudianteData = null) => {
        if (estudianteData) {
            // Estructurar los datos para el EditorEstudiante cuando viene de la lista
            const estudianteCompleto = {
                ...estudianteData,
                // Si no tiene estos datos, los campos estarán vacíos pero funcionará
                calle: estudianteData.calle || '',
                numero: estudianteData.numero || '',
                barrio: estudianteData.barrio || '',
                localidad: estudianteData.localidad || '',
                pcia: estudianteData.provincia || estudianteData.pcia || '',
                modalidad: estudianteData.modalidad || '',
                planAnio: estudianteData.planAnio || estudianteData.plan || '',
                modulo: estudianteData.modulo || '',
                estadoInscripcion: estudianteData.estadoInscripcion || estudianteData.estado || '',
                fechaInscripcion: estudianteData.fechaInscripcion || '',
                documentacion: estudianteData.documentacion || []
            };
            
            // Marcar el origen para saber a dónde regresar después
            if (accion === 'Modificar' && estudianteData) {
                estudianteCompleto.vieneDeLista = true;
            }
            
            setEstudiante(estudianteCompleto);
        }

        // Establecer la vista anterior cuando vamos al visor desde la lista
        if (accion === 'Ver') {
            setVistaAnterior(vistaActual);
        }

        switch (accion) {
            case 'Registrar':
                setVistaActual('registro');
                break;
            case 'Modificar':
                // Si ya tenemos datos del estudiante, ir directamente al editor
                if (estudianteData) {
                    setVistaActual('editor');
                } else {
                    setModoModificacion(true);
                    setVistaActual('opcionesModificar');
                }
                break;
            case 'Eliminar':
                console.log('handleAccionEstudiante - Cambiando vista a opcionesEliminar');
                setVistaActual('opcionesEliminar');
                break;
            case 'Ver':
                setVistaActual('visor');
                break;
            default:
                console.warn('Acción no reconocida:', accion);
        }
    };

    const handleModificarDesdeVisor = () => {
        // Marcar que viene del visor para la navegación correcta
        if (estudiante) {
            setEstudiante({
                ...estudiante,
                vieneDelVisor: true
            });
        }
        setVistaActual('editor');
    };

    const handleVolverDelEditorAlVisor = () => {
        // Limpiar la marca y volver al visor
        if (estudiante) {
            const estudianteLimpio = { ...estudiante };
            delete estudianteLimpio.vieneDelVisor;
            setEstudiante(estudianteLimpio);
        }
        setVistaActual('visor');
    };

    const handleCerrarEditorAOpciones = () => {
        setVistaActual('opciones');
        setEstudiante(null);
        setAlert({ text: '', variant: '' });
        setModoModificacion(false); // Resetear modo cuando cerramos editor
    };



    const handleCerrarEditor = () => {
        // Para el editor, determinar a dónde regresar basado en el contexto
        if (estudiante?.vieneDeLista) {
            // Si viene de la lista de estudiantes, regresar a la lista
            setVistaActual('lista');
        } else if (vistaInicial === 'busquedaDNI') {
            // Si viene de búsqueda DNI directa, regresar a búsqueda
            setVistaActual('busquedaDNI');
        } else {
            // Si viene del flujo de modificación (desde el menú), regresar a opciones de modificación
            setVistaActual('opcionesModificar');
        }
        setEstudiante(null);
        setAlert({ text: '', variant: '' });
    };

    const handleVolverAOpciones = () => {
        console.log('handleVolverAOpciones llamado - modoModificacion actual:', modoModificacion, 'modoEliminacion:', modoEliminacion);
        if (modoModificacion) {
            setVistaActual('opcionesModificar');
            // NO resetear el modo aquí - mantener el estado
        } else if (modoEliminacion) {
            setVistaActual('opcionesEliminar');
        } else {
            setVistaActual('opciones');
        }
        setEstudiante(null);
        setAlert({ text: '', variant: '' });
    };

    const handleVolverALista = () => {
        setVistaActual('lista');
        setEstudiante(null);
        setAlert({ text: '', variant: '' });
    };

    const handleVolverABusquedaDNI = () => {
        setVistaActual('busquedaDNI');
        setEstudiante(null);
        setAlert({ text: '', variant: '' });
        setVistaAnterior(null);
    };

    const handleVolverDesdeVisor = () => {
        // Si la vista anterior es busquedaDNI, volver ahí, sino a la lista
        if (vistaAnterior === 'busquedaDNI') {
            handleVolverABusquedaDNI();
        } else {
            handleVolverALista();
        }
    };

    const handleCerrarVisorAOpciones = () => {
        console.log('handleCerrarVisorAOpciones llamado - reseteando modoModificacion');
        setVistaActual('opciones');
        setEstudiante(null);
        setAlert({ text: '', variant: '' });
        setModoModificacion(false); // Resetear modo cuando cerramos completamente
    };

    const handleExito = () => {
        setAlert({ text: 'Operación realizada con éxito', variant: 'success' });
        setTimeout(() => {
            setModoModificacion(false); // Resetear modo después de operación exitosa
            handleVolverAOpciones();
        }, 2000);
    };

    const renderContenido = () => {
        console.log('renderContenido - vistaActual:', vistaActual, 'modoModificacion:', modoModificacion);
        switch (vistaActual) {
            case 'opciones':
                return (
                    <ConsultaOpciones 
                        onSeleccion={handleSeleccionOpcion}
                        titulo="" // Sin título adicional
                        onClose={onClose}
                    />
                );
            
            case 'opcionesModificar':
                return (
                    <ConsultaOpciones 
                        onSeleccion={handleSeleccionOpcionModificar}
                        titulo="" // Sin título adicional
                        onClose={onClose}
                        tituloModal="Seleccionar tipo de Modificación"
                        descripcionModal="Elija cómo desea modificar estudiantes:"
                        esModificacion={true}
                    />
                );
            
            case 'busquedaDNI':
                return (
                    <BusquedaDNI 
                        onEstudianteEncontrado={modoModificacion ? handleEstudianteEncontradoParaModificar : handleEstudianteEncontrado}
                        onClose={onClose}
                        onVolver={vistaInicial === 'busquedaDNI' && !modoModificacion ? null : handleVolverAOpciones}
                        esConsultaDirecta={vistaInicial === 'busquedaDNI' && !modoModificacion}
                        modoModificacion={modoModificacion}
                    />
                );

            case 'lista':
            case 'listaModificar': // Mapear listaModificar al mismo caso que lista
                return (
                    <ListaEstudiantes 
                        refreshKey={refreshKey} // Pasar refreshKey para forzar recarga
                        onAccion={modoModificacion ? (accion, estudianteSeleccionado) => {
                            if (accion === 'Ver') {
                                // En modo modificación, "Ver" (ojo) va al visor como consulta
                                const estudianteCompleto = {
                                    ...estudianteSeleccionado,
                                    esConsultaDesdeModificacion: true // Marcar que es consulta desde modificación
                                };
                                setEstudiante(estudianteCompleto);
                                setVistaAnterior(vistaActual);
                                setVistaActual('visor');
                            } else if (accion === 'Modificar') {
                                // El botón lápiz va directamente al editor
                                handleAccionEstudiante('Modificar', estudianteSeleccionado);
                            } else if (accion === 'Eliminar') {
                                // Eliminar va directamente al modal de confirmación
                                setEstudiante(estudianteSeleccionado);
                                setVistaActual('confirmarEliminacion');
                            } else {
                                // Para cualquier otra acción
                                handleAccionEstudiante(accion, estudianteSeleccionado);
                            }
                        } : (accion, estudianteSeleccionado) => {
                            if (accion === 'Eliminar') {
                                // Eliminar va directamente al modal de confirmación
                                setEstudiante(estudianteSeleccionado);
                                setVistaActual('confirmarEliminacion');
                            } else {
                                // Para otras acciones usar el handler normal
                                handleAccionEstudiante(accion, estudianteSeleccionado);
                            }
                        }}
                        onClose={onClose}
                        onVolver={handleVolverAOpciones}
                    />
                );

            case 'opcionesEliminar':
                console.log('Renderizando opcionesEliminar - ConsultaOpciones');
                return (
                    <ConsultaOpciones 
                        onSeleccion={handleSeleccionOpcionEliminar}
                        onClose={onClose}
                        tituloModal="Seleccionar tipo de eliminación"
                        descripcionModal="Elija cómo desea eliminar estudiantes"
                        esModificacion={false} // Para que use los textos de eliminación
                        titulo="Eliminar "
                    />
                );

            case 'busquedaDNIEliminar':
                return (
                    <BusquedaDNI 
                        onEstudianteEncontrado={(resultado) => {
                            if (resultado?.success && resultado.estudiante) {
                                // Estructurar los datos completos del estudiante para eliminar
                                const estudianteCompleto = {
                                    ...resultado.estudiante,
                                    // Datos de domicilio
                                    calle: resultado.domicilio?.calle || '',
                                    numero: resultado.domicilio?.numero || '',
                                    barrio: resultado.domicilio?.barrio || '',
                                    localidad: resultado.domicilio?.localidad || '',
                                    pcia: resultado.domicilio?.provincia || '',
                                    // Datos académicos
                                    modalidad: resultado.inscripcion?.modalidad || '',
                                    planAnio: resultado.inscripcion?.plan || '',
                                    modulo: resultado.inscripcion?.modulo || '',
                                    estadoInscripcion: resultado.inscripcion?.estado || '',
                                    fechaInscripcion: resultado.inscripcion?.fechaInscripcion || '',
                                    idInscripcion: resultado.inscripcion?.idInscripcion || null,
                                    // Documentación
                                    documentacion: resultado.documentacion || []
                                };
                                setEstudiante(estudianteCompleto);
                                setVistaActual('confirmarEliminacion');
                            } else {
                                setAlert({ 
                                    text: resultado?.error || 'Error al buscar estudiante', 
                                    variant: 'error' 
                                });
                            }
                        }}
                        onClose={handleVolverAOpciones}
                        onVolver={handleVolverAOpciones}
                        modoEliminacion={true}
                    />
                );

            case 'listaEliminar':
                return (
                    <ListaEstudiantes 
                        onAccion={(accion, estudianteSeleccionado) => {
                            if (accion === 'Ver' || accion === 'Eliminar') {
                                // Estructurar los datos del estudiante para eliminación
                                const estudianteCompleto = {
                                    ...estudianteSeleccionado,
                                    // Si no tiene estos datos, los campos estarán vacíos pero funcionará
                                    calle: estudianteSeleccionado.calle || '',
                                    numero: estudianteSeleccionado.numero || '',
                                    barrio: estudianteSeleccionado.barrio || '',
                                    localidad: estudianteSeleccionado.localidad || '',
                                    pcia: estudianteSeleccionado.provincia || estudianteSeleccionado.pcia || '',
                                    modalidad: estudianteSeleccionado.modalidad || '',
                                    planAnio: estudianteSeleccionado.planAnio || estudianteSeleccionado.plan || '',
                                    modulo: estudianteSeleccionado.modulo || '',
                                    estadoInscripcion: estudianteSeleccionado.estadoInscripcion || estudianteSeleccionado.estado || '',
                                    fechaInscripcion: estudianteSeleccionado.fechaInscripcion || '',
                                    documentacion: estudianteSeleccionado.documentacion || []
                                };
                                setEstudiante(estudianteCompleto);
                                setVistaActual('confirmarEliminacion');
                            }
                        }}
                        onClose={handleVolverAOpciones}
                        soloParaEliminacion={true}
                    />
                );

            case 'registro':
                return (
                    <GestionEstudiante 
                        modalidad={estudiante?.modalidad || 'Presencial'}
                        accion="Registrar"
                        isAdmin={isAdmin}
                        onClose={handleVolverAOpciones}
                    />
                );

            case 'modificar':
                return (
                    <ModificarEstd 
                        idInscripcion={estudiante?.idInscripcion}
                        accion="Modificar"
                        isAdmin={isAdmin}
                        estudiante={estudiante}
                        onSuccess={handleExito}
                    />
                );

            case 'visor': {
                console.log('Renderizando visor - modoModificacion:', modoModificacion, 'esConsultaDesdeModificacion:', estudiante?.esConsultaDesdeModificacion, 'esEliminacionDesdeModificacion:', estudiante?.esEliminacionDesdeModificacion);
                
                // Determinar el tipo de vista
                let esConsulta = false;
                let esEliminacion = false;
                
                if (estudiante?.esConsultaDesdeModificacion) {
                    esConsulta = true;
                } else if (estudiante?.esEliminacionDesdeModificacion) {
                    esEliminacion = true;
                } else if (!modoModificacion) {
                    esConsulta = true;
                }
                
                return (
                    <VisorEstudiante 
                        estudiante={estudiante}
                        onClose={modoModificacion ? handleVolverAOpciones : handleCerrarVisorAOpciones}
                        onVolver={handleVolverDesdeVisor}
                        onModificar={estudiante?.esConsultaDesdeModificacion || estudiante?.esEliminacionDesdeModificacion ? null : handleModificarDesdeVisor}
                        isConsulta={esConsulta}
                        isEliminacion={esEliminacion}
                    />
                );
            }

            case 'editor':
                return (
                    <EditorEstudiante 
                        estudiante={estudiante}
                        onClose={estudiante?.vieneDelVisor ? handleCerrarEditorAOpciones : handleCerrarEditor}
                        onVolver={estudiante?.vieneDelVisor ? handleVolverDelEditorAlVisor : null}
                    />
                );

            case 'confirmarEliminacion':
                return (
                    <EliminarEstd 
                        data={{
                            success: true,
                            estudiante: {
                                nombre: estudiante?.nombre,
                                apellido: estudiante?.apellido,
                                dni: estudiante?.dni,
                                cuil: estudiante?.cuil,
                                fechaNacimiento: estudiante?.fechaNacimiento,
                                tipoDocumento: estudiante?.tipoDocumento,
                                paisEmision: estudiante?.paisEmision
                            },
                            domicilio: {
                                calle: estudiante?.calle,
                                numero: estudiante?.numero,
                                barrio: estudiante?.barrio,
                                localidad: estudiante?.localidad,
                                provincia: estudiante?.pcia
                            },
                            inscripcion: {
                                modalidad: estudiante?.modalidad,
                                plan: estudiante?.planAnio,
                                modulo: estudiante?.modulo,
                                estado: estudiante?.estadoInscripcion,
                                fechaInscripcion: estudiante?.fechaInscripcion
                            },
                            documentacion: estudiante?.documentacion || []
                        }}
                        onClose={handleVolverAOpciones}
                        onVolver={handleVolverALista} // Cambiar para que vuelva a la lista
                        onEliminar={async (tipoEliminacion) => {
                            try {
                                let response;
                                let mensaje;
                                
                                if (tipoEliminacion === 'fisica') {
                                    // Eliminación física - borrar completamente de la BD
                                    response = await serviceInscripcion.deleteEstd(estudiante.dni);
                                    mensaje = 'Estudiante eliminado permanentemente de la base de datos';
                                } else if (tipoEliminacion === 'logica') {
                                    // Eliminación lógica - desactivar estudiante
                                    response = await serviceInscripcion.deactivateEstd(estudiante.dni);
                                    // Usar el mensaje de la respuesta si está disponible, o mensaje por defecto
                                    mensaje = 'Estudiante desactivado exitosamente. El estudiante ya no aparecerá en las listas de consulta';
                                }
                                
                                if (response.error) {
                                    setAlert({ text: response.error, variant: 'error' });
                                } else if (response.success || !response.error) {
                                    setAlert({ text: mensaje, variant: 'success' });
                                    // Incrementar refreshKey para recargar la lista
                                    setRefreshKey(prev => prev + 1);
                                    setTimeout(() => {
                                        handleVolverALista(); // Volver a la lista después de eliminar
                                    }, 2000); // Tiempo reducido para mejor UX
                                } else {
                                    setAlert({ text: 'Ocurrió un error inesperado durante la eliminación', variant: 'error' });
                                }
                            } catch (error) {
                                console.error('Error al procesar eliminación:', error);
                                setAlert({ text: 'Error al procesar la eliminación del estudiante', variant: 'error' });
                            }
                        }}
                    />
                );

            default:
                console.error('Vista no encontrada:', vistaActual);
                return <div>Vista no encontrada: {vistaActual}</div>;
        }
    };

    return (
        <div className="gestion-crud-container">
            {alert.text && (
                <AlertaMens 
                    text={alert.text} 
                    variant={alert.variant} 
                />
            )}
            
            {renderContenido()}
        </div>
    );
};

GestionCRUD.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    vistaInicial: PropTypes.string,
    esModificacion: PropTypes.bool,
};

export default GestionCRUD;
