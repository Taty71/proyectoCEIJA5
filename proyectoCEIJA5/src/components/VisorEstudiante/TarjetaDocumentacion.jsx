import { useState } from 'react';
import PropTypes from 'prop-types';
const TarjetaDocumentacion = ({ estudiante, onModificar, isConsulta }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...estudiante });
    // Aquí podrías agregar lógica para editar la documentación presentada
    const handleGuardar = () => {
        if (onModificar) onModificar({ ...estudiante, ...formData });
        setEditMode(false);
    };
    const handleCancelar = () => {
        setFormData({ ...estudiante });
        setEditMode(false);
    };
    return (
        <div className="tarjeta">
            <div className="tarjeta-header">
                <h3>Documentación Presentada</h3>
                {!isConsulta && (
                    <button className="btn-editar-seccion" onClick={() => setEditMode(true)} title="Editar documentación">✏️</button>
                )}
            </div>
            <div className="tarjeta-contenido">
                {/* Aquí podrías mostrar y editar la documentación */}
                {estudiante.documentacion && estudiante.documentacion.length > 0 ? (
                    <div className="documentacion-lista-tarjeta">
                        {estudiante.documentacion.map((doc, index) => (
                            <div key={index} className={`documento-item-tarjeta ${!doc.archivoDocumentacion ? 'faltante' : ''}`}>
                                <div className="documento-info">
                                    <span className="documento-icono" data-estado={doc.estadoDocumentacion?.toLowerCase()}>
                                        {doc.estadoDocumentacion?.toLowerCase() === 'entregado' ? '✓' : '✗'}
                                    </span>
                                    <span className="documento-nombre-corto">{doc.descripcionDocumentacion}</span>
                                </div>
                                <div className="documento-acciones">
                                    {doc.archivoDocumentacion ? (
                                        <a href={`http://localhost:5000${doc.archivoDocumentacion}`} target="_blank" rel="noopener noreferrer" className="btn-ver-archivo-mini" title="Ver documento">👁️</a>
                                    ) : (
                                        <span className="documento-faltante" title="Documento faltante">❌</span>
                                    )}
                                    {editMode && (
                                        <button className="btn-subir-archivo-mini" title="Subir/Cambiar archivo">📤</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-documentacion">
                        <p>No se encontró documentación.</p>
                        {editMode && (
                            <button className="btn-agregar-documentacion">➕ Agregar Documentación</button>
                        )}
                    </div>
                )}
            </div>
            {editMode && (
                <div className="visor-acciones" style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button className="btn-guardar-seccion" onClick={handleGuardar} style={{ marginRight: '1rem' }}>Guardar</button>
                    <button className="btn-cancelar-seccion" onClick={handleCancelar}>Cancelar</button>
                </div>
            )}
        </div>
    );
};
TarjetaDocumentacion.propTypes = {
    estudiante: PropTypes.object.isRequired,
    onModificar: PropTypes.func,
    isConsulta: PropTypes.bool
};
export default TarjetaDocumentacion;
