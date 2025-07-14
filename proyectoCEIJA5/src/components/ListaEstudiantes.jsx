import { useEffect, useState } from 'react';
import serviceInscripcion from '../services/serviceInscripcion';
import MensajeError from '../utils/MensajeError'; // Importa el componente MensajeError
import '../estilos/listaEstudiantes.css'; // Asegúrate de que la ruta sea correcta

const ListaEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const data = await serviceInscripcion.getAll();
                setEstudiantes(data);
                setError(null); // Limpia el error si la solicitud es exitosa
            } catch (err) {
                console.error('Error fetching students:', err);
                setError(err?.message || 'Ocurrió un error inesperado.');
            }
        };
        fetchEstudiantes();
    }, []);

    if (error) {
        return <MensajeError mensaje={error} />; // Usa el componente MensajeError
    }

    return (
        <div>
            <h2>Lista de Estudiantes Inscritos</h2>
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
                        <th>Fecha de Inscripción</th>
                        <th>Modalidad</th>
                        <th>Curso/Plan</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((estudiante) => (
                        <tr key={estudiante.id}>
                            <td>{estudiante.id}</td>
                            <td>{estudiante.nombre}</td>
                            <td>{estudiante.apellido}</td>
                            <td>{estudiante.dni}</td>
                            <td>{estudiante.cuil}</td>
                            {/* Formatea la fecha de nacimiento */}
                            <td>
                                {estudiante.fechaNacimiento
                                    ? new Date(estudiante.fechaNacimiento).toLocaleDateString('es-ES')
                                    : 'No registrada'}
                            </td>
                            <td>{estudiante.calle}</td>
                            <td>{estudiante.numero}</td>
                            <td>{estudiante.barrio}</td>
                            <td>{estudiante.localidad}</td>
                            <td>{estudiante.provincia}</td>
                            {/* Formatea la fecha de inscripción */}
                            <td>
                                {estudiante.fechaInscripcion
                                    ? new Date(estudiante.fechaInscripcion).toLocaleDateString('es-ES')
                                    : 'No registrada'}
                            </td>
                            <td>{estudiante.modalidad || 'No especificada'}</td>
                            <td>{estudiante.cursoPlan || 'No especificado'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaEstudiantes;