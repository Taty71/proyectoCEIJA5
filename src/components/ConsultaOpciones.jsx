import PropTypes from 'prop-types';

const ConsultaOpciones = ({ onSeleccion }) => {
    return (
        <div>
            <button onClick={() => onSeleccion('dni')}>Consulta por DNI</button>
            <button onClick={() => onSeleccion('inscripciones')}>Consulta Inscripciones Estudiantes</button>
        </div>
    );
};

ConsultaOpciones.propTypes = {
    onSeleccion: PropTypes.func.isRequired,
};

export default ConsultaOpciones;