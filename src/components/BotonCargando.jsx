import React from 'react';
import { ClipLoader } from 'react-spinners'; // Importa el spinner que prefieras



const BotonCargando = ({ loading, children }) => {
    return (
        <button
            type="submit"
            className="login-button"
            disabled={loading} // Desactiva el botón mientras está cargando
        >
            {loading ? <ClipLoader color="#fff" size={20} /> : children}
        </button>
    );
};

export default BotonCargando;