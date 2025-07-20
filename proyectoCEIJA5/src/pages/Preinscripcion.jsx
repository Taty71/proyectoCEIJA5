import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import '../estilos/estilosInscripcion.css';
import '../estilos/preinscripcionHeader.css';
import AccionesFormulario from '../components/AccionesFormulario';
import OpcionesAccion from '../components/OpcionesAccion';
import GestionCRUD from '../components/GestionCRUD';
import GestionEstudiante from './GestionEstudiante';
import { Logo } from '../components/Logo';

const Preinscripcion = ({ isAdmin }) => {
    const [searchParams] = useSearchParams();
    const estudianteParam = searchParams.get('estudiante');
    const modalidadFromUrl = searchParams.get('modalidad'); // Capturar modalidad desde URL
    const [accion, setAccion] = useState(null);
    const [modalidadSeleccionada, setModalidadSeleccionada] = useState(modalidadFromUrl);

    const renderHeader = () => (
        <div className="header-inscripcion">
            <Logo className="logo-inscripcion" />
            <h1 className="titulo-principal">SISTEMA DE GESTIÓN DE ESTUDIANTES</h1>
            <p className="subtitulo">Inscripción de Estudiantes - CEIJA 5</p>
            {modalidadSeleccionada && (
                <div className="modalidad-header-info">
                    <span className="modalidad-badge">Modalidad: {modalidadSeleccionada}</span>
                    {modalidadFromUrl && (
                        <button 
                            className="cambiar-modalidad-btn"
                            onClick={() => setModalidadSeleccionada(null)}
                            title="Cambiar modalidad"
                        >
                            Cambiar
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        if (estudianteParam) {
            return (
                <GestionEstudiante 
                    estudianteData={JSON.parse(decodeURIComponent(estudianteParam))}
                />
            );
        }

        if (!accion) {
            return (
                <AccionesFormulario
                    setAccion={setAccion}
                    isAdmin={isAdmin}
                />
            );
        }

        switch (accion) {
            case 'Consultar':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="opciones" // Cambiar a opciones para mostrar ConsultaOpciones
                    />
                );
            case 'Modificar':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="opcionesModificar" // Usar las opciones de modificación
                    />
                );
            case 'ModificarPorDNI':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="busquedaDNI" // Ir directamente a búsqueda para modificar
                        esModificacion={true} // Indicar que es modo modificación
                    />
                );
            case 'ModificarLista':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="listaModificar" // Ir directamente a lista para modificar
                        esModificacion={true} // Indicar que es modo modificación
                    />
                );
            case 'Eliminar':
                return (
                    <OpcionesAccion
                        accion="Eliminar"
                        onSeleccion={(opcion) => {
                            if (opcion === 'dni') {
                                setAccion('EliminarPorDNI');
                            } else if (opcion === 'lista') {
                                setAccion('EliminarLista');
                            }
                        }}
                        onClose={() => setAccion(null)}
                    />
                );
            case 'EliminarPorDNI':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="opcionesEliminar" // Ir al menú de opciones de eliminación
                    />
                );
            case 'EliminarLista':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="listaEliminar" // Ir directamente a lista para eliminar
                    />
                );
            case 'Registrar':
                if (!modalidadSeleccionada) {
                    return (
                        <div className="selector-modalidad-container">
                            <h2>Seleccione la Modalidad de Inscripción</h2>
                            <div className="modalidad-buttons">
                                <button 
                                    className="modalidad-button"
                                    onClick={() => setModalidadSeleccionada('Presencial')}
                                >
                                    Modalidad Presencial
                                </button>
                                <button 
                                    className="modalidad-button"
                                    onClick={() => setModalidadSeleccionada('Semipresencial')}
                                >
                                    Modalidad Semipresencial
                                </button>
                            </div>
                            <button 
                                className="button-volver"
                                onClick={() => setAccion(null)}
                            >
                                Volver
                            </button>
                        </div>
                    );
                }
                return (
                    <GestionEstudiante
                        modalidad={modalidadSeleccionada}
                        accion="Registrar"
                        isAdmin={isAdmin}
                        onClose={() => {
                            setAccion(null);
                            // Solo resetear modalidad si no vino desde URL
                            if (!modalidadFromUrl) {
                                setModalidadSeleccionada(null);
                            }
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="container-preinscripcion">
            {renderHeader()}
            <div className="contenido-principal">
                {renderContent()}
            </div>
        </div>
    );
};

Preinscripcion.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
};

export default Preinscripcion;
