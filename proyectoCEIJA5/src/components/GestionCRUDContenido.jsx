import VistaOpciones from './VistaOpciones';
import VistaOpcionesModificar from './VistaOpcionesModificar';
import VistaOpcionesEliminar from './VistaOpcionesEliminar';
import VistaBusquedaDNI from './VistaBusquedaDNI';
import VistaListaEstudiantes from './VistaListaEstudiantes';
import VistaRegistro from './VistaRegistro';
import VistaModificar from './VistaModificar';
import VistaVisor from './VistaVisor';
import VistaEliminar from './VistaEliminar';
import serviceInscripcion from '../services/serviceInscripcion';
import { construirEstudianteCompleto } from '../utils/utilsEstudiante';
import {
    handleEstudianteEncontrado,
    handleEstudianteEncontradoParaModificar,
    handleAccionEstudiante,
    handleVolverAOpciones,
    handleVolverALista,
    handleVolverABusquedaDNI,
    handleVolverDesdeVisor,
    handleCerrarVisorAOpciones,
    
} from '../utils/handlersCrud';

import PropTypes from 'prop-types';

const GestionCRUDContenido = ({
    isAdmin,
    onClose,
    vistaInicial,
    soloListar,
    modalidad,
    modalidadId,
    user,
    vistaActual,
    setVistaActual,
    estudiante,
    setEstudiante,
    alert,
    setAlert,
    vistaAnterior,
    setVistaAnterior,
    refreshKey,
    setRefreshKey,
    modoModificacion,
    setModoModificacion,
    modoEliminacion
}) => {
    // Acceso a alert para evitar advertencia de variable no usada
    // eslint-disable-next-line no-unused-vars
    const _alert = alert;
    // Usar modalidadId recibido por props si existe, si no, derivar de modalidad
    const modalidadIdFinal = typeof modalidadId !== 'undefined' && modalidadId !== null ? modalidadId : (modalidad !== undefined && modalidad !== null && modalidad !== '' && !isNaN(Number(modalidad)) ? Number(modalidad) : undefined);
    const modalidadFiltrada = user?.rol === 'admDirector' ? undefined : modalidad;

    // Handlers importados desde handlersCrud.js

    // Switch/case de renderContenido
    switch (vistaActual) {
        case 'opciones':
            return (
                <VistaOpciones 
                    modalidadId={modalidadIdFinal}
                    modalidad={modalidad}
                    modalidadFiltrada={modalidadFiltrada}
                    onSeleccion={(opcion) => {
                        if (opcion === 'dni') {
                            setVistaActual('busquedaDNI');
                        } else if (opcion === 'inscripciones') {
                            setVistaActual('lista');
                        }
                    }}
                    onClose={onClose}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}
                />
            );
        case 'opcionesModificar':
            return (
                <VistaOpcionesModificar 
                    modalidadId={modalidadIdFinal}
                    modalidad={modalidad}
                    modalidadFiltrada={modalidadFiltrada}
                    onSeleccion={(opcion) => {
                        if (opcion === 'dni') {
                            setVistaActual('busquedaDNI');
                        } else if (opcion === 'inscripciones') {
                            setVistaActual('listaModificar');
                        }
                    }}
                    onClose={onClose}
                />
            );
        case 'busquedaDNI':
            return (
                <VistaBusquedaDNI 
                    modalidadId={modalidadIdFinal}
                    modalidad={modalidad}
                    modalidadFiltrada={modalidadFiltrada}
                    onEstudianteEncontrado={modoModificacion
                        ? (resultado) => handleEstudianteEncontradoParaModificar(
                            resultado,
                            setEstudiante,
                            setVistaAnterior,
                            vistaActual,
                            setVistaActual,
                            setAlert
                        )
                        : (resultado) => handleEstudianteEncontrado(
                            resultado,
                            setEstudiante,
                            setVistaAnterior,
                            vistaActual,
                            setVistaActual
                        )
                    }
                    onClose={onClose}
                    onVolver={vistaInicial === 'busquedaDNI' && !modoModificacion ? null : handleVolverAOpciones}
                    esConsultaDirecta={vistaInicial === 'busquedaDNI' && !modoModificacion}
                    modoModificacion={modoModificacion}
                />
            );
        case 'lista':
        case 'listaModificar': {
            const onAccion = modoModificacion
                ? (accion, estudianteSeleccionado) => {
                    if (accion === 'Ver') {
                        handleAccionEstudiante(
                            'Ver',
                            estudianteSeleccionado,
                            setEstudiante,
                            setVistaAnterior,
                            vistaActual,
                            setVistaActual,
                            setModoModificacion
                        );
                    } else if (accion === 'Modificar') {
                        handleAccionEstudiante(
                            'Modificar',
                            estudianteSeleccionado,
                            setEstudiante,
                            setVistaAnterior,
                            vistaActual,
                            setVistaActual,
                            setModoModificacion
                        );
                    } else if (accion === 'Eliminar') {
                        setEstudiante(construirEstudianteCompleto(estudianteSeleccionado));
                        setVistaActual('confirmarEliminacion');
                    } else {
                        handleAccionEstudiante(
                            accion,
                            estudianteSeleccionado,
                            setEstudiante,
                            setVistaAnterior,
                            vistaActual,
                            setVistaActual,
                            setModoModificacion
                        );
                    }
                }
                : (accion, estudianteSeleccionado) => {
                    if (accion === 'Eliminar') {
                        setEstudiante(construirEstudianteCompleto(estudianteSeleccionado));
                        setVistaActual('confirmarEliminacion');
                    } else {
                        handleAccionEstudiante(
                            accion,
                            estudianteSeleccionado,
                            setEstudiante,
                            setVistaAnterior,
                            vistaActual,
                            setVistaActual,
                            setModoModificacion
                        );
                    }
                };
            return (
                <VistaListaEstudiantes
                    soloListar={soloListar}
                    refreshKey={refreshKey}
                    modalidadId={modalidadIdFinal}
                    modalidad={modalidad}
                    modalidadFiltrada={modalidadFiltrada}
                    onAccion={onAccion}
                    onClose={onClose}
                    onVolver={handleVolverAOpciones}
                />
            );
        }
        case 'opcionesEliminar':
            return (
                <VistaOpcionesEliminar 
                    modalidadId={modalidadIdFinal}
                    modalidad={modalidad}
                    modalidadFiltrada={modalidadFiltrada}
                    onSeleccion={(opcion) => {
                        if (opcion === 'dni') {
                            setVistaActual('busquedaDNIEliminar');
                        } else if (opcion === 'inscripciones') {
                            setVistaActual('listaEliminar');
                        }
                    }}
                    onClose={onClose}
                />
            );
        case 'busquedaDNIEliminar':
            return (
                <VistaBusquedaDNI 
                    modalidadId={modalidadIdFinal}
                    modalidad={modalidad}
                    modalidadFiltrada={modalidadFiltrada}
                    onEstudianteEncontrado={(resultado) => {
                        if (resultado?.success && resultado.estudiante) {
                            const estudianteCompleto = construirEstudianteCompleto(resultado);
                            setEstudiante(estudianteCompleto);
                            setVistaActual('confirmarEliminacion');
                        } else {
                            setAlert({ text: resultado?.error || 'Error al buscar estudiante', variant: 'error' });
                        }
                    }}
                    onClose={() => handleVolverAOpciones(false, false, setVistaActual, setEstudiante, setAlert)}
                    onVolver={() => handleVolverAOpciones(false, false, setVistaActual, setEstudiante, setAlert)}
                    modoEliminacion={true}
                />
            );
        case 'listaEliminar':
            return (
                <VistaListaEstudiantes
                    soloListar={false}
                    refreshKey={refreshKey}
                    modalidadId={modalidadIdFinal}
                    modalidad={modalidad}
                    modalidadFiltrada={modalidadFiltrada}
                    onAccion={(accion, estudianteSeleccionado) => {
                        if (accion === 'Ver' || accion === 'Eliminar') {
                            const estudianteCompleto = construirEstudianteCompleto(estudianteSeleccionado);
                            setEstudiante(estudianteCompleto);
                            setVistaActual('confirmarEliminacion');
                        }
                    }}
                    onClose={() => handleVolverAOpciones(false, false, setVistaActual, setEstudiante, setAlert)}
                    onVolver={() => handleVolverAOpciones(false, false, setVistaActual, setEstudiante, setAlert)}
                />
            );
        case 'registro':
            return (
                <VistaRegistro 
                    modalidad={estudiante?.modalidad || 'Presencial'}
                    isAdmin={isAdmin}
                    onClose={handleVolverAOpciones}
                />
            );
        case 'modificar':
            return (
                <VistaModificar 
                    idInscripcion={estudiante?.idInscripcion}
                    isAdmin={isAdmin}
                    estudiante={estudiante}
                    onSuccess={() => {
                        setRefreshKey(prev => prev + 1);
                        setVistaActual('lista');
                        setAlert({ text: 'Estudiante modificado exitosamente.', variant: 'success' });
                    }}
                />
            );
        case 'visor': {
            let esConsulta = false;
            let esEliminacion = false;
            if (estudiante?.esConsultaDesdeModificacion) {
                esConsulta = true;
            } else if (estudiante?.esEliminacionDesdeModificacion) {
                esEliminacion = true;
            } else if (!modoModificacion) {
                esConsulta = true;
            }

            const handleModificar = async (datosActualizados, seccion) => {
                if (!datosActualizados.dni) {
                    setAlert({ text: 'El DNI es obligatorio para modificar.', variant: 'error' });
                    return;
                }
                
                let datosParaBackend = {};
                let config = {};

                // SIEMPRE enviar TODOS los datos del estudiante, actualizando solo la sección modificada
                const estudianteCompleto = {
                    // Datos personales
                    nombre: estudiante.nombre || '',
                    apellido: estudiante.apellido || '',
                    dni: estudiante.dni,
                    cuil: estudiante.cuil || '',
                    email: estudiante.email || '',
                    fechaNacimiento: estudiante.fechaNacimiento || null,
                    tipoDocumento: estudiante.tipoDocumento || 'DNI',
                    paisEmision: estudiante.paisEmision || 'Argentina',
                    // Domicilio
                    calle: estudiante.calle || '',
                    numero: estudiante.numero || '',
                    provincia: estudiante.pcia || '',
                    localidad: estudiante.localidad || '',
                    barrio: estudiante.barrio || '',
                    // Académica - SIEMPRE incluir los IDs actuales
                    modalidadId: estudiante.modalidadId || estudiante.modalidad_id || '',
                    planAnioId: estudiante.planAnioId || estudiante.planAnio_id || '',
                    modulosId: estudiante.modulosId || estudiante.modulos_id || '',
                    estadoInscripcionId: estudiante.estadoInscripcionId || estudiante.estadoInscripcion_id || '',
                };

                // Actualizar solo los campos de la sección modificada
                if (seccion === 'academica') {
                    // Usar los IDs que vienen directamente del visor (ya mapeados por los componentes)
                    estudianteCompleto.modalidadId = datosActualizados.modalidadId || estudiante.modalidadId;
                    estudianteCompleto.planAnioId = datosActualizados.planAnioId || estudiante.planAnioId;
                    estudianteCompleto.modulosId = datosActualizados.modulosId || estudiante.modulosId;
                    estudianteCompleto.estadoInscripcionId = datosActualizados.estadoInscripcionId || estudiante.estadoInscripcionId;
                    
                    // Validaciones antes de enviar
                    if (!estudianteCompleto.modalidadId) {
                        setAlert({ text: 'Selecciona una modalidad válida.', variant: 'error' });
                        return;
                    }
                    if (!estudianteCompleto.planAnioId) {
                        setAlert({ text: 'Selecciona un plan válido.', variant: 'error' });
                        return;
                    }
                    if (!estudianteCompleto.modulosId) {
                        setAlert({ text: 'Selecciona un módulo válido.', variant: 'error' });
                        return;
                    }
                    if (!estudianteCompleto.estadoInscripcionId) {
                        setAlert({ text: 'Selecciona un estado de inscripción válido.', variant: 'error' });
                        return;
                    }
                    
                    datosParaBackend = estudianteCompleto;
                } else if (seccion === 'personales') {
                    estudianteCompleto.nombre = datosActualizados.nombre || estudiante.nombre;
                    estudianteCompleto.apellido = datosActualizados.apellido || estudiante.apellido;
                    estudianteCompleto.cuil = datosActualizados.cuil || estudiante.cuil;
                    estudianteCompleto.email = datosActualizados.email || estudiante.email;
                    estudianteCompleto.fechaNacimiento = datosActualizados.fechaNacimiento || estudiante.fechaNacimiento;
                    estudianteCompleto.tipoDocumento = datosActualizados.tipoDocumento || estudiante.tipoDocumento;
                    estudianteCompleto.paisEmision = datosActualizados.paisEmision || estudiante.paisEmision;
                    
                    datosParaBackend = estudianteCompleto;
                } else if (seccion === 'domicilio') {
                    estudianteCompleto.calle = datosActualizados.calle || estudiante.calle;
                    estudianteCompleto.numero = datosActualizados.numero || estudiante.numero;
                    estudianteCompleto.provincia = datosActualizados.pcia || estudiante.pcia;
                    estudianteCompleto.localidad = datosActualizados.localidad || estudiante.localidad;
                    estudianteCompleto.barrio = datosActualizados.barrio || estudiante.barrio;
                    
                    // Validaciones específicas para domicilio
                    if (!estudianteCompleto.provincia || estudianteCompleto.provincia.trim() === '') {
                        setAlert({ text: 'La provincia es obligatoria.', variant: 'error' });
                        return;
                    }
                    if (!estudianteCompleto.localidad || estudianteCompleto.localidad.trim() === '') {
                        setAlert({ text: 'La localidad es obligatoria.', variant: 'error' });
                        return;
                    }
                    if (!estudianteCompleto.barrio || estudianteCompleto.barrio.trim() === '') {
                        setAlert({ text: 'El barrio es obligatorio.', variant: 'error' });
                        return;
                    }
                    
                    // Validar que los IDs académicos estén presentes
                    if (!estudianteCompleto.planAnioId) {
                        setAlert({ text: 'El plan de año es obligatorio para modificar.', variant: 'error' });
                        return;
                    }
                    if (!estudianteCompleto.modalidadId) {
                        setAlert({ text: 'La modalidad es obligatoria para modificar.', variant: 'error' });
                        return;
                    }
                    if (!estudianteCompleto.modulosId) {
                        setAlert({ text: 'El módulo es obligatorio para modificar.', variant: 'error' });
                        return;
                    }
                    if (!estudianteCompleto.estadoInscripcionId) {
                        setAlert({ text: 'El estado de inscripción es obligatorio para modificar.', variant: 'error' });
                        return;
                    }
                    
                    datosParaBackend = estudianteCompleto;
                } else if (seccion === 'documentacion') {
                    // Validación de detalleDocumentacion
                    try {
                        JSON.parse(datosActualizados.detalleDocumentacion);
                    } catch {
                        setAlert({ text: 'Error en el formato de la documentación.', variant: 'error' });
                        return;
                    }
                    const formData = new FormData();
                    // Incluir todos los datos del estudiante en FormData
                    Object.entries(estudianteCompleto).forEach(([key, value]) => {
                        if (value !== null && value !== undefined) {
                            formData.append(key, value);
                        }
                    });
                    formData.append('detalleDocumentacion', datosActualizados.detalleDocumentacion);
                    if (datosActualizados.archivos) {
                        Object.entries(datosActualizados.archivos).forEach(([docName, file]) => {
                            formData.append(docName, file);
                        });
                    }
                    datosParaBackend = formData;
                    config = { headers: { 'Content-Type': 'multipart/form-data' } };
                }

                // Log para depuración
                console.log(`Datos enviados al backend (${seccion}):`, datosParaBackend);

                try {
                    const response = await serviceInscripcion.updateEstd(datosParaBackend, datosActualizados.dni, config);
                    console.log("✅ Estudiante actualizado:", response);

                    if (response.success) {
                        // Actualizar solo los campos modificados en el estado local
                        setEstudiante(prevEstudiante => ({ ...prevEstudiante, ...datosActualizados }));
                        setAlert({ text: 'Datos actualizados correctamente', variant: 'success' });
                    } else {
                        setAlert({ text: response.message || 'Error al actualizar', variant: 'error' });
                    }
                } catch (error) {
                    console.error("❌ Error al modificar estudiante:", error.message);
                    setAlert({ text: 'Error al guardar los cambios. Verifica que todos los campos estén completos.', variant: 'error' });
                }
            };
            return (
                <VistaVisor 
                    estudiante={estudiante}
                    onClose={modoModificacion
                        ? () => handleVolverAOpciones(
                            modoModificacion,
                            modoEliminacion,
                            setVistaActual,
                            setEstudiante,
                            setAlert
                        )
                        : () => handleCerrarVisorAOpciones(
                            setVistaActual,
                            setEstudiante,
                            setAlert,
                            setModoModificacion
                        )
                    }
                    onVolver={() => handleVolverDesdeVisor(
                        vistaAnterior,
                        () => handleVolverABusquedaDNI(setVistaActual, setEstudiante, setAlert, setVistaAnterior),
                        () => handleVolverALista(setVistaActual, setEstudiante, setAlert)
                    )}
                    onModificar={handleModificar}
                    isConsulta={esConsulta}
                    isEliminacion={esEliminacion}
                />
            );
        }
        case 'confirmarEliminacion':
            return (
                <VistaEliminar 
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
                    onClose={() => handleVolverAOpciones(
                        modoModificacion,
                        modoEliminacion,
                        setVistaActual,
                        setEstudiante,
                        setAlert
                    )}
                    onVolver={() => handleVolverAOpciones(
                        modoModificacion,
                        modoEliminacion,
                        setVistaActual,
                        setEstudiante,
                        setAlert
                    )}
                    onEliminar={async (tipoEliminacion) => {
                        try {
                            let response;
                            let mensaje;
                            if (tipoEliminacion === 'fisica') {
                                response = await serviceInscripcion.deleteEstd(estudiante.dni);
                                mensaje = 'Estudiante eliminado permanentemente de la base de datos';
                            } else if (tipoEliminacion === 'logica') {
                                response = await serviceInscripcion.deactivateEstd(estudiante.dni);
                                mensaje = 'Estudiante desactivado exitosamente. El estudiante ya no aparecerá en las listas de consulta';
                            }
                            if (response.error) {
                                setAlert({ text: response.error, variant: 'error' });
                            } else if (response.success || !response.error) {
                                setAlert({ text: mensaje, variant: 'success' });
                                setRefreshKey(prev => prev + 1);
                                setTimeout(() => {
                                    handleVolverALista(setVistaActual, setEstudiante, setAlert);
                                }, 2000);
                            } else {
                                setAlert({ text: 'Ocurrió un error inesperado durante la eliminación', variant: 'error' });
                            }
                        } catch {
                            setAlert({ text: 'Error al procesar la eliminación del estudiante', variant: 'error' });
                        }
                    }}
                />
            );
        default:
            return null;
    }
}


