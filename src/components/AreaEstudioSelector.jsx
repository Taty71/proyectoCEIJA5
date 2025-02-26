import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BotonCargando from './BotonCargando';
import service from '../services/service';
import AlertaMens from './AlertaMens';

const AreaEstudioSelector = ({ idModulo, modalidadId }) => {
    const [areasEstudio, setAreasEstudio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alerta] = useState(false);
    const [idAreaEstudio, setIdAreaEstudio] = useState('');

    const handleAreaEstudioChange = (event) => {
        setIdAreaEstudio(event.target.value);
    };
    useEffect(() => {
        const fetchAreasEstudio = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await service.getAreasEstudio(idModulo, modalidadId);
                console.log("Respuesta de la API:", response);
                
                // Verifica si la respuesta tiene el formato correcto
                if (response && Array.isArray(response)) {
                    setAreasEstudio(response);
                } else if (response.data && Array.isArray(response.data)) {
                    setAreasEstudio(response.data);
                } else {
                    setError('La respuesta no es un array de áreas de estudio');
                }
            } catch {
                setError(alerta ? 'Hubo un error al obtener las áreas de estudio.' : null);
            } finally {
                setLoading(false);
            }
        };
   
        if (idModulo && modalidadId) {
            fetchAreasEstudio();
        }
    }, [idModulo, modalidadId, alerta]);
    return (
        <div className="form-group">
            <label htmlFor="areaEstudio">Seleccionar Área de Estudio:</label>
            {loading ? (
                <BotonCargando /> // Muestra un mensaje mientras carga
            ) : error ? (
               <AlertaMens mensaje={error} /> // Muestra un mensaje de error si ocurre un problema
            ) : (
                <select id={idModulo} value={idAreaEstudio} onChange={handleAreaEstudioChange}>
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
        </div>
    );
};

AreaEstudioSelector.propTypes = {
    idModulo: PropTypes.number.isRequired,
    modalidadId: PropTypes.number.isRequired,
    idAreaEstudio: PropTypes.number.isRequired,
    handleAreaEstudioChange: PropTypes.func.isRequired,
};

export default AreaEstudioSelector;