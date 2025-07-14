import { useEffect, useState } from 'react';
import service from '../services/serviceInscripcion';
import '../estilos/listaEstudiantes.css';

const ListaEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Página actual
  const limit = 10; // Cantidad de estudiantes por página

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const data = await service.getPaginatedEstudiantes(page, limit);
        console.log('Datos obtenidos:', data); // Verifica los datos aquí
        setEstudiantes(data.estudiantes || []);
        setError(null);
      } catch (err) {
        const mensaje =
          err instanceof Error && err.message
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Ocurrió un error inesperado.';
        console.error('Error fetching students:', mensaje);
        setError(mensaje);
      }
    };
    fetchEstudiantes();
  }, [page, limit]); // Actualiza los datos cuando cambia la página o el límite

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  return (
    <div className="lista-estudiantes">
      {error && <p className="error">{error}</p>}
      <h2>Lista de Estudiantes</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
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
          {estudiantes.map(estudiante => (
            <tr key={estudiante.id}>
              <td>{estudiante.id}</td>
              <td>{estudiante.nombre}</td>
              <td>{estudiante.apellido}</td>
              <td>{estudiante.dni}</td>
              <td>{estudiante.cuil}</td>
              <td>
                {estudiante.fechaNacimiento
                  ? new Date(estudiante.fechaNacimiento).toLocaleDateString('es-AR')
                  : '—'}
              </td>
              <td>{estudiante.calle}</td>
              <td>{estudiante.numero}</td>
              <td>{estudiante.barrio}</td>
              <td>{estudiante.localidad}</td>
              <td>{estudiante.provincia}</td>
              <td>
                {estudiante.fechaInscripcion
                  ? new Date(estudiante.fechaInscripcion).toLocaleDateString('es-AR')
                  : '—'}
              </td>
              <td>{estudiante.modalidad || '—'}</td>
              <td>{estudiante.cursoPlan || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page}</span>
        <button onClick={handleNextPage} disabled={estudiantes.length < limit}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListaEstudiantes;