import PropTypes from 'prop-types';
import {DatosPersonales} from '../components/DatosPersonales';
import {Domicilio} from '../components/Domicilio';

const ConsultaEstd = ({ estudiante }) => {
    if (!estudiante) {
        return <p>No se encontraron datos para el estudiante.</p>;
    }

    return (
        <div>
            <h2>Datos del Estudiante</h2>
            <DatosPersonales estudiante={estudiante} />
            <Domicilio estudiante={estudiante} />
            <div>
                <h3>Modalidad: {estudiante.modalidad}</h3>
                <p>Año / Plan: {estudiante.plan || estudiante.anio}</p>
                <p>Módulo: {estudiante.modulo }</p>
            </div>
        </div>
    );
};

ConsultaEstd.propTypes = {
    estudiante: PropTypes.object,
};

export default ConsultaEstd;
