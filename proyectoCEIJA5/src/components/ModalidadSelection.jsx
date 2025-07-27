// src/components/ModalidadSelection.jsx
import PropTypes from 'prop-types';
import { useEffect, useRef, memo } from 'react';
import PlanAnioSelector from './PlanAnioSelector';
import EstadoInscripcion from './EstadoInscripcion'; // Asegúrate de que la ruta sea correcta
import { formatearFecha } from '../utils/fecha'; // Asegúrate de que la ruta sea correcta o define la función si no existe

const ModalidadSelection = memo(({ modalidad, modalidadId, handleChange, setFieldValue, values, showMateriasList, editMode, formData, setFormData }) => {
    const prevValuesRef = useRef();

    // Solo hacer log cuando cambien valores importantes
    useEffect(() => {
        if (import.meta.env.DEV) {
            const currentImportantValues = {
                modalidad,
                planAnio: values.planAnio,
                modalidadId,
                showMateriasList
            };

            const prevValues = prevValuesRef.current;
            
            // Solo hacer log si es el primer render o si cambió algo importante
            if (!prevValues || 
                prevValues.modalidad !== modalidad ||
                prevValues.planAnio !== values.planAnio ||
                prevValues.modalidadId !== modalidadId ||
                prevValues.showMateriasList !== showMateriasList) {
                
                console.log(`[ModalidadSelection] Modalidad: ${modalidad}, planAnio: ${values.planAnio}, modalidadId: ${modalidadId}, showMateriasList: ${showMateriasList}`);
                
                prevValuesRef.current = currentImportantValues;
            }
        }
    }, [modalidad, values.planAnio, modalidadId, showMateriasList]);

    return (
        <div className="form-eleccion">
            <h3>Modalidad: <span className="modalidad-elegida">{modalidad || ''}</span></h3>
            {/* El select de modalidad ha sido eliminado. Solo se muestra la modalidad seleccionada por props. */}
            <div className="form-group">
                <PlanAnioSelector
                    modalidad={modalidad}
                    modalidadId={modalidadId}
                    value={values}
                    setFieldValue={setFieldValue}
                    showMateriasList={showMateriasList}
                    handleChange={handleChange}
                />
            </div>

            {/* Mostrar solo si formData tiene modalidad real, si no, ocultar este bloque */}
            {formData?.modalidad && (
                <div className="dato-item">
                    <label>Modalidad:</label>
                    <span style={{ fontWeight: 600 }}>{formData?.modalidad}</span>
                </div>
            )}

            {editMode?.academica ? (
                <PlanAnioSelector
                    modalidad={formData?.modalidad}
                    modalidadId={formData?.modalidadId}
                    value={formData}
                    setFieldValue={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    showMateriasList={false}
                    handleChange={() => {}}
                />
            ) : (
                <>
                    {formData?.modalidad === 'Presencial' && (
                        <div className="dato-item">
                            <label>Año:</label>
                            <span>{formData?.planAnio || 'No especificado'}</span>
                        </div>
                    )}
                    {formData?.modalidad === 'Semipresencial' && (
                        <>
                            <div className="dato-item">
                                <label>Plan:</label>
                                <span>{formData?.planAnio || 'No especificado'}</span>
                            </div>
                            <div className="dato-item">
                                <label>Módulo:</label>
                                <span>{formData?.modulo || 'No especificado'}</span>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Mostrar solo si formData tiene estadoInscripcion real, si no, ocultar este bloque */}
            {formData?.estadoInscripcion && (
                <div className="dato-item">
                    <label>Estado de Inscripción:</label>
                    {editMode?.academica ? (
                        <EstadoInscripcion
                            value={formData?.estadoInscripcionId || ''}
                            handleChange={e => setFormData(prev => ({
                                ...prev,
                                estadoInscripcionId: Number(e.target.value),
                                estadoInscripcion: e.target.options
                                    ? e.target.options[e.target.selectedIndex]?.text
                                    : prev.estadoInscripcion
                            }))}
                            errors={{}}
                        />
                    ) : (
                        <span>{formData?.estadoInscripcion}</span>
                    )}
                </div>
            )}

            {/* Mostrar solo si formData tiene fechaInscripcion real, si no, ocultar este bloque */}
            {formData?.fechaInscripcion && (
                <div className="dato-item">
                    <label>Fecha de inscripción:</label>
                    <span>{formatearFecha(formData.fechaInscripcion)}</span>
                </div>
            )}
        </div>
    );
});

// Agregar displayName para React DevTools
ModalidadSelection.displayName = "ModalidadSelection";

ModalidadSelection.propTypes = {
    modalidad: PropTypes.string.isRequired,
    modalidadId: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    showMateriasList: PropTypes.bool.isRequired,
    editMode: PropTypes.shape({
        academica: PropTypes.bool
    }).isRequired,
    formData: PropTypes.shape({
        modalidad: PropTypes.string,
        modalidadId: PropTypes.number,
        planAnio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        modulo: PropTypes.string,
        estadoInscripcionId: PropTypes.number,
        estadoInscripcion: PropTypes.string,
        fechaInscripcion: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    }).isRequired,
    setFormData: PropTypes.func.isRequired
};

export default ModalidadSelection;
