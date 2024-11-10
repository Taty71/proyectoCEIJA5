import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

const LoginButton = ({ onClose,onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Por favor, ingresa tanto el email como la contraseña.");
            return; // No continuar si los campos están vacíos
        } 
        try {
            const response = await fetch('http://localhost/proyectoCEIJA5api/api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'login', email, password }),
            });
    
            const result = await response.json();
    
            if (result.status === 'success') {
                alert(`Bienvenido, ${result.user.nombre}. Rol: ${result.user.rol}`);
                navigate('/dashboard'); // Redirige al dashboard
            } else {
                alert(result.message); // Muestra el mensaje de error
            }
        } catch (error) {
            alert('Error de red: No se pudo conectar con el servidor');
        }
    };
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="login-box">
                    <label>Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}gi
                    />
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin} className="login-button">Iniciar Sesión</button>
                    <button onClick={onClose} className="back-button">Volver</button>
                    <p className="register-text">¿No tienes cuenta? 
                        {/* Enlace para mostrar el modal de registro */}
                        <a href="#" onClick={onRegisterClick} className="register-link">Regístrate</a>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default LoginButton;
