import React, { useEffect, useState } from 'react';
import service from '../services/service';


const ListaEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);

    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const response = await service.getAll();
                console.log(response); // Verifica el formato de los datos
                if (response.status === "success") {
                    setEstudiantes(response.data);
                } else {
                    console.error("Error fetching students: ", response.message);
                }
            } catch (error) {
                console.error("Error fetching students: ", error);
            }
        };

        fetchEstudiantes();
    }, []);

    return (
        <div className="lista-estudiantes">
            <h2>Lista de Estudiantes</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>CUIL</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Calle</th>
                        <th>Número</th>
                        <th>Barrio</th>
                        <th>Localidad</th>
                        <th>Provincia</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(estudiante => (
                        <tr key={estudiante.idEstudiante}>
                            <td>{estudiante.idEstudiante}</td>
                            <td>{estudiante.nombreEstd}</td>
                            <td>{estudiante.apellidoEstd}</td>
                            <td>{estudiante.dni}</td>
                            <td>{estudiante.cuil}</td>
                            <td>{estudiante.fechaNacimiento}</td>
                            <td>{estudiante.calle}</td>
                            <td>{estudiante.nro}</td>
                            <td>{estudiante.barrio}</td>
                            <td>{estudiante.localidad}</td>
                            <td>{estudiante.pcia}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaEstudiantes;
