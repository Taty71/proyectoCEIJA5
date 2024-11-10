import React, { useState } from 'react';
import './Modal.css';

const RegisterButton = ({ onClose }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState(''); // Valor predeterminado

    const handleRegister = async () => {
      
            console.log("Nombre:", nombre);
            console.log("Apellido:", apellido);
            console.log("Email:", email);
            console.log("Password:", password);
            console.log("Rol:", rol);
        
            if (!nombre.trim() || !apellido.trim() || !email.trim() || !password.trim() || !rol.trim()) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            // Validación del formato del email
           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           if (!emailRegex.test(email)) {
                   alert("Por favor, ingresa un email válido.");
               return;
    }
        try {
            const response = await fetch('http://localhost/proyectoCEIJA5api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre, 
                    apellido, 
                    email, 
                    password, 
                    rol,
                }),
            });
         
            if (!response.ok) throw new Error('Error en la respuesta del servidor');

            const data = await response.json();
            console.log("Api response:", data); // Verifica la respuesta
            if (data.status === 'success') {
                alert(data.message);
                // Aquí podrías hacer algo más después del registro exitoso
                navigate('/login');
            } else {
                alert(data.message); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert('Hubo un error al registrar el usuario');
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
                    <option value="">Seleccione un rol</option> {/* Opción para forzar la selección */}
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
