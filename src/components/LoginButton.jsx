import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';



const LoginButton = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

   // const [showRegister, setShowRegister] = useState(false);

    const handleLogin = async () => {
        console.log('hola')
        const response = await fetch('http://localhost/proyectoCEIJA5api/loginC.php', {
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
             <div className="modal-overlay" onClick={onClose}>
                    <div className="modal-content"onClick={(e) => e.stopPropagation()}>
                        <div className="login-box">
                            <label>Email</label>
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
                      
                            <p className="register-text"> ¿No tienes cuenta? <a href="#" onClick={() => navigate('/register')} className="register-link">Regístrate</a> </p>
                        </div>
                    </div>
                </div>
           );
 };
    

export default LoginButton;



