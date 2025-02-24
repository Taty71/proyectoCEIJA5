import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import service from '../services/service';
import AlertaMens from './AlertaMens';
import '../estilos/estilosDocumentacion.css';

const MateriasList = ({ idAnioPlan, modalidad, selectedModulo }) => {
    const [materias, setMaterias] = useState([]);
    const [selectedAreaEstudio, setSelectedAreaEstudio] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const response = await service.getMaterias(idAnioPlan, selectedModulo);
                if (response.error) {
                    setError(response.message);
                } else {
                    setMaterias(response.data || []);
                }
            } catch (error) {
                console.error('Error al obtener las materias:', error);
                setError('Hubo un error al obtener las materias.');
            }
        };

        if (modalidad === 'Presencial') {
            fetchMaterias();
        } else if (modalidad === 'Semipresencial' && selectedModulo) {
            fetchMaterias();
        }
    }, [idAnioPlan, modalidad, selectedModulo]);

    const handleAreaEstudioChange = (e) => {
        setSelectedAreaEstudio(e.target.value);
    };

    return (
        <div>
            {error && <AlertaMens text={error} variant="error" />}
            {materias.length > 0 && <h3>Materias</h3>}
            {modalidad === 'Semipresencial' ? (
                <div>
                    {selectedModulo && (
                        <div>
                            <label htmlFor="areaEstudio">Seleccionar Área de Estudio:</label>
                            <select id="areaEstudio" value={selectedAreaEstudio} onChange={handleAreaEstudioChange}>
                                <option value="">Seleccionar Área de Estudio</option>
                                {materias.map((materia) => (
                                    <option key={materia.idAreaEstudio} value={materia.idAreaEstudio}>
                                        {materia.areaEstudio}
                                    </option>
                                ))}
                            </select>
                            {selectedAreaEstudio && (
                                <ul>
                                    {materias
                                        .filter((materia) => materia.idAreaEstudio === parseInt(selectedAreaEstudio))
                                        .map((materia) => (
                                            <li key={materia.id}>
                                                {materia.materia}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <ul>
                    {materias.map((materia) => (
                        <li key={materia.id}>
                            {materia.materia} - Área de Estudio: {materia.idAreaEstudio}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

MateriasList.propTypes = {
    idAnioPlan: PropTypes.number.isRequired,
    modalidad: PropTypes.string.isRequired,
    selectedModulo: PropTypes.string,
};

export default MateriasList;