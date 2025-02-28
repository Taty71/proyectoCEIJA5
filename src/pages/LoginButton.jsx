import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../estilos/Modal.css';
import { useUserContext } from "../context/UserContextFile";
import BotonCargando from '../components/BotonCargando';
import AlertaMens from '../components/AlertaMens';
import { useForm } from "react-hook-form";
import Input from '../components/Input';
import service from '../services/service';
import { yupResolver } from '@hookform/resolvers/yup'; 
import { loginValidationSchema } from '../validaciones/ValidacionSchemaYup';

const LoginButton = ({ onClose, onRegisterClick }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginValidationSchema) });
    const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState({ variant: "", text: "" });
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    const mostrarAlerta = (text, variant) => {
        console.log(`Alerta: ${text}, Variant: ${variant}`); // Verifica los valores
        setAlerta({ text, variant });
        setTimeout(() => {
            console.log('Ocultando alerta'); // Debug log
            setAlerta({ text: '', variant: '' });
        }, 5000); // Oculta la alerta después de 5s
    };

    const onSubmit = async (data) => {
        setLoading(true);
        console.log("Form", data);
        try {
            const response = await service.getUser(data);  // Pasa 'data' directamente
            console.log("Respuesta completa del servidor:", response);
            setLoading(false);
            if (response?.status === 'success') {
                const { nombre, rol, email } = response.user; // Extraemos los datos relevantes
                console.log(`Nombre: ${nombre}, Rol: ${rol}, Email: ${email}`);
                // Actualizar el estado del usuario en el contexto
                setUser({ nombre, rol, email });

                mostrarAlerta(`Bienvenido, ${nombre}. Rol: ${rol}`, 'success');
                console.log("Estado del usuario en el contexto:", { nombre, rol, email }); // Verificar el estado del usuario en el contexto
                console.log('Redirigiendo al dashboard'); // Lo // Guardamos el usuario en el contexto
                
                setTimeout(() => {
                    navigate('/dashboard'); // Redirige al dashboard después de 3 segundos
                }, 3000);
            } else {
                mostrarAlerta(response?.message || 'Error en las credenciales', 'error');
            }
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
                    <button onClick={(e) => { e.preventDefault(); onClose(); }} className="back-button">✖</button>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input label="Email" placeholder="Email" registro={{ ...register("email") }} error={errors.email?.message} />
                        <Input label="Contraseña" placeholder="Password" type="password" registro={{ ...register("password") }} error={errors.password?.message} />
                        <BotonCargando loading={loading}>
                            Iniciar Sesión
                        </BotonCargando>
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

LoginButton.propTypes = {
    onClose: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
};

export default LoginButton;