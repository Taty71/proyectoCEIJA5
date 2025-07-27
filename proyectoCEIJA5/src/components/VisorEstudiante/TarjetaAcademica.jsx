import { useState } from 'react';
import PropTypes from 'prop-types';
const TarjetaAcademica = ({ estudiante, onModificar, isConsulta }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...estudiante });
    const handleInputChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };
    const handleGuardar = () => {
        if (onModificar) onModificar({ ...estudiante, ...formData });
        setEditMode(false);
    };
    const handleCancelar = () => {
        setFormData({ ...estudiante });
        setEditMode(false);
    };
    return (
        <div className="tarjeta" style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div className="tarjeta-header" style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <h3>Información Académica</h3>
                {!isConsulta && (
                    <button className="btn-editar-seccion" onClick={() => setEditMode(true)} title="Editar información académica">✏️</button>
                )}
            </div>
            <div className="tarjeta-contenido" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="dato-item">
                    <label>Modalidad:</label>
                    {editMode ? (
                        <select value={formData.modalidad || ''} onChange={e => handleInputChange('modalidad', e.target.value)}>
                            <option value="">Seleccionar modalidad</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Semipresencial">Semipresencial</option>
                        </select>
                    ) : (
                        <span>{estudiante.modalidad}</span>
                    )}
                </div>
                {formData.modalidad?.toLowerCase() === 'presencial' ? (
                    <div className="dato-item">
                        <label>Curso:</label>
                        {editMode ? (
                            <select value={formData.planAnio || ''} onChange={e => handleInputChange('planAnio', e.target.value)}>
                                <option value="">Seleccionar año</option>
                                <option value="1er Año">1er Año</option>
                                <option value="2do Año">2do Año</option>
                                <option value="3er Año">3er Año</option>
                            </select>
                        ) : (
                            <span>{estudiante.planAnio || 'No especificado'}</span>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="dato-item">
                            <label>Plan:</label>
                            {editMode ? (
                                <select value={formData.planAnio || ''} onChange={e => handleInputChange('planAnio', e.target.value)}>
                                    <option value="">Seleccionar plan</option>
                                    <option value="Plan A">Plan A</option>
                                    <option value="Plan B">Plan B</option>
                                    <option value="Plan C">Plan C</option>
                                </select>
                            ) : (
                                <span>{estudiante.planAnio || 'No especificado'}</span>
                            )}
                        </div>
                        <div className="dato-item">
                            <label>Módulo:</label>
                            {editMode ? (
                                <select value={formData.modulo || ''} onChange={e => handleInputChange('modulo', e.target.value)}>
                                    <option value="">Seleccionar módulo</option>
                                    <option value="Módulo 1">Módulo 1</option>
                                    <option value="Módulo 2">Módulo 2</option>
                                    <option value="Módulo 3">Módulo 3</option>
                                </select>
                            ) : (
                                <span>{estudiante.modulo || 'No especificado'}</span>
                            )}
                        </div>
                    </>
                )}
                <div className="dato-item">
                    <label>Estado de Inscripción:</label>
                    {editMode ? (
                        <select value={formData.estadoInscripcion || ''} onChange={e => handleInputChange('estadoInscripcion', e.target.value)}>
                            <option value="">Seleccionar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    ) : (
                        <span className={`estado estado-${estudiante.estadoInscripcion?.toLowerCase().replace(/\s+/g, '-')}`}>{estudiante.estadoInscripcion || 'Sin estado'}</span>
                    )}
                </div>
                <div className="dato-item">
                    <label>Fecha de Inscripción:</label>
                    {editMode ? (
                        <input type="date" value={formData.fechaInscripcion || ''} onChange={e => handleInputChange('fechaInscripcion', e.target.value)} />
                    ) : (
                        <span>{estudiante.fechaInscripcion}</span>
                    )}
                </div>
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
TarjetaAcademica.propTypes = {
    estudiante: PropTypes.object.isRequired,
    onModificar: PropTypes.func,
    isConsulta: PropTypes.bool
};
export default TarjetaAcademica;
