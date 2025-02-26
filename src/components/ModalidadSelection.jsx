import PropTypes from 'prop-types';
import PlanAnioSelector from './PlanAnioSelector';

const ModalidadSelection = ({ modalidad, handleChange, setFieldValue, values, showMateriasList }) => {
    console.log(`Modalidad seleccionada: ${modalidad}, Valor de planAnio: ${values.planAnio}, Valor Modalidad: ${values.modalidadId} Mostrar lista de materias: ${showMateriasList}, Valores:`, values);

    // Función para asignar el valor de planAnio según la modalidad seleccionada
    const handleModalidadChange = (event) => {
        const modalidadSeleccionada = event.target.value;
        const modalidadId = modalidadSeleccionada === 'Presencial' ? 1 : 2;
        // Asignar 1 o 2 dependiendo de la modalidad
        const planAnioValue = modalidadSeleccionada === 'Presencial' ? 1 : 2;

        // Actualizamos el campo de planAnio con el valor correspondiente
        setFieldValue('planAnio', planAnioValue);

        // Pasamos también el valor de la modalidad seleccionada
        setFieldValue('modalidad', modalidadSeleccionada);
        setFieldValue('modalidadId', modalidadId); // Actualizamos el campo modalidadId
        
        // Llamar a handleChange para propagar el cambio a Formik
        handleChange(event);
    };

    return (
        <div className="form-eleccion">
            <h3>Modalidad {modalidad}</h3>
          
            <div className="form-group">
                <PlanAnioSelector
                    modalidad={modalidad}
                    modalidadId={values.modalidadId} // Pasar el valor de modalidadId
                    handleChange={handleModalidadChange}  // Usar la nueva función de manejo de cambio
                    values={values}
                    setFieldValue={setFieldValue}
                    value={values.planAnio}
                    showMateriasList={showMateriasList}
                />
            </div>
        </div>
    );
};

ModalidadSelection.propTypes = {
    modalidad: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    showMateriasList: PropTypes.bool.isRequired,
};

export default ModalidadSelection;