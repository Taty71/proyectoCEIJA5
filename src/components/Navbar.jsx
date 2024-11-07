import React, { useState } from 'react';
import '../components/EstilosC.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="navbar">
            <button className="hamburger" onClick={toggleMenu}>
                ☰
            </button>
            {isOpen && (
                <div className="menu">
                    <button onClick={toggleMenu}>✖</button>
                    <ul>
                        <li><a href="#nuestra-escuela">Nuestra Escuela</a></li>
                        <li><a href="#modalidad">Modalidad</a></li>
                        <li><a href="#contacto">Contáctanos</a></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
