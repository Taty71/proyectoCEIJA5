import React, { useEffect, useState } from 'react';
import inscripcionesService from '../Services/inscripcionesService';

const InscripcionesList = () => {
    const [inscripciones, setInscripciones] = useState([]);

    useEffect(() => {
        const fetchInscripciones = async () => {
            try {
                const data = await inscripcionesService.getAll();
                setInscripciones(data);
            } catch (error) {
                console.error('Error cargando inscripciones:', error);
            }
        };
        fetchInscripciones();
    }, []);

    return (
        <div>
            <h1>Listado de Inscripciones</h1>
            <ul>
                {inscripciones.map((inscripcion) => (
                    <li key={inscripcion.id}>{inscripcion.nombre}</li>
                ))}
            </ul>
        </div>
    );
};

export default InscripcionesList;
