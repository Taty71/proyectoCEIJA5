import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginButton from './LoginButton';
import '../EstilosC.css';

const Home = () => {
    //const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleLoginRedirect = () => {
        setShowModal(true); 
       
    };
    const handleCloseModal = () => {
        setShowModal(false); // Cierra el modal
    };
    return (
        <div className="home">
            <div className="barNav">
                <button onClick={handleLoginRedirect} className="login-button">Iniciar Sesión</button>
                <Navbar />
            </div>
            {showModal && <LoginButton onClose={handleCloseModal} />} {/* Modal se muestra solo cuando showModal es true */}

            <div className="school-info">
              <div className='school-image'></div>
                
                <div class="text-overlay">
                    <h1>C.E.I.J.A 5</h1>
                    <p className='textE'>Educando para la libertad</p>
                    <p>San Martín 772 - La Calera</p>
                </div>
            </div>
            <div className='logo'>
            <img src="public\LogoCE.png" alt="Logo Proyecto" className="logo" />
            </div>
        </div>
    );
};

export default Home;
