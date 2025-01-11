// src/components/Preinscripcion.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FormularioInscripcion from '../components/FormularioInscripcion';
import './estilosInscripcion.css';
import BusquedaDNI from '../components/BusquedaDNI';




const Preinscripcion = () => {
    const [searchParams] = useSearchParams();
    const modalidad = searchParams.get('modalidad');
    const [estudianteEncontrado, setEstudianteEncontrado] = useState('');

    const handleEstudianteEncontrado = (estudiante) => {
        setEstudianteEncontrado(estudiante);
    };

    return (
        <div className="inscripcion-container">
            <h2>Formulario de Preinscripción {modalidad}</h2>
            <BusquedaDNI onEstudianteEncontrado={handleEstudianteEncontrado} />
            <FormularioInscripcion modalidad={modalidad} estudianteEncontrado={estudianteEncontrado} />
        </div>
    );
};

export default Preinscripcion;