import { useState } from 'react';
import PropTypes from 'prop-types';
import '../estilos/estilosDocumentacion.css';
import AlertaMens from './AlertaMens';
import Input from './Input';
import MateriasList from './MateriasList';

const PlanOrYearSelector = ({ modalidad, handleChange, value, showMateriasList }) => {
    const [alerta, setAlerta] = useState(false);
    const [selectedModulo, setSelectedModulo] = useState('');

    const handleSelection = (event) => {
        handleChange(event); // Actualiza el valor en Formik
        setAlerta(event.target.value === ""); // Muestra la alerta si no selecciona nada
    };

    const handleModuloChange = (event) => {
        setSelectedModulo(event.target.value);
    };

    return (
        <div>
            {modalidad === 'Presencial' && (
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
            )}
            {modalidad === 'Semipresencial' && (
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
            )}
            {modalidad === 'Semipresencial' && value && (
                <div className="form-group">
                    <label htmlFor="modulo">Seleccionar Módulo:</label>
                    <select id="modulo" value={selectedModulo} onChange={handleModuloChange}>
                        <option value="">Seleccionar Módulo</option>
                        {[...Array(9)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>
                                Módulo {index + 1}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {showMateriasList && value && (
                <MateriasList idAnioPlan={parseInt(value)} modalidad={modalidad} selectedModulo={selectedModulo} />
            )}
        </div>
    );
};

PlanOrYearSelector.propTypes = {
    modalidad: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    showMateriasList: PropTypes.bool.isRequired,
};

export default PlanOrYearSelector;