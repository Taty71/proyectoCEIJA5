import VisorEstudiante from './VisorEstudiante';
import PropTypes from 'prop-types';
import "../estilos/Modal.css"; // Asegúrate de que este archivo exista y tenga los estilos necesarios

import '../estilos/visorEstudiante.css';// Asegúrate de que este archivo exista y tenga los estilos necesarios
const VistaVisor = ({ estudiante, onClose, onVolver, onModificar, isConsulta, isEliminacion, modalidadId, modalidadFiltrada }) => (
    <VisorEstudiante 
        estudiante={estudiante}
        onClose={onClose}
        onVolver={onVolver}
        onModificar={onModificar}
        isConsulta={isConsulta}
        isEliminacion={isEliminacion}
        modalidadId={modalidadId}
        modalidadFiltrada={modalidadFiltrada}
    />
);

VistaVisor.propTypes = {
    estudiante: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onVolver: PropTypes.func.isRequired,
    onModificar: PropTypes.func,
    isConsulta: PropTypes.bool,
    isEliminacion: PropTypes.bool,
    modalidadId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    modalidadFiltrada: PropTypes.string
};

export default VistaVisor;
