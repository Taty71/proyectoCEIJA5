import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginButton from './LoginButton';
import '../EstilosC.css';
import RegisterButton from './RegisterButton'; // Verifica la ruta y el nombre
import SlideImg from './SlideImg';



const Home = () => {
    //const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleLoginRedirect = () => {
        setShowLoginModal(true);
    };
    const handleCloseLoginModal = () => {
        setShowLoginModal(false);
    };
    // Función para abrir el modal de Register
    const handleRegisterRedirect = () => {
        setShowLoginModal(false); // Cerrar el modal de login
        setShowRegisterModal(true); // Mostrar el modal de registro
    };

    // Función para cerrar el modal de Register
    const handleCloseRegisterModal = () => {
        setShowRegisterModal(false);
    };
    return (
        <div className="home">
            <div className="barNav">
                <button onClick={handleLoginRedirect} className="login-button">Iniciar Sesión</button>
                <Navbar />
            </div>
             {/* Modal de Login */}
             {showLoginModal && (
                <LoginButton onClose={handleCloseLoginModal} onRegisterClick={handleRegisterRedirect} />
            )}
             {/* Modal de Registro */}
             {showRegisterModal && <RegisterButton onClose={handleCloseRegisterModal} />}

            <div className="school-info">
              <div className='school-image'>
                <SlideImg />
              </div>
                
                <div className="text-overlay">
                    <h1>C.E.I.J.A 5</h1>
                    <p className='textE'>Educando para la libertad</p>
                    <p>San Martín 772 - La Calera - Córdoba</p>
                </div>
            </div>
            <div className='logo'>
            <img src="public\LogoCE.png" alt="Logo Proyecto" className="logo" />
            </div>
        </div>
    );
};

export default Home;
