import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import service from '../services/service';
import MateriasSelector from './MateriasSelector';
import BotonCargando from './BotonCargando';
import AlertaMens from './AlertaMens';

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
    const fetchMaterias = async () => {
        try {
            // Usamos el estado idAreaEstudio para pasar como parámetro
            const response = await service.getAreasEstudio (Number(idModulo)); // Llamada a la API con idAreaEstudio
            
            if (response.status === "success" && Array.isArray(response.data)) {
                setAreasEstudio(response.data); // Guardamos las materias en el estado
            } else {
                console.error("Error al obtener las materias:", response.message);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    fetchMaterias();
}, [idModulo]); // Solo se ejecuta cuando cambia idAreaEstudio
    
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
                    {areasEstudio.length > 0 ? (
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
        <p>No hay área de estudio seleccionada.</p>
    )}
</div>
    )
}

AreaEstudioSelector.propTypes = {
    idModulo: PropTypes.number.isRequired,
    modalidadId: PropTypes.number.isRequired,
    idAreaEstudio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    handleAreaEstudioChange: PropTypes.func.isRequired,
};

export default AreaEstudioSelector;