// Documentación de flujo de props:
// - modalidadId: number (id de modalidad, preferido para filtrado global, viene desde Preinscripcion/GestionCRUD)
// - modalidad: string (nombre de modalidad, solo para mostrar o fallback)
// - modalidadFiltrada: string (nombre de modalidad filtrada para usuarios no admin)
GestionCRUDContenido.propTypes = {
  isAdmin: PropTypes.bool,
  onClose: PropTypes.func,
  vistaInicial: PropTypes.string,
  soloListar: PropTypes.bool,
  modalidad: PropTypes.string,
  modalidadId: PropTypes.number, // <-- validación agregada
  user: PropTypes.object,
  vistaActual: PropTypes.string.isRequired,
  setVistaActual: PropTypes.func.isRequired,
  estudiante: PropTypes.object,
  setEstudiante: PropTypes.func.isRequired,
  alert: PropTypes.object,
  setAlert: PropTypes.func.isRequired,
  vistaAnterior: PropTypes.string,
  setVistaAnterior: PropTypes.func,
  refreshKey: PropTypes.number,
  setRefreshKey: PropTypes.func,
  modoModificacion: PropTypes.bool,
  setModoModificacion: PropTypes.func,
  modoEliminacion: PropTypes.bool
};

export default GestionCRUDContenido;
