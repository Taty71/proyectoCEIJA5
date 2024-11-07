import React, { useState } from 'react';
import './Modal.css';
import '../EstilosC.css';

const LoginButton = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await fetch('http://localhost/backend/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (result.status === 'success') {
            window.location.href = '/dashboard'; // Redirige a otra página si el login es exitoso
        } else {
            alert(result.message); // Muestra el mensaje de error
        }
    };

    return (
   // <div className="login-page">
         //   {showModal && (

            <div className="modal-overlay" onClick={onClose}>
                    <div className="modal-content"onClick={(e) => e.stopPropagation()}>
                        <div className="login-box">
                            <label>Cuenta</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={handleLogin} className="login-button">Iniciar Sesión</button>
                            <button onClick={onClose} className="back-button">Volver</button>
                      
                            <p className="register-text">No tenes cuenta? <a href="/register" className="register-link">Registrate</a></p>
                        </div>
                    </div>
                </div>
            );
    
 };
    

export default LoginButton;



