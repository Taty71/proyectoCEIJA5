import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import ModalidadModal from './ModalidadModal';
import '../estilos/modalM.css';

const Modalidad = ({ isOpen, onClose }) => {
    const navigate = useNavigate(); // Hook para redirección
    const location = useLocation(); // Hook para obtener la ruta actual
    const [modalidad, setModalidad] = useState('');

    const handleModalOpen = (modalidadSeleccionada) => {
        setModalidad(modalidadSeleccionada);
        if (location.pathname === '/dashboard') {
            // Redirige a la página de inscripción con la modalidad como parámetro
            navigate(`/dashboard/formulario-inscripcion-adm?modalidad=${modalidadSeleccionada}`);
        } else {
            // Mostrar ModalidadModal si no está en el dashboard
            setModalidad(modalidadSeleccionada);
        }
    };

    const handleModalClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close" onClick={handleModalClose}>✖</button>
                <h2>Elija una Modalidad</h2>
                <button onClick={() => handleModalOpen('Presencial')} className="modalidad-button">Presencial</button>
                <button onClick={() => handleModalOpen('Semipresencial')} className="modalidad-button">Semipresencial</button>
                {location.pathname !== '/preinscripcion-estd' && modalidad && <ModalidadModal modalidad={modalidad} onClose={handleModalClose} />}
            </div>
        </div>
    );
};

Modalidad.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modalidad;