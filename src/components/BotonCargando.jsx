import React from 'react';
import { ClimbingBoxLoader } from 'react-spinners'; // Importa el spinner que prefieras
import './modal.css';


const BotonCargando = ({ loading, children }) => {
    return (
        <>
        <button
            type="submit"
            className="login-button"
            disabled={loading} // Desactiva el botón mientras está cargando
        >
            {loading ? <ClimbingBoxLoader color="#fff" size={20} /> : children}
        </button>
        </>
    );
};

export default BotonCargando;