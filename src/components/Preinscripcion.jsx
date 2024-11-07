import React, { useState } from 'react';
import '../components/EstilosC.css';

const Preinscripcion = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        modalidad: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Preinscripción enviada");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Formulario de Preinscripción</h2>
            <input type="text" name="nombre" placeholder="Nombre Completo" onChange={handleChange} />
            <select name="modalidad" onChange={handleChange}>
                <option value="presencial">Presencial</option>
                <option value="semipresencial">Semipresencial</option>
            </select>
            <button type="submit">Enviar</button>
        </form>
    );
};

export default Preinscripcion;
