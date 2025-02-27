import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import service from "../services/service";
import BotonCargando from "./BotonCargando";

const MateriasSelector = ({ idAreaEstudio }) => {
    console.log("Valores enviados a la API para materias:", { idAreaEstudio });
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterias = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await service.getMateriasPorArea(idAreaEstudio);
                console.log("Respuesta de la API de materias:", response);

                if (response && response.status === "success" && Array.isArray(response.data)) {
                    setMaterias(response.data);
                } else {
                    setError("No se encontraron materias para esta área de estudio.");
                }
            } catch (error) {
                console.error("Error al obtener materias:", error);
                setError("Hubo un error al obtener las materias.");
            } finally {
                setLoading(false);
            }
        };

        if (idAreaEstudio) {
            fetchMaterias();
        }
        console.log("idAreaEstudio recibido en MateriasSelector:", idAreaEstudio);
    }, [idAreaEstudio]);

    return (
        <div className="form-group">
            <label htmlFor="materias">Materias:</label>
            <div>
                {loading ? (
                    <p><BotonCargando /></p>
                ) : error ? (
                    <p>{error}</p>
                ) : materias.length > 0 ? (
                    <ul>
                        {materias.map((materia) => (
                            <li key={materia.id}>{materia.nombre}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay materias disponibles.</p>
                )}
            </div>
        </div>
    );
};

MateriasSelector.propTypes = {
    idAreaEstudio: PropTypes.number.isRequired,
};

export default MateriasSelector;