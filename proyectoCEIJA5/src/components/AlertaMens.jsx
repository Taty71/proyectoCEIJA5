import PropTypes from 'prop-types';
import '../estilos/alerta.css';

const AlertaMens = ({ text, variant }) => {
    console.log(` ${text}, ${variant}`); // Debug log
    return (
        <div className={`alert ${variant}`}>
            {text}
        </div>
    );
};
AlertaMens.propTypes = {
    text: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
};
export default AlertaMens;
