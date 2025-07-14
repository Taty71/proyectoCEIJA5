import PropTypes from 'prop-types';

const CloseButton = ({ onClose }) => {
    return (
        <button className="modal-close" onClick={onClose}>✖</button>
    );
};

CloseButton.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default CloseButton;
