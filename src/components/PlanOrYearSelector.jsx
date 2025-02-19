import { useState } from 'react';
import PropTypes from 'prop-types';
import '../estilos/estilosDocumentacion.css';
import AlertaMens from './AlertaMens';
import Input from './Input';

const PlanOrYearSelector = ({ modalidad, handleChange, value}) => { 
    const [alerta, setAlerta] = useState(false);

    const handleSelection = (event) => {
        handleChange(event); // Actualiza el valor en Formik
        setAlerta(event.target.value === ""); // Muestra la alerta si no selecciona nada
    };

    if (modalidad === 'Presencial') { 
        return ( 
            <div className="form-group"> 
                <Input 
                    className="selectPlanAnio"
                    label="Año"
                    name="planAnio"
                    type="select"
                    options={[
                        { value: '', label: 'Seleccionar Año' },
                        { value: '1er Año', label: '1er Año' },
                        { value: '2do Año', label: '2do Año' },
                        { value: '3er Año', label: '3er Año' },
                    ]}
                    registro={{ value, onChange: handleSelection }}
                    error={alerta && <AlertaMens text="Por favor, selecciona un año." variant="error" />}
                />
            </div>
        );
    } else if (modalidad === 'Semipresencial') { 
        return ( 
            <div className="form-group"> 
                <Input
                    className="selectPlanAnio"
                    label="Plan"
                    name="planAnio"
                    type="select"
                    options={[
                        { value: '', label: 'Seleccionar Plan' },
                        { value: 'Plan A', label: 'Plan A' },
                        { value: 'Plan B', label: 'Plan B' },
                        { value: 'Plan C', label: 'Plan C' },
                    ]}
                    registro={{ value, onChange: handleSelection }}
                    error={alerta && <AlertaMens text="Por favor, selecciona un plan." variant="error" />}
                />
            </div>
        ); 
    } 
    return null; 
}; 
PlanOrYearSelector.propTypes = {
    modalidad: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default PlanOrYearSelector;

