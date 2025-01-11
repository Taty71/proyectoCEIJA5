import React, { useState } from 'react';
import './Modal.css';
import {useForm} from "react-hook-form";
import Input from './Input';
import CloseButton from './CloseButton';
import service from '../services/service';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup'; 
import { userValidationSchema } from './ValidacionSchemaYup';
const RegisterButton = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(userValidationSchema) });
    const navigate = useNavigate(); // Para redirigir
    const onSubmit = async (data) => {
        console.log("Datos enviados:", data);
        try {
            const response = await service.createU(data); // Llamada al servicio
            console.log("Respuesta completa del servidor:", response);
            if (response && response.status === 'success') {
                alert(response.message);
                navigate('/'); // Redirige al home
            } else {
                alert("Error en la respuesta: " + JSON.stringify(response));
            }
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            alert('Hubo un error al registrar el usuario');
        }
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="register-box">
                
                <form onSubmit={handleSubmit(onSubmit)}>
            
                     <Input label="Nombre" placeholder="Nombre" registro={{...register("nombre")}} error={errors.nombre?.message}/>
                   
                     <Input label="Apellido" placeholder="Apellido" registro={{...register("apellido")}} error={errors.apellido?.message}/>
                     
                     <Input label="Email" placeholder="Email" registro={{...register("email")}} error={errors.email?.message}/>
                    
                     <Input label="Contraseña" type="password" registro={{...register("password" )}} error={errors.password?.message}/>
                     
                     <Input
                            label="Rol"
                            type="select"
                            registro={{ ...register("rol" ) }}
                            options={[
                                { value: 'administrador', label: 'Administrador' },
                                { value: 'profesor', label: 'Profesor' },
                                { value: 'estudiante', label: 'Estudiante' },
                                { value: 'secretario', label: 'Secretario' },
                                { value: 'coordinador', label: 'Coordinador' },
                            ]}
                            error={errors.rol?.message}
                        />
                       
                     <button type="submit" className="register-button">Registrarse</button>
                     <button onClick={onClose} className="back-button">Volver</button>
                    
                </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterButton;
