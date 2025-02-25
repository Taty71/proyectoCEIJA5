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

const Preinscripcion = ({ isAdmin }) => {
    const [searchParams] = useSearchParams();
    const modalidad = searchParams.get('modalidad') || 'DefaultModalidad';
    const [estudianteEncontrado, setEstudianteEncontrado] = useState(null);
    const [accion, setAccion] = useState('Registrar');
    const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);

    const handleEstudianteEncontrado = (estudiante) => {
        setEstudianteEncontrado(estudiante);
    };
    const handleSeleccionConsulta = (opcion) => {
        setConsultaSeleccionada(opcion);
    };

    const renderContent = () => {
        if (isAdmin) {
            switch (accion) {
                case 'Registrar':
                    return <FormularioInscripcion modalidad={modalidad} accion={accion} isAdmin={true} />;
                case 'Modificar':
                    return (
                        <>
                            <BusquedaDNI onEstudianteEncontrado={handleEstudianteEncontrado} accion={accion} isAdmin={true} />
                            {estudianteEncontrado && (
                                <FormularioInscripcion
                                    modalidad={modalidad}
                                    estudianteEncontrado={estudianteEncontrado}
                                    accion={accion}
                                    isAdmin={true}
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
                                    <BusquedaDNI onEstudianteEncontrado={handleEstudianteEncontrado} />
                                    {estudianteEncontrado ? (
                                        <ConsultaEstd estudiante={estudianteEncontrado} />
                                    ) : (
                                        <p>No se encontró un estudiante con ese DNI.</p>
                                    )}
                                </>
                            )}
                            {consultaSeleccionada === 'inscripciones' && <ListaEstudiantes accion={accion} isAdmin={true} />}
                        </>
                    );
                case 'Eliminar':
                    return (
                        <>
                            <BusquedaDNI onEstudianteEncontrado={handleEstudianteEncontrado} accion={accion} isAdmin={true} />
                            {estudianteEncontrado && (
                                <ListaEstudiantes estudianteEncontrado={estudianteEncontrado} accion={accion} isAdmin={true} />
                            )}
                        </>
                    );
                case 'Listar':
                    return <ListaEstudiantes accion={accion} isAdmin={true} />;
                default:
                    return null;
            }
        } else {
            return <FormularioInscripcion modalidad={modalidad} accion="Registrar" isAdmin={false} />;
        }
    };
    

    return (
        <div className="inscripcion-container">
            <h2>{`${accion} Inscripción Estudiante ${modalidad}`}</h2>
            {isAdmin && <AccionesFormulario setAccion={setAccion} />}
            {renderContent()}
        </div>
    );
};

Preinscripcion.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
};

export default Preinscripcion;