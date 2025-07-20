import PropTypes from 'prop-types';
import '../estilos/consultaEstd.css';
import CloseButton from '../components/CloseButton'; // Importa el componente CloseButton


// Función para formatear la fecha
const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const ConsultaEstd = ({ data, onClose }) => {
    // Si por alguna razón el objeto no trae success true, mostramos mensaje genérico
    if (!data?.success) {
        return (
            <div className="modal-overlay">
                <div className="modal-container">
                    <CloseButton onClose={onClose} />
                    <p>No se encontraron datos para el estudiante.</p>
                </div>
            </div>
        );
    }

    // Desestructuramos directamente
    const { estudiante, domicilio, inscripcion, documentacion } = data;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <CloseButton onClose={onClose} />
                <h1 className="consultaEstdHeader">Consulta Completa del Estudiante</h1>
                
                <div className="consultaEstdRow">
                    {/* Datos Personales */}
                    <div className="consultaEstdSection">
                        <h3>Datos Personales</h3>
                        <p><strong>Nombre:</strong> {estudiante?.nombre || 'No especificado'}</p>
                        <p><strong>Apellido:</strong> {estudiante?.apellido || 'No especificado'}</p>
                        <p><strong>DNI:</strong> {estudiante?.dni || 'No especificado'}</p>
                        <p><strong>CUIL:</strong> {estudiante?.cuil || 'No especificado'}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {formatDate(estudiante?.fechaNacimiento)}</p>
                        <p><strong>Tipo de Documento:</strong> {estudiante?.tipoDocumento || 'DNI'}</p>
                        <p><strong>País de Emisión:</strong> {estudiante?.paisEmision || 'Argentina'}</p>
                    </div>

                    {/* Domicilio */}
                    <div className="consultaEstdSection">
                        <h3>Domicilio</h3>
                        {domicilio ? (
                            <>
                                <p><strong>Calle:</strong> {domicilio.calle || 'No especificado'}</p>
                                <p><strong>Número:</strong> {domicilio.numero || 'No especificado'}</p>
                                <p><strong>Barrio:</strong> {domicilio.barrio || 'No especificado'}</p>
                                <p><strong>Localidad:</strong> {domicilio.localidad || 'No especificado'}</p>
                                <p><strong>Provincia:</strong> {domicilio.provincia || 'No especificado'}</p>
                            </>
                        ) : (
                            <p>No se encontraron datos de domicilio.</p>
                        )}
                    </div>

                    {/* Información Académica */}
                    <div className="consultaEstdSection">
                        <h3>Información Académica</h3>
                        {inscripcion ? (
                            <>
                                <p><strong>Modalidad:</strong> {inscripcion.modalidad || 'No especificada'}</p>
                                <p><strong>Curso / Plan:</strong> {inscripcion.plan || inscripcion.planAnio || 'No especificado'}</p>
                                <p><strong>Módulo:</strong> {inscripcion.modulo || inscripcion.modulos || 'No especificado'}</p>
                                <p><strong>Estado de Inscripción:</strong> 
                                    <span className={`estado-badge estado-${inscripcion.estado?.toLowerCase().replace(/\s+/g, '-') || 'sin-estado'}`}>
                                        {inscripcion.estado || 'No especificado'}
                                    </span>
                                </p>
                                <p><strong>Fecha de Inscripción:</strong> {formatDate(inscripcion?.fechaInscripcion)}</p>
                            </>
                        ) : (
                            <p>No se encontraron datos de inscripción.</p>
                        )}
                    </div>
                </div>

                {/* Documentación */}
                <div className="consultaEstdSection documentacion-section">
                    <h3>Documentación Presentada</h3>
                    {documentacion && Array.isArray(documentacion) && documentacion.length > 0 ? (
                        <div className="documentacion-lista">
                            <div className="documentacion-header">
                                <span className="doc-nombre">Documento</span>
                                <span className="doc-estado">Estado</span>
                                <span className="doc-fecha">Fecha de Entrega</span>
                                <span className="doc-archivo">Archivo</span>
                            </div>
                            {documentacion.map((doc, index) => (
                                <div key={index} className="documentacion-item">
                                    <span className="doc-nombre">{doc.descripcionDocumentacion || 'Documento sin nombre'}</span>
                                    <span className={`doc-estado estado-${doc.estadoDocumentacion?.toLowerCase() || 'faltante'}`}>
                                        {doc.estadoDocumentacion || 'Faltante'}
                                    </span>
                                    <span className="doc-fecha">
                                        {doc.fechaEntrega ? formatDate(doc.fechaEntrega) : 'No entregado'}
                                    </span>
                                    <span className="doc-archivo">
                                        {doc.archivoDocumentacion ? (
                                            <a 
                                                href={doc.archivoDocumentacion} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="btn-ver-archivo"
                                            >
                                                Ver
                                            </a>
                                        ) : (
                                            <span className="sin-archivo">Sin archivo</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-documentacion">No se encontró documentación registrada para este estudiante.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

ConsultaEstd.propTypes = {
    data: PropTypes.shape({
        success: PropTypes.bool.isRequired,
        estudiante: PropTypes.object.isRequired,
        domicilio: PropTypes.object,
        inscripcion: PropTypes.object,
        documentacion: PropTypes.arrayOf(
            PropTypes.shape({
                idDocumentaciones: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                descripcionDocumentacion: PropTypes.string,
                estadoDocumentacion: PropTypes.string,
                fechaEntrega: PropTypes.string,
                archivoDocumentacion: PropTypes.string,
            })
        ),
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ConsultaEstd;
