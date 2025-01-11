// src/components/Navbar.jsx
import React, { useState } from 'react';
import '../App.css';

const Navbar = ({ onModalopen }) => {
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
                        <li className="opcMenu"><a href="#nuestra-escuela">Nuestra Escuela</a></li>
                        <li className="opcMenu"><button onClick={() => { onModalopen(); toggleMenu(); }}>Modalidad</button></li>
                        <li className="opcMenu"><a href="#contacto">Contáctanos</a></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
