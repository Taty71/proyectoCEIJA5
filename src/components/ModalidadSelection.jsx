import PropTypes from 'prop-types';
import { Field, ErrorMessage} from 'formik';
import PlanOrYearSelector from './PlanOrYearSelector';
import Input from './Input';

const ModalidadSelection = ({ modalidad, setFieldValue, values }) => {
    return (
        <div className="form-eleccion">
            <h3>Modalidad Presencial/Semipresencial</h3>
            <div className="form-group">
            <Input
                    label="Modalidad"
                    name="modalidad"
                    type="text"
                    registro={{ as: Field, value: modalidad, readOnly: true }}
                    className="selectModalidad"
                    error={<ErrorMessage name="modalidad" component="div" className="error" />}
                />
            </div>
            <div className="form-group">
                <PlanOrYearSelector 
                    modalidad={modalidad} 
                    handleChange={(e) => setFieldValue('planAnio', e.target.value)} 
                    value={values.planAnio} 
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
};

export default ModalidadSelection;

