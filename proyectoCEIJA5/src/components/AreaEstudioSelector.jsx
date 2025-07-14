import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MateriasSelector from './MateriasSelector';
import BotonCargando from './BotonCargando';
import AlertaMens from './AlertaMens';
import serviceObtenerAcad from '../services/serviceObtenerAcad';

const AreaEstudioSelector = ({ idModulo, modalidadId }) => {
    console.log("Valores enviados a la API:", { idModulo, modalidadId });
  
    const [areasEstudio, setAreasEstudio] = useState([]);
    const [loading] = useState(false);
    const [error] = useState(null);
    const [idAreaEstudio, setIdAreaEstudio] = useState("");
   
    const handleAreaEstudioChange = (e) => {
        setIdAreaEstudio(Number(e.target.value)); 
    };
    
  useEffect(() => {
    const fetchAreas = async () => {
        try {
            const response = await serviceObtenerAcad.getAreasEstudio(idModulo); // Llamada a la API con idModulo
            // La API devuelve directamente un array
            if (Array.isArray(response)) {
                setAreasEstudio(response);
            } else {
                console.error("La respuesta no es un array de áreas:", response);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    fetchAreas();
}, [idModulo]);
    
    return (
        <div className="form-group">
            <label htmlFor="areaEstudio">Seleccionar Área de Estudio:</label>
            
            {loading ? (
                <BotonCargando /> // Muestra un spinner o mensaje de carga
            ) : error ? (
                <AlertaMens mensaje={error} /> // Muestra un mensaje de error
            ) : (
                <select id="areaEstudio" value={idAreaEstudio || ""} onChange={handleAreaEstudioChange}>
                    <option value="">Seleccionar Área de Estudio</option>
                    {areasEstudio && areasEstudio.length > 0 ? (
                        areasEstudio.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.nombre}
                            </option>
                        ))
                    ) : (
                        <option value="">No hay áreas de estudio disponibles</option>
                    )}
                </select>
            )}

    {idAreaEstudio ? (
        <MateriasSelector idAreaEstudio={idAreaEstudio} handleChange={handleAreaEstudioChange} />
    ) : (
        <p>No hay materias cargadas.</p>
    )}
</div>
    )
}

AreaEstudioSelector.propTypes = {
    idModulo: PropTypes.number.isRequired,
    modalidadId: PropTypes.number.isRequired,
    idAreaEstudio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AreaEstudioSelector;
