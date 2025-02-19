import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FormularioInscripcionAdm from './FormularioInscripcionAdm';
import '../estilos/estilosInscripcion.css';
import BusquedaDNI from '../components/BusquedaDNI';
import AccionesFormulario from '../components/AccionesFormulario';
import ListaEstudiantes from './ListaEstudiantes';

const Preinscripcion = () => {
    const [searchParams] = useSearchParams();
    const modalidad = searchParams.get('modalidad');
    const [estudianteEncontrado, setEstudianteEncontrado] = useState('');
    const [accion, setAccion] = useState('Registrar');

    const handleEstudianteEncontrado = (estudiante) => {
        setEstudianteEncontrado(estudiante);
    };

    const renderContent = () => {
        console.log("Acción:", accion);
        switch (accion) {
            case 'Registrar':
                return <FormularioInscripcionAdm modalidad={modalidad} estudianteEncontrado={estudianteEncontrado} accion={accion} />;
            case 'Consultar':
                return (
                    <>
                        <BusquedaDNI onEstudianteEncontrado={handleEstudianteEncontrado} />
                        <ListaEstudiantes estudianteEncontrado={estudianteEncontrado} />
                    </>
                );
            case 'Modificar':
                return <FormularioInscripcionAdm modalidad={modalidad} estudianteEncontrado={estudianteEncontrado} accion={accion} />;
            case 'Eliminar':
                return <ListaEstudiantes estudianteEncontrado={estudianteEncontrado} />;
            case 'Listar':
                return <ListaEstudiantes />;
            default:
                return null;
        }
    };

    return (
        <div className="inscripcion-container">
            <h2>{`${accion} Inscripción Estudiante ${modalidad}`}</h2>
            <AccionesFormulario setAccion={setAccion} />
            {renderContent()}
        </div>
    );
};

export default Preinscripcion;