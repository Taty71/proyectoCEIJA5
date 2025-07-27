import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import ModalidadModal from './ModalidadModal';
import '../estilos/modalM.css';

const Modalidad = ({ isOpen, onClose }) => {
    const navigate = useNavigate(); // Hook para redirección
    const location = useLocation(); // Hook para obtener la ruta actual
    const [modalidad, setModalidad] = useState('');
    // Obtener el usuario y su rol
    let user = null;
    try {
      // Si usas contexto, reemplaza por tu hook/contexto real
      user = JSON.parse(localStorage.getItem('user'));
    } catch {
      user = null;
    }
    const rol = user?.rol;

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

    // Definir las opciones según el rol
    let opciones = [];
    if (rol === 'administrador') {
      opciones = ['Presencial', 'Semipresencial'];
    } else if (rol === 'secretario') {
      opciones = ['Presencial'];
    } else if (rol === 'coordinador') {
      opciones = ['Semipresencial'];
    }
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <button className="modal-close" onClick={handleModalClose}>✖</button>
          <h2>Elija una Modalidad</h2>
          {opciones.map((opcion) => (
            <button
              key={opcion}
              onClick={() => handleModalOpen(opcion)}
              className="modalidad-button"
            >
              {opcion}
            </button>
          ))}
          {location.pathname !== '/preinscripcion-estd' && modalidad && (
            <ModalidadModal modalidad={modalidad} onClose={handleModalClose} />
          )}
        </div>
      </div>
    );
};

Modalidad.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modalidad;