import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import '../estilos/estilosInscripcion.css';
import AccionesFormulario from '../components/AccionesFormulario';
import GestionCRUD from '../components/GestionCRUD';
import GestionEstudiante from './GestionEstudiante';
import OpcionesAccion from '../components/OpcionesAccion';
import { Logo } from '../components/Logo';

const Preinscripcion = ({ isAdmin }) => {
    const [searchParams] = useSearchParams();
    const estudianteParam = searchParams.get('estudiante');
    const [accion, setAccion] = useState(null);

    const renderHeader = () => (
        <div className="header-inscripcion">
            <Logo className="logo-inscripcion" />
            <h1 className="titulo-principal">SISTEMA DE GESTIÓN DE ESTUDIANTES</h1>
            <p className="subtitulo">Preinscripción de Estudiantes - CEIJA 5</p>
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
            console.log('Preinscripcion_backup - no hay accion, mostrando AccionesFormulario');
            return (
                <AccionesFormulario
                    setAccion={setAccion}
                    isAdmin={isAdmin}
                />
            );
        }

        console.log('Preinscripcion_backup - accion actual:', accion);
        switch (accion) {
            case 'Consultar':
                return (
                    <OpcionesAccion
                        accion="Consultar"
                        onSeleccion={(opcion) => {
                            if (opcion === 'dni') {
                                setAccion('ConsultarPorDNI');
                            } else if (opcion === 'lista') {
                                setAccion('ConsultarLista');
                            }
                        }}
                        onClose={() => setAccion(null)}
                    />
                );
            case 'ConsultarPorDNI':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="busquedaDNI" // Ir directamente a búsqueda por DNI
                    />
                );
            case 'ConsultarLista':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="lista" // Ir directamente a lista
                    />
                );
            case 'Modificar':
                return (
                    <OpcionesAccion
                        accion="Modificar"
                        onSeleccion={(opcion) => {
                            if (opcion === 'dni') {
                                setAccion('ModificarPorDNI');
                            } else if (opcion === 'lista') {
                                setAccion('ModificarLista');
                            }
                        }}
                        onClose={() => setAccion(null)}
                    />
                );
            case 'ModificarPorDNI':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="busquedaModificar" // Ir directamente a búsqueda para modificar
                    />
                );
            case 'ModificarLista':
                return (
                    <GestionCRUD
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)}
                        vistaInicial="listaModificar" // Ir directamente a lista para modificar
                    />
                );
            case 'Eliminar':
                console.log('Preinscripcion_backup - Renderizando OpcionesAccion para Eliminar');
                return (
                    <OpcionesAccion
                        accion="Eliminar"
                        onSeleccion={(opcion) => {
                            console.log('OpcionesAccion - Eliminación seleccionada:', opcion);
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
                        vistaInicial="busquedaDNIEliminar" // Ir directamente a búsqueda para eliminar
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
                return (
                    <GestionEstudiante
                        onClose={() => setAccion(null)}
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
