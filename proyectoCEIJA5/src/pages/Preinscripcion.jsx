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
import MensajeError from '../utils/MensajeError'; // Importa el componente MensajeError

const Preinscripcion = ({ isAdmin }) => {
    const [searchParams] = useSearchParams();
    const modalidad = searchParams.get('modalidad') || 'DefaultModalidad';
    const [estudianteEncontrado, setEstudianteEncontrado] = useState(null);
    const [accion, setAccion] = useState('Registrar');
    const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
    const [error, setError] = useState(null);

   const handleEstudianteEncontrado = (resultado) => {
        if (!resultado || resultado.error) {
            setError(resultado?.error || 'No se encontró un estudiante con ese DNI.');
           setEstudianteEncontrado(null);
         } else {
           setError(null);
        setEstudianteEncontrado(resultado);   // guarda TODO el objeto
      }
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
                            {/* ① Formulario de búsqueda */}
                            <BusquedaDNI
                                onEstudianteEncontrado={handleEstudianteEncontrado}
                                onVolver={() => setConsultaSeleccionada(null)}
                                accion={accion}
                                isAdmin={true}
                                />
                            {/* Resultado */}
                            {estudianteEncontrado && estudianteEncontrado.success ? (
                                <ConsultaEstd data={estudianteEncontrado} onClose={() => setEstudianteEncontrado(null)} />
                            ) : (
                                error && <MensajeError mensaje={error} /> // Muestra el mensaje solo si hay un error
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
            <h2>
                {`${accion} Inscripción Estudiante `}
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