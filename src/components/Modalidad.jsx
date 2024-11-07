import React from 'react';
import { Link } from 'react-router-dom';
import '../EstilosC.css';

const Modalidad = () => {
    return (
        <div>
            <h2>Elija una Modalidad</h2>
                <Link to="/preinscripcion?modalidad=presencial">Presencial</Link>
                <Link to="/preinscripcion?modalidad=semipresencial">Semipresencial</Link>
        </div>
    );
};

export default Modalidad;
