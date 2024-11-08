import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';


const RegisterButton = ({ onClose }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('estudiante'); // Valor predeterminado
    const navigate = useNavigate();

    const handleRegister = async () => {
        const response = await fetch('http://localhost/proyectoCEIJA5api/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, apellido, email, password, rol }),
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert("Registro exitoso"); // Muestra un mensaje de éxito
            navigate('/login'); // Redirige a la página de login // Redirige a la página de login
        } else {
            alert(result.message); // Muestra el mensaje de error
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="register-box">
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <label>Apellido</label>
                    <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Rol</label>
                    <select value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="administrador">Administrador</option>
                        <option value="profesor">Profesor</option>
                        <option value="estudiante">Estudiante</option>
                        <option value="secretario">Secretario</option>
                        <option value="coordinador">Coordinador</option>
                    </select>
                    <button onClick={handleRegister} className="register-button">Registrarse</button>
                    <button onClick={onClose} className="back-button">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default RegisterButton;
