import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import FormularioInscripcion from './FormularioInscripcion';
import '../estilos/estilosInscripcion.css';
import BusquedaDNI from '../components/BusquedaDNI';
import AccionesFormulario from '../components/AccionesFormulario';
import ListaEstudiantes from './ListaEstudiantes';
import ConsultaEstd from './ConsultaEstd';
import ConsultaOpciones from '../components/ConsultaOpciones';
import MensajeError from '../utils/MensajeError';
import {Logo} from '../components/Logo';

const Preinscripcion = ({ isAdmin }) => {
    const [searchParams] = useSearchParams();
    const modalidad = searchParams.get('modalidad') || 'DefaultModalidad';
    const [accion, setAccion] = useState(null); // No hay acción seleccionada por defecto
    const [estudianteEncontrado, setEstudianteEncontrado] = useState(null);
    const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
    const [error, setError] = useState(null);

    const handleEstudianteEncontrado = (resultado) => {
        if (!resultado || resultado.error) {
            setError(resultado?.error || 'No se encontró un estudiante con ese DNI.');
            setEstudianteEncontrado(null);
        } else {
            setError(null);
            setEstudianteEncontrado(resultado);
        }
    };

    const handleSeleccionConsulta = (opcion) => {
        setConsultaSeleccionada(opcion);
    };

    const renderContent = () => {
        if (!accion) {
            return null; // Si no hay acción seleccionada, no renderiza nada
        }

        switch (accion) {
            case 'Registrar':
                return (
                    <FormularioInscripcion
                        modalidad={modalidad}
                        accion={accion}
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)} // Cierra el formulario y vuelve a las acciones
                    />
                );
            case 'Modificar':
                return (
                    <>
                        <BusquedaDNI onEstudianteEncontrado={handleEstudianteEncontrado} accion={accion} isAdmin={isAdmin} />
                        {estudianteEncontrado && (
                            <FormularioInscripcion
                                modalidad={modalidad}
                                estudianteEncontrado={estudianteEncontrado}
                                accion={accion}
                                isAdmin={isAdmin}
                                onClose={() => setAccion(null)}
                            />
                        )}
                    </>
                );
            case 'Consultar':
                return (
                    <>
                        <ConsultaOpciones onSeleccion={handleSeleccionConsulta} />
                        {consultaSeleccionada === 'dni' && (
                            <>
                                <BusquedaDNI
                                    onEstudianteEncontrado={handleEstudianteEncontrado}
                                    onVolver={() => setConsultaSeleccionada(null)}
                                    accion={accion}
                                    isAdmin={isAdmin}
                                />
                                {estudianteEncontrado && estudianteEncontrado.success ? (
                                    <ConsultaEstd data={estudianteEncontrado} onClose={() => setEstudianteEncontrado(null)} />
                                ) : (
                                    error && <MensajeError mensaje={error} />
                                )}
                            </>
                        )}
                        {consultaSeleccionada === 'inscripciones' && (
                            <ListaEstudiantes
                                accion={accion}
                                isAdmin={isAdmin}
                                onClose={() => setConsultaSeleccionada(null)} // Cierra el modal
                                onVolver={() => setConsultaSeleccionada(null)} // Vuelve a la selección de consulta
                            />
                        )}
                    </>
                );
            case 'Eliminar':
                return (
                    <>
                        <BusquedaDNI onEstudianteEncontrado={handleEstudianteEncontrado} accion={accion} isAdmin={isAdmin} />
                        {estudianteEncontrado && (
                            <ListaEstudiantes estudianteEncontrado={estudianteEncontrado} accion={accion} isAdmin={isAdmin} />
                        )}
                    </>
                );
            case 'Listar':
                return (
                    <ListaEstudiantes
                        accion={accion}
                        isAdmin={isAdmin}
                        onClose={() => setAccion(null)} // Función para cerrar el modal
                        onVolver={() => setAccion(null)} // Función para volver a la acción anterior
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="inscripcion-container">
              <Logo />
            <h2>
                {accion ? `${accion} Inscripción Estudiante` : 'Seleccione una acción'}
                <span className="modalidad-span">Modalidad: {modalidad}</span>
            </h2>

            {isAdmin && <AccionesFormulario setAccion={setAccion} />}
            {renderContent()}
        </div>
    );
};

Preinscripcion.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
};

export default Preinscripcion;