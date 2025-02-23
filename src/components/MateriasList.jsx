import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import service from '../services/service';
import AlertaMens from './AlertaMens';
import '../estilos/estilosDocumentacion.css';

const MateriasList = ({ idAnioPlan }) => {
    const [materias, setMaterias] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const response = await service.getMaterias(idAnioPlan);
                if (response.error) {
                    setError(response.message);
                } else {
                    setMaterias(response.data);
                }
            } catch (error) {
                console.error('Error al obtener las materias:', error);
                setError('Hubo un error al obtener las materias.');
            }
        };

        fetchMaterias();
    }, [idAnioPlan]);

    return (
        <div>
            {error && <AlertaMens text={error} variant="error" />}
            <h3>Materias</h3>
            <ul>
                {materias.map((materia) => (
                    <li key={materia.id}>
                        {materia.materia} - Área de Estudio: {materia.idAreaEstudio}
                    </li>
                ))}
            </ul>
        </div>
    );
};

MateriasList.propTypes = {
    idAnioPlan: PropTypes.number.isRequired,
};

export default MateriasList;