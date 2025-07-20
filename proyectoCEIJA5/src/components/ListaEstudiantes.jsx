import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import serviceInscripcion from '../services/serviceInscripcion';
import BotonCargando from './BotonCargando';
import CloseButton from './CloseButton';
import VolverButton from './VolverButton'; // Importa el componente VolverButton
import '../estilos/listaEstudiantes.css';
import '../estilos/estilosInscripcion.css'; // Importa los estilos para modal-header-buttons

const ListaEstudiantes = ({ onAccion, onClose, onVolver, soloParaEliminacion = false, refreshKey = 0 }) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEstudiantes, setTotalEstudiantes] = useState(0);

    const cargarEstudiantes = async (currentPage = 1) => {
        setLoading(true);
        try {
            const response = await serviceInscripcion.getPaginatedEstudiantes(currentPage, 10);
            
            if (response.success) {
                setEstudiantes(response.estudiantes || []);
                setTotalPages(response.totalPages || 1);
                setTotalEstudiantes(response.total || 0);
                setError('');
            } else {
                setError(response.error || 'Error al cargar estudiantes');
                setEstudiantes([]);
            }
        } catch (err) {
            console.error('Error al cargar estudiantes:', err);
            setError('Error de conexión al cargar estudiantes');
            setEstudiantes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEstudiantes(page);
    }, [page, refreshKey]); // Añadir refreshKey como dependencia

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

    const handleAccion = async (accion, estudiante) => {
        // Para todas las acciones, obtenemos los datos completos del estudiante
        try {
            const response = await fetch(`http://localhost:5000/api/consultar-estudiantes-dni/${estudiante.dni}`);
            const data = await response.json();
            
            if (data.success) {
                // Estructurar los datos completos para cualquier acción
                const estudianteCompleto = {
                    ...data.estudiante,
                    // Datos de domicilio
                    calle: data.domicilio?.calle || '',
                    numero: data.domicilio?.numero || '',
                    barrio: data.domicilio?.barrio || '',
                    localidad: data.domicilio?.localidad || '',
                    pcia: data.domicilio?.provincia || '',
                    // Datos académicos
                    modalidad: data.inscripcion?.modalidad || '',
                    planAnio: data.inscripcion?.plan || '',
                    modulo: data.inscripcion?.modulo || '',
                    estadoInscripcion: data.inscripcion?.estado || '',
                    fechaInscripcion: data.inscripcion?.fechaInscripcion || '',
                    idInscripcion: data.inscripcion?.idInscripcion || null,
                    // Documentación
                    documentacion: data.documentacion || []
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
                    <h2 className="lista-titulo">Lista de Estudiantes</h2>
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
                <h2 className="lista-titulo">Lista de Estudiantes</h2>
                <p className="lista-subtitulo">Total: {totalEstudiantes} estudiantes</p>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button 
                        className="btn-reintentar" 
                        onClick={() => cargarEstudiantes(page)}
                    >
                        Reintentar
                    </button>
                </div>
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
                                    <th>Modalidad</th>
                                    <th>Curso/Plan</th>
                                    <th>Estado de Inscripción</th>
                                    <th>Fecha Inscripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.map((estudiante) => (
                                    <tr key={estudiante.dni || estudiante.idEstudiante}>
                                        <td>{estudiante.id}</td>
                                        <td>{estudiante.dni}</td>
                                        <td>{`${estudiante.nombre} ${estudiante.apellido}`}</td>
                                        <td>{estudiante.modalidad}</td>
                                        <td>{estudiante.cursoPlan || 'Sin asignar'}</td>
                                        <td>
                                            <span className={`estado estado-${estudiante.estadoInscripcion?.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {estudiante.estadoInscripcion || 'Sin estado'}
                                            </span>
                                        </td>
                                        <td>{formatearFecha(estudiante.fechaInscripcion)}</td>
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
                                                            onClick={() => handleAccion('Eliminar', estudiante)}
                                                            title="Eliminar estudiante"
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
        </div>
    );
};

ListaEstudiantes.propTypes = {
    onAccion: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onVolver: PropTypes.func, // Callback para el botón "Volver"
    soloParaEliminacion: PropTypes.bool,
    refreshKey: PropTypes.number, // Clave para forzar recarga de datos
};

export default ListaEstudiantes;