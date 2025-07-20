import PropTypes from 'prop-types';
import CloseButton from './CloseButton';
import VolverButton from './VolverButton';
import '../estilos/visorEstudiante.css';
import '../estilos/estilosInscripcion.css'; // Importa los estilos para modal-header-buttons

const VisorEstudiante = ({ estudiante, onClose, onModificar, onVolver, isConsulta = false, isEliminacion = false }) => {
    const formatearFecha = (fecha) => {
        if (!fecha) return 'No disponible';
        try {
            return new Date(fecha).toLocaleDateString('es-AR');
        } catch {
            return 'Fecha inválida';
        }
    };

    if (!estudiante) {
        return (
            <div className="visor-estudiante-container">
                {/* Contenedor de botones superior */}
                <div className="modal-header-buttons">
                    {onVolver && (
                        <VolverButton onClick={onVolver} />
                    )}
                    {onClose && (
                        <CloseButton onClose={onClose} variant="modal" />
                    )}
                </div>
                <div className="no-data">
                    <p>No hay datos del estudiante para mostrar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`visor-estudiante-container ${isConsulta ? 'modo-consulta' : 'modo-gestion'}`}>
            {/* Contenedor de botones superior */}
            <div className="modal-header-buttons">
                {onVolver && (
                    <VolverButton onClick={onVolver} />
                )}
                {onClose && (
                    <CloseButton onClose={onClose} variant="modal" />
                )}
            </div>
            
            <div className="visor-header">
                <h2>
                    {isEliminacion ? 'Eliminar Estudiante' : 
                     isConsulta ? 'Consulta de Estudiante' : 
                     'Detalles del Estudiante'}
                </h2>
                {!isConsulta && !isEliminacion && onModificar && (
                    <button 
                        className="btn-modificar-header"
                        onClick={onModificar}
                        title="Modificar estudiante"
                    >
                        ✏️ Modificar
                    </button>
                )}
            </div>

            <div className={`visor-contenido ${isConsulta ? 'layout-tarjetas' : 'layout-vertical'}`}>
                {/* Diseño de tarjetas para consulta con iconos de edición */}
                <div className="tarjetas-container">
                    {/* Tarjeta 1: Datos Personales */}
                    <div className="tarjeta">
                        <div className="tarjeta-header">
                            <h3>Datos Personales</h3>
                            {!isConsulta && !isEliminacion && onModificar && (
                                <button 
                                    className="btn-editar-seccion"
                                    onClick={onModificar}
                                    title="Editar datos personales"
                                >
                                    ✏️
                                </button>
                            )}
                        </div>
                        <div className="tarjeta-contenido">
                            <div className="dato-item">
                                <label>Nombre:</label>
                                <span>{estudiante.nombre}</span>
                                {!isConsulta && !isEliminacion && onModificar && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>Apellido:</label>
                                <span>{estudiante.apellido}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>DNI:</label>
                                <span>{estudiante.dni}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>CUIL:</label>
                                <span>{estudiante.cuil}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>Fecha de Nacimiento:</label>
                                <span>{formatearFecha(estudiante.fechaNacimiento)}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>Tipo de Documento:</label>
                                <span>{estudiante.tipoDocumento || 'DNI'}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>País de Emisión:</label>
                                <span>{estudiante.paisEmision || 'Argentina'}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 2: Domicilio */}
                    <div className="tarjeta">
                        <div className="tarjeta-header">
                            <h3>Domicilio</h3>
                            {!isConsulta && !isEliminacion && onModificar && (
                                <button 
                                    className="btn-editar-seccion"
                                    onClick={onModificar}
                                    title="Editar domicilio"
                                >
                                    ✏️
                                </button>
                            )}
                        </div>
                        <div className="tarjeta-contenido">
                            <div className="dato-item">
                                <label>Calle:</label>
                                <span>{estudiante.calle}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>Número:</label>
                                <span>{estudiante.numero}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>Barrio:</label>
                                <span>{estudiante.barrio}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>Localidad:</label>
                                <span>{estudiante.localidad}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>Provincia:</label>
                                <span>{estudiante.pcia}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 3: Información Académica */}
                    <div className="tarjeta">
                        <div className="tarjeta-header">
                            <h3>Información Académica</h3>
                            {!isConsulta && !isEliminacion && onModificar && (
                                <button 
                                    className="btn-editar-seccion"
                                    onClick={onModificar}
                                    title="Editar información académica"
                                >
                                    ✏️
                                </button>
                            )}
                        </div>
                        <div className="tarjeta-contenido">
                            <div className="dato-item">
                                <label>Modalidad:</label>
                                <span>{estudiante.modalidad}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            
                            {/* Campos específicos según modalidad */}
                            {estudiante.modalidad?.toLowerCase() === 'presencial' ? (
                                <div className="dato-item">
                                    <label>Curso:</label>
                                    <span>{estudiante.planAnio || 'No especificado'}</span>
                                    {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                                </div>
                            ) : (
                                <div className="dato-item">
                                    <label>Plan:</label>
                                    <span>{estudiante.planAnio || 'No especificado'}</span>
                                    {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                                </div>
                            )}
                            
                            <div className="dato-item">
                                <label>Estado de Inscripción:</label>
                                <span className={`estado estado-${estudiante.estadoInscripcion?.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {estudiante.estadoInscripcion || 'Sin estado'}
                                </span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                            <div className="dato-item">
                                <label>Fecha de Inscripción:</label>
                                <span>{formatearFecha(estudiante.fechaInscripcion)}</span>
                                {!isConsulta && <button className="btn-editar-campo" onClick={onModificar}>✏️</button>}
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 4: Documentación */}
                    <div className="tarjeta">
                        <div className="tarjeta-header">
                            <h3>Documentación Presentada</h3>
                            {!isConsulta && !isEliminacion && onModificar && (
                                <button 
                                    className="btn-editar-seccion"
                                    onClick={onModificar}
                                    title="Editar documentación"
                                >
                                    ✏️
                                </button>
                            )}
                        </div>
                        <div className="tarjeta-contenido">
                            {estudiante.documentacion && estudiante.documentacion.length > 0 ? (
                                <div className="documentacion-lista-tarjeta">
                                    {estudiante.documentacion.map((doc, index) => (
                                        <div key={index} className="documento-item-tarjeta">
                                            <div className="documento-info">
                                                <span 
                                                    className="documento-icono"
                                                    data-estado={doc.estadoDocumentacion?.toLowerCase()}
                                                >
                                                    {doc.estadoDocumentacion?.toLowerCase() === 'entregado' ? '✓' : '✗'}
                                                </span>
                                                <span className="documento-nombre-corto">{doc.descripcionDocumentacion}</span>
                                            </div>
                                            <div className="documento-acciones">
                                                {doc.archivoDocumentacion && (
                                                    <a 
                                                        href={`http://localhost:5000${doc.archivoDocumentacion}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-ver-archivo-mini"
                                                        title="Ver documento"
                                                    >
                                                        👁️
                                                    </a>
                                                )}
                                                {!isConsulta && !isEliminacion && onModificar && (
                                                    <button 
                                                        className="btn-subir-archivo-mini" 
                                                        onClick={onModificar}
                                                        title="Subir/Cambiar archivo"
                                                    >
                                                        📤
                                                    </button>
                                                )}
                                                {!isConsulta && !isEliminacion && onModificar && (
                                                    <button className="btn-editar-campo" onClick={onModificar}>✏️</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-documentacion">
                                    <p>No se encontró documentación.</p>
                                    {!isConsulta && !isEliminacion && onModificar && (
                                        <button className="btn-agregar-documentacion" onClick={onModificar}>
                                            ➕ Agregar Documentación
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

VisorEstudiante.propTypes = {
    estudiante: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onModificar: PropTypes.func,
    onVolver: PropTypes.func, // Callback para el botón "Volver"
    isConsulta: PropTypes.bool,
    isEliminacion: PropTypes.bool,
};

export default VisorEstudiante;
