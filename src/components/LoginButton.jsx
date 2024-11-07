import React from 'react';
import '../components/EstilosC.css';

const LoginButton = () => {
    const handleLogin = () => {
        window.location.href = "/login";
    };

    return (
        <button onClick={handleLogin} className="login-button">
            Inicio de Sesión
        </button>
    );
};

export default LoginButton;
