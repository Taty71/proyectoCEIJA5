// src/components/Home.jsx
import { useState } from 'react';
import Navbar from '../components/Navbar';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import Modalidad from '../components/Modalidad';
import '../estilos/estilosHome.css';
import HomeInfo from '../components/HomeInfo';


const Home = () => {
    const [activeModal, setActiveModal] = useState(null); // Manejo qué modal está activo

    const openModal = (modalName) => {
        setActiveModal(modalName); // Establezco el modal activo
    };

    const closeModal = () => {
        setActiveModal(null); // Cierro el modal activo
    };


    return (
        <div className="home">
            <div className="barNav">
                <button onClick={() => openModal('login')} className="login-button">Iniciar Sesión</button>
                <Navbar onModalopen={() => openModal('modalidad')} />
            </div>
            {/* Renderiza los modales según el modal activo */}
            {activeModal === 'login' && (
                <LoginButton onClose={closeModal} onRegisterClick={() => openModal('register')} />
            )}
            {activeModal === 'register' && <RegisterButton onClose={closeModal} />}
            {activeModal === 'modalidad' && <Modalidad onClose={closeModal} />}
            <HomeInfo />
        </div>
    );
};

export default Home;
