import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import serviceInscripcion from '../services/serviceInscripcion';
import BotonCargando from './BotonCargando';
import CloseButton from './CloseButton';
import VolverButton from './VolverButton'; // Importa el componente VolverButton
import AlertaMens from './AlertaMens'; // Importa el componente AlertaMens
import '../estilos/listaEstudiantes.css';
import '../estilos/estilosInscripcion.css'; // Importa los estilos para modal-header-buttons

const ListaEstudiantes = ({ onAccion, onClose, onVolver, soloParaEliminacion = false, refreshKey = 0, modalidad }) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEstudiantes, setTotalEstudiantes] = useState(0);
    const [estudianteAEliminar, setEstudianteAEliminar] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    // Eliminamos la variable filtroActivo ya que solo mostramos estudiantes activos
    const cargarEstudiantes = useCallback(async (currentPage = 1) => {
        setLoading(true);
        try {
            // Cargar solo estudiantes activos
            const response = await serviceInscripcion.getPaginatedEstudiantes(currentPage, 10, 'activos');
            let estudiantesFiltrados = response.success && response.estudiantes ? response.estudiantes : [];
            // Filtrar por modalidad SIEMPRE que modalidad esté definida
            if (modalidad && typeof modalidad === 'string' && modalidad.trim() !== '') {
                const modalidadNorm = modalidad.trim().toLowerCase();
                estudiantesFiltrados = estudiantesFiltrados.filter(e => {
                    const mod = (e.modalidad || '').trim().toLowerCase();
                    // Solo incluir si tiene modalidad y coincide
                    if (!mod) return false;
                    return mod === modalidadNorm;
                });
                // Debug: mostrar modalidades encontradas
                console.log('Modalidades en la lista:', estudiantesFiltrados.map(e => e.modalidad));
            }
            setEstudiantes(estudiantesFiltrados);
            setTotalPages(response.totalPages || 1);
            setTotalEstudiantes(estudiantesFiltrados.length);
            setError('');
        } catch (err) {
            console.error('Error al cargar estudiantes:', err);
            setError('Error de conexión al cargar estudiantes');
            setEstudiantes([]);
        } finally {
            setLoading(false);
        }
    }, [modalidad]);
    useEffect(() => {
        cargarEstudiantes(page);
    }, [page, refreshKey, cargarEstudiantes]); // Incluir cargarEstudiantes como dependencia

    const handlePaginaAnterior = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handlePaginaSiguiente = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'No disponible';
        try {
            return new Date(fecha).toLocaleDateString('es-AR');
        } catch {
            return 'Fecha inválida';
        }
    };

    const handleEliminarClick = (estudiante) => {
        setEstudianteAEliminar(estudiante);
        setShowConfirmDelete(true);
    };

    const handleConfirmarEliminacion = async () => {
        if (!estudianteAEliminar) return;

        try {
            // Realizar eliminación lógica (desactivar estudiante)
            const response = await fetch(`http://localhost:5000/api/estudiantes/${estudianteAEliminar.dni}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activo: 0 })
            });

            const data = await response.json();
            
            if (data.success) {
                // Remover el estudiante de la lista local
                setEstudiantes(prevEstudiantes => 
                    prevEstudiantes.filter(est => est.dni !== estudianteAEliminar.dni)
                );
                
                // Actualizar el total
                setTotalEstudiantes(prevTotal => prevTotal - 1);
                
                // Cerrar modal
                setShowConfirmDelete(false);
                setEstudianteAEliminar(null);
                
                // Si la página actual se queda vacía y no es la primera, ir a la anterior
                if (estudiantes.length === 1 && page > 1) {
                    setPage(page - 1);
                }
            } else {
                setError(data.message || 'Error al desactivar estudiante');
            }
        } catch (error) {
            console.error('Error al desactivar estudiante:', error);
            setError('Error de conexión al desactivar estudiante');
        }
    };

    const handleCancelarEliminacion = () => {
        setShowConfirmDelete(false);
        setEstudianteAEliminar(null);
    };

    const getTituloLista = () => {
        return 'Lista de estudiantes';
    };

    const handleAccion = async (accion, estudiante) => {
        try {
            const response = await fetch(`http://localhost:5000/api/consultar-estudiantes-dni/${estudiante.dni}`);
            const data = await response.json();
            if (data.success) {
                console.log('Datos completos del estudiante:', data);
                const estudianteCompleto = {
                    ...data.estudiante,
                    calle: data.domicilio?.calle || '',
                    numero: data.domicilio?.numero || '',
                    barrio: data.domicilio?.barrio || '',
                    localidad: data.domicilio?.localidad || '',
                    pcia: data.domicilio?.provincia || '',
                    modalidad: data.inscripcion?.modalidad || '',
                    planAnio: data.inscripcion?.plan || '',
                    modulo: data.inscripcion?.modulo || '',
                    estadoInscripcion: data.inscripcion?.estado || '',
                    fechaInscripcion: data.inscripcion?.fechaInscripcion || '',
                    idInscripcion: data.inscripcion?.idInscripcion || null,
                    documentacion: data.documentacion || [],
                    email: data.estudiante?.email || ''
                };
                onAccion(accion, estudianteCompleto);
            } else {
                console.error('Error al obtener datos completos:', data.message);
                onAccion(accion, estudiante); // Fallback con datos básicos
            }
        } catch (error) {
            console.error('Error al obtener datos del estudiante:', error);
            onAccion(accion, estudiante); // Fallback con datos básicos
        }
    };

    if (loading) {
        return (
            <div className="lista-estudiantes-container">
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
                    <h2 className="lista-titulo">{getTituloLista()}</h2>
                    <p className="lista-subtitulo">Cargando estudiantes...</p>
                </div>
                
                <div className="loading-container">
                    <BotonCargando loading={true}>Cargando estudiantes...</BotonCargando>
                </div>
            </div>
        );
    }

    return (
        <div className="lista-estudiantes-container">
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
                <h2 className="lista-titulo">{getTituloLista()}</h2>
                <p className="lista-subtitulo">Total: {totalEstudiantes} estudiantes</p>
            </div>

            {error && (
                <AlertaMens
                    text={error}
                    variant="error"
                    duration={4000}
                    onClose={() => setError('')}
                />
            )}

            {!error && estudiantes.length === 0 && (
                <div className="no-data">
                    <p>No se encontraron estudiantes inscriptos.</p>
                </div>
            )}

            {!error && estudiantes.length > 0 && (
                <>
                    <div className="tabla-container">
                        <table className="tabla-estudiantes">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DNI</th>
                                    <th>Nombre Completo</th>
                                    <th>Email</th>
                                    <th>Modalidad</th>
                                    <th>Curso/Plan</th>
                                    <th>Estado de Inscripción</th>
                                    <th>Fecha Inscripción</th>
                                    <th>Fecha Nacimiento</th> {/* Nueva columna */}
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.map((estudiante, index) => (
                                    <tr key={`${estudiante.dni}-${estudiante.id}-${index}`}>
                                        <td>{estudiante.id}</td>
                                        <td>{estudiante.dni}</td>
                                        <td>{`${estudiante.nombre} ${estudiante.apellido}`}</td>
                                        <td>{estudiante.email || 'No registrado'}</td>
                                        <td>{estudiante.modalidad}</td>
                                        <td>{estudiante.cursoPlan || 'Sin asignar'}</td>
                                        <td>
                                            <span className={`estado estado-${estudiante.estadoInscripcion?.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {estudiante.estadoInscripcion || 'Sin estado'}
                                            </span>
                                        </td>
                                        <td>{formatearFecha(estudiante.fechaInscripcion)}</td>
                                        <td>{formatearFecha(estudiante.fechaNacimiento)}</td>
                                        <td>
                                            <div className="acciones-grupo">
                                                {soloParaEliminacion ? (
                                                    <button
                                                        className="btn-accion btn-eliminar"
                                                        onClick={() => handleAccion('Ver', estudiante)}
                                                        title="Seleccionar para eliminar de la base de datos"
                                                    >
                                                        ⚠️ Eliminar
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn-accion btn-modificar"
                                                            onClick={() => handleAccion('Modificar', estudiante)}
                                                            title="Modificar estudiante"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="btn-accion btn-eliminar"
                                                            onClick={() => handleEliminarClick(estudiante)}
                                                            title="Desactivar estudiante (eliminación lógica)"
                                                        >
                                                            ❌
                                                        </button>
                                                        <button
                                                            className="btn-accion btn-ver"
                                                            onClick={() => handleAccion('Ver', estudiante)}
                                                            title="Ver detalles"
                                                        >
                                                            👁️
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación - mostrar siempre que haya estudiantes y más de una página */}
                    {estudiantes.length > 0 && totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                onClick={handlePaginaAnterior}
                                disabled={page === 1}
                            >
                                Anterior
                            </button>
                            <span className="pagination-info">
                                Página {page} de {totalPages}
                            </span>
                            <button
                                className="pagination-btn"
                                onClick={handlePaginaSiguiente}
                                disabled={page >= totalPages}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal de confirmación de eliminación */}
            {showConfirmDelete && estudianteAEliminar && (
                <div className="modal-overlay">
                    <div className="modal-confirm-delete">
                        <h3>⚠️ Confirmar Desactivación</h3>
                        <div className="confirm-delete-info">
                            <p><strong>ID:</strong> {estudianteAEliminar.id}</p>
                            <p><strong>DNI:</strong> {estudianteAEliminar.dni}</p>
                            <p><strong>Nombre:</strong> {estudianteAEliminar.nombre}</p>
                            <p><strong>Apellido:</strong> {estudianteAEliminar.apellido}</p>
                        </div>
                        <p className="confirm-delete-message">
                            ¿Está seguro que desea desactivar este estudiante? 
                            El estudiante se ocultará de la lista pero sus datos se conservarán en la base de datos.
                        </p>
                        <div className="confirm-delete-buttons">
                            <button 
                                className="btn-cancelar-delete" 
                                onClick={handleCancelarEliminacion}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-confirmar-delete" 
                                onClick={handleConfirmarEliminacion}
                            >
                                Desactivar Estudiante
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


ListaEstudiantes.propTypes = {
    onAccion: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onVolver: PropTypes.func, // Callback para el botón "Volver"
    soloParaEliminacion: PropTypes.bool,
    refreshKey: PropTypes.number, // Clave para forzar recarga de datos

    modalidad: PropTypes.string,
};
export default ListaEstudiantes;