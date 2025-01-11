import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';
import BotonCargando from './BotonCargando';
import AlertaMens from './AlertaMens';
import {useForm} from "react-hook-form";
import Input from './Input';
import service from '../services/service';
import { yupResolver } from '@hookform/resolvers/yup'; 
import { userValidationSchema } from './ValidacionSchemaYup';

const LoginButton = ({ onClose, onRegisterClick }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(userValidationSchema) });
    const [loading,setLoading] = useState(false)
    const [alerta, setAlerta] = useState({variant:"", text:""})
    const navigate = useNavigate();
    
const onSubmit = async (data) => {

    setLoading(true);
    
    console.log("Form", data);
    try {
        const response = await service.getUser(data);  // Pasa 'data' directamente
        console.log("Respuesta completa del servidor:", response);
        
        if (response.status === 'success') {
            setAlerta({ variant: 'success', text: `Bienvenido, ${response.user.nombre}. Rol: ${response.user.rol}` });
            setTimeout(() => {
                navigate('/'); // Redirige después de mostrar el mensaje
            }, 3000); // Espera 2 segundos antes de redirigir
        } else {
            setAlerta({ variant: 'error', text: response.message });
        }
    } catch (error) {
        console.error('Error al leer el usuario:', error);
        // Modificar para usar setAlert en lugar de alert
        setAlerta({ variant: 'error', text: 'Hubo un error al leer el usuario' });

    }
    setLoading(false);
    };
        
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="login-box">
                    {/* Mostrar la alerta si hay un mensaje */}
                    {alerta.text && (
                        <Alerta text={alerta.text} variant={alerta.variant} />
                    )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input label="Email" placeholder="Email" registro={{...register("email")}} error={errors.email?.message}/>
                    
                    <Input label="Contraseña" type="password" registro={{...register("password" )}} error={errors.password?.message}/>
                    <BotonCargando loading={loading}/>
                    <button type="submit" className="login-button">Iniciar Sesión</button>
                    <button onClick={onClose} className="back-button">Volver</button>
                    
                    <p className="register-text">¿No tienes cuenta? 
                        {/* Enlace para mostrar el modal de registro */}
                        <a href="#" onClick={onRegisterClick} className="register-link">Regístrate</a>
                    </p>
                </form>
                </div>
            </div>
        </div>
    );
};
export default LoginButton;
