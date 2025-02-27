import { useEffect, useState } from 'react';
import service from '../services/service';
import '../estilos/listaEstudiantes.css';

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
                        <th>Modalidad</th>
                        <th>Plan/Año</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(estudiante => (
                        <tr key={estudiante.id}>
                            <td>{estudiante.id}</td>
                            <td>{estudiante.nombre}</td>
                            <td>{estudiante.apellido}</td>
                            <td>{estudiante.dni}</td>
                            <td>{estudiante.cuil}</td>
                            <td>{estudiante.fechaNacimiento}</td>
                            <td>{estudiante.calle}</td>
                            <td>{estudiante.numero}</td>
                            <td>{estudiante.barrio}</td>
                            <td>{estudiante.localidad}</td>
                            <td>{estudiante.provincia}</td>
                            <td>{estudiante.modalidad}</td>
                            <td>{estudiante.planAnio}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaEstudiantes;