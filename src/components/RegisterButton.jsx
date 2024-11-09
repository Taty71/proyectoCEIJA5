import React, { useState } from 'react';
import './Modal.css';

const RegisterButton = ({ onClose }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('estudiante'); // Valor predeterminado

    const handleRegister = async () => {
        if (!nombre || !apellido || !email || !password || !rol) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1/proyectoCEIJA5api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, email, password, rol }),
            });
            
            if (!response.ok) throw new Error('Error en la respuesta del servidor');

            const result = await response.json();
            if (result.status === 'success') {
                alert("Registro exitoso");
                // Aquí podrías hacer algo más después del registro exitoso
            } else {
                alert(result.message); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de red: No se pudo conectar con el servidor.");
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
