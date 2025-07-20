import { useEffect, useState } from 'react';
import service from '../services/serviceInscripcion';
import '../estilos/listaEstudiantes.css';
import '../estilos/estilosInscripcion.css'; // Importa los estilos para modal-header-buttons
import CloseButton from '../components/CloseButton'; // Importa el componente CloseButton
import VolverButton from '../components/VolverButton'; // Importa el componente VolverButton
import PropTypes from 'prop-types';

const ListaEstudiantes = ({ onClose, onAccion, onVolver, soloParaEliminacion = false }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [totalEstudiantes, setTotalEstudiantes] = useState(0); // Total de estudiantes
  const limit = 10; // Cantidad de estudiantes por página

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const data = await service.getPaginatedEstudiantes(page, limit);
        console.log('Datos obtenidos:', data); // Verifica los datos aquí
        setEstudiantes(data.estudiantes || []);
        setTotalPages(data.totalPages || 1);
        setTotalEstudiantes(data.total || 0);
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
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="lista-estudiantes">
      {/* Contenedor de botones superior */}
      <div className="modal-header-buttons">
        {onVolver && (
          <VolverButton onClick={onVolver} />
        )}
        {onClose && (
          <CloseButton onClose={onClose} variant="modal" />
        )}
      </div>

      {/* Título delicado más arriba */}
      <div className="lista-header">
        <h2 className="lista-titulo">Lista de Estudiantes</h2>
        <p className="lista-subtitulo">Total: {totalEstudiantes} estudiantes</p>
      </div>

      {error && <p className="error">{error}</p>}
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
            {onAccion && <th>Acciones</th>}
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
              {onAccion && (
                <td>
                  <div className="acciones-estudiante">
                    <button 
                      className="btn-accion btn-ver"
                      onClick={() => onAccion('Ver', estudiante)}
                      title="Ver estudiante"
                    >
                      👁️
                    </button>
                    {!soloParaEliminacion && (
                      <button 
                        className="btn-accion btn-modificar"
                        onClick={() => onAccion('Modificar', estudiante)}
                        title="Modificar estudiante"
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Paginación - mostrar siempre que haya estudiantes y más de una página */}
      {estudiantes.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={handlePreviousPage} 
            disabled={page === 1}
            className="pagination-btn"
          >
            Anterior
          </button>
          <span className="pagination-info">
            Página {page} de {totalPages}
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={page >= totalPages}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
ListaEstudiantes.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAccion: PropTypes.func,
  onVolver: PropTypes.func,
  soloParaEliminacion: PropTypes.bool,
};

export default ListaEstudiantes;