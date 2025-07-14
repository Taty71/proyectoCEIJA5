import PropTypes from 'prop-types';
import "../estilos/consultaOpc.css";

const ConsultaOpciones = ({ onSeleccion }) => {
    return (
        <div className="consultaOpcContainer">
            <button className="consultaOpcButton" onClick={() => onSeleccion('dni')}>Consulta por DNI</button>
            <button className="consultaOpcButton" onClick={() => onSeleccion('inscripciones')}>Consulta  Estudiantes Inscripctos</button>
        </div>
    );
};

ConsultaOpciones.propTypes = {
    onSeleccion: PropTypes.func.isRequired,
};

export default ConsultaOpciones;