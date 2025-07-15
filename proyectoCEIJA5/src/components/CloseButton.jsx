import PropTypes from 'prop-types';
import '../estilos/botonCloseVolver.css'; // Importa los estilos propios

const CloseButton = ({ onClose }) => {
    return (
        <button className="cerrar-button modal-close" onClick={onClose}>✖</button>
    );
};

CloseButton.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default CloseButton;
