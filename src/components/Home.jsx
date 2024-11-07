import React from 'react';
import Navbar from './Navbar';
import LoginButton from './LoginButton';
import '../components/EstilosC.css';

const Home = () => {
    return (
        <div className="home">
            <Navbar />
            <LoginButton />
            <div className="school-info">
                <img src="src\assets\f3.jpg" alt="Imagen de la escuela" className="school-image" />
                <div class="text-overlay">
                    <h1>C.E.I.J.A 5</h1>
                    <p>Educando para la libertad</p>
                    <p>San Martín 772 - La Calera</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
