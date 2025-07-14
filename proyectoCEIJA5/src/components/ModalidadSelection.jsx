// src/components/ModalidadSelection.jsx
import PropTypes from 'prop-types';
import PlanAnioSelector from './PlanAnioSelector';

const ModalidadSelection = ({ modalidad, modalidadId, handleChange, setFieldValue, values, showMateriasList }) => {
    console.log(`Modalidad seleccionada: ${modalidad}, Valor de planAnio: ${values.planAnio}, modalidadId: ${modalidadId}, Mostrar lista de materias: ${showMateriasList}, Valores:`, values);

    return (
        <div className="form-eleccion">
            <h3>Modalidad: {modalidad}</h3>

            <div className="form-group">
                <PlanAnioSelector
                    modalidad={modalidad}
                    modalidadId={modalidadId}
                    value={values.planAnio}
                    setFieldValue={setFieldValue}
                    showMateriasList={showMateriasList}
                    handleChange={handleChange}
                />
            </div>
        </div>
    );
};

ModalidadSelection.propTypes = {
    modalidad: PropTypes.string.isRequired,
    modalidadId: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    showMateriasList: PropTypes.bool.isRequired,
};

export default ModalidadSelection;
