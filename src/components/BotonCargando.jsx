import React from 'react';
import { ClimbingBoxLoader } from 'react-spinners'; // Importa el spinner que prefieras
import './modal.css';
import './botonCargando.css';


const BotonCargando = ({ loading, children }) => {
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

export default BotonCargando;