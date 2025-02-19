import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../estilos/Modal.css';

const Modalidad = ({ isOpen, onClose }) => {
   
    const navigate = useNavigate(); // Hook para redirección

    const handleModalOpen = (modalidadSeleccionada) => {
        // Redirige a la página de inscripción con la modalidad como parámetro
        navigate(`/dashboard/formulario-inscripcion-adm?modalidad=${modalidadSeleccionada}`);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>✖</button>
                <h2>Elija una Modalidad</h2>
                <button onClick={() => handleModalOpen('Presencial')} className="modalidad-button">Presencial</button> 
                <button onClick={() => handleModalOpen('Semipresencial')} className="modalidad-button">Semipresencial</button> 
            </div>
        </div>
    );
};

Modalidad.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modalidad;
