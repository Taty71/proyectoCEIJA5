// Importamos los módulos necesarios
import { ClimbingBoxLoader } from 'react-spinners'; // Importa el spinner que prefieras
import '../estilos/modal.css';
import '../estilos/botonCargando.css';
import PropTypes from 'prop-types';


const BotonCargando = ({ loading, children= "Cargando..."}) => {
    return (
        <div className="boton-cargando-container">
            <button
                type="submit"
                className="button"
                disabled={loading} // Desactiva el botón mientras está cargando
            >
                {loading ? (
                    <div className="spinner-overlay">
                        <ClimbingBoxLoader color="#2c66ef" size={25} />
                    </div>
                ) : (
                    children
                )}
            </button>
        </div>
    );
};
BotonCargando.propTypes = {
    loading: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default BotonCargando;