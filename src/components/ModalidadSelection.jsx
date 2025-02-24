import PropTypes from 'prop-types';
//import { Field, ErrorMessage } from 'formik';
import PlanOrYearSelector from './PlanAnioSelector';

//import Input from './Input';

const ModalidadSelection = ({ modalidad, handleChange, setFieldValue, values, showMateriasList }) => {
    return (
        <div className="form-eleccion">
            <h3>Modalidad {modalidad}</h3>
            {/*<div className="form-group">
                <Input
                    label="Modalidad"
                    name="modalidad"
                    type="text"
                    registro={{ as: Field, value: modalidad, readOnly: true }}
                    className="selectModalidad"
                    error={<ErrorMessage name="modalidad" component="div" className="error" />}
                />
            </div>*/}
            <div className="form-group">
                <PlanOrYearSelector
                    modalidad={modalidad}
                    handleChange={handleChange}
                    /*handleChange={(e) => setFieldValue('planAnio', e.target.value)}*/
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