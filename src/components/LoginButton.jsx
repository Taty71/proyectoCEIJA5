import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './modal.css';
import BotonCargando from './BotonCargando';
import AlertaMens from './AlertaMens';
import {useForm} from "react-hook-form";
import Input from './Input';
import service from '../services/service';
import { yupResolver } from '@hookform/resolvers/yup'; 
import { loginValidationSchema } from './ValidacionSchemaYup';

const LoginButton = ({ onClose, onRegisterClick }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginValidationSchema) });
    const [loading,setLoading] = useState(false)
    const [alerta, setAlerta] = useState({variant:"", text:""})
    const navigate = useNavigate();
    
    const mostrarAlerta = (text, variant) => {
        console.log(`Alerta: ${text}, Variant: ${variant}`); // Verifica los valores
        setAlerta({ text, variant });
        setTimeout(() => {
            console.log('Ocultando alerta'); // Debug log
            setAlerta({ text: '', variant: '' });
        }, 10000); // Oculta la alerta después de 5s
    }

    const onSubmit = async (data) => {
        setLoading(true);
        console.log("Form", data);
        try {
            const response = await service.getUser(data);  // Pasa 'data' directamente
            console.log("Respuesta completa del servidor:", response);
            setTimeout(() => {
                setLoading(false);
                if (response?.status=== 'success') {
                    console.log(`Nombre del usuario: ${response.user.nombre}`); // Debug log
                    console.log(`Rol del usuario: ${response.user.rol}`); // Debug log
                    mostrarAlerta(`Bienvenido, ${response.user.nombre}. Rol: ${response.user.rol}`, 'success');
                    setTimeout(() => {
                        navigate('/');
                        
                    }, 3000); // Delay of 3 seconds before navigating
                } else {
                    mostrarAlerta(response?.message || 'Error en las credenciales', 'error');
                }
            }, 5000); // Mantiene el spinner durante 10 segundos
        } catch (error) {
            mostrarAlerta('Error del servidor. Intenta nuevamente.', 'error');
            console.error('Error en login:', error);
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="login-box">
                     {/* Mostrar la alerta si hay un mensaje */}
                     {alerta.text && <AlertaMens text={alerta.text} variant={alerta.variant} />}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input label="Email" placeholder="Email" registro={{...register("email")}} error={errors.email?.message}/>
                    
                    <Input label="Contraseña"  placeholder="Password" type="password" registro={{...register("password" )}} error={errors.password?.message}/>
                    
                    <BotonCargando loading={loading}>
                        Iniciar Sesión
                    </BotonCargando>
                
                    <button onClick={(e) => { e.preventDefault(); onClose(); }} className="button back-button">Volver</button>
                    <p className="register-text">¿No tienes cuenta? 
                        {/* Enlace para mostrar el modal de registro */}
                        <a href="#" onClick={(e) => { e.preventDefault(); onRegisterClick(); }} className="register-link">Regístrate</a>
                    </p>
                </form>
            </div>
            </div>
        </div>
    );
};
export default LoginButton;
