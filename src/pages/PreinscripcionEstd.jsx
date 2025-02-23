import { useSearchParams } from 'react-router-dom';
import FormularioInscripcionEst from './FormularioInscripcionEst';
import '../estilos/estilosInscripcion.css';


const PreinscripcionEst = () => {
    const [searchParams] = useSearchParams();
    const modalidad = searchParams.get('modalidad');
    
    if (!modalidad) {
        return <p>Error: Parámetro de modalidad no encontrado en la URL.</p>;
    }
    
    return (
        <div className="inscripcion-container">
            <h2>{` Inscripción Estudiante ${modalidad}`}</h2>
           
            <FormularioInscripcionEst modalidad={modalidad}/>
        </div>
    );
};

export default PreinscripcionEst;