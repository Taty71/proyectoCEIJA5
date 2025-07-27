import { useState } from 'react';
import PropTypes from 'prop-types';
const TarjetaDomicilio = ({ estudiante, onModificar, isConsulta }) => {
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
        <div className="tarjeta">
            <div className="tarjeta-header">
                <h3>Domicilio</h3>
                {!isConsulta && (
                    <button className="btn-editar-seccion" onClick={() => setEditMode(true)} title="Editar domicilio">✏️</button>
                )}
            </div>
            <div className="tarjeta-contenido">
                <div className="dato-item">
                    <label>Calle:</label>
                    {editMode ? (
                        <input value={formData.calle || ''} onChange={e => handleInputChange('calle', e.target.value)} />
                    ) : (
                        <span>{estudiante.calle}</span>
                    )}
                </div>
                <div className="dato-item">
                    <label>Número:</label>
                    {editMode ? (
                        <input value={formData.numero || ''} onChange={e => handleInputChange('numero', e.target.value)} />
                    ) : (
                        <span>{estudiante.numero}</span>
                    )}
                </div>
                <div className="dato-item">
                    <label>Barrio:</label>
                    {editMode ? (
                        <input value={formData.barrio || ''} onChange={e => handleInputChange('barrio', e.target.value)} />
                    ) : (
                        <span>{estudiante.barrio}</span>
                    )}
                </div>
                <div className="dato-item">
                    <label>Localidad:</label>
                    {editMode ? (
                        <input value={formData.localidad || ''} onChange={e => handleInputChange('localidad', e.target.value)} />
                    ) : (
                        <span>{estudiante.localidad}</span>
                    )}
                </div>
                <div className="dato-item">
                    <label>Provincia:</label>
                    {editMode ? (
                        <input value={formData.pcia || ''} onChange={e => handleInputChange('pcia', e.target.value)} />
                    ) : (
                        <span>{estudiante.pcia}</span>
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
TarjetaDomicilio.propTypes = {
    estudiante: PropTypes.object.isRequired,
    onModificar: PropTypes.func,
    isConsulta: PropTypes.bool
};
export default TarjetaDomicilio;
