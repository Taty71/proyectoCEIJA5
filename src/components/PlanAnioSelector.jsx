import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../estilos/estilosDocumentacion.css';
import AlertaMens from './AlertaMens';
import Input from './Input';
import service from '../services/service'; // Asegúrate de que la ruta es correcta
import BotonCargando from './BotonCargando';
import AreaEstudioSelector from './AreaEstudioSelector';

const PlanAnioSelector = ({ modalidad, handleChange, value, modalidadId }) => {
    const [alerta, setAlerta] = useState(false);
    const [idModulo, setIdModulo] = useState('');
    const [modulos, setModulos] = useState([]); // Aquí almacenamos los módulos
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
    const [error, setError] = useState(null); // Para manejar posibles errores de la API

    const handleSelection = (event) => {
        const newValue = event.target.value;
        handleChange(event); // Actualiza el valor en Formik
        setAlerta(newValue === ""); // Muestra la alerta si no selecciona nada
    };

    const handleModuloChange = (event) => {
        setIdModulo(event.target.value);
    };

    // Efecto para obtener los módulos cuando la modalidad cambia
    useEffect(() => {
        console.log("Modalidad actual:", modalidad);
    
        if (modalidad !== "Semipresencial" && modalidadId !== 2) return;
        
        const fetchModulos = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Cargando módulos para modalidad:", modalidadId);
                const response = await service.getModulos(modalidadId);
                console.log("Respuesta de la API:", response);
                
                // Verifica si la respuesta tiene el formato correcto
                if (response && Array.isArray(response)) {
                    setModulos(response);
                } else if (response.data && Array.isArray(response.data)) {
                    setModulos(response.data);
                } else {
                    setError('La respuesta no es un array de módulos');
                }
            } catch (error) {
                console.error("Error en la carga de módulos:", error);
                setError('Error al cargar los módulos');
            } finally {
                setLoading(false);
            }
        };
        
        fetchModulos();
    }, [modalidadId, modalidad]);

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
                            { value: 1, label: '1er Año' },
                            { value: 2, label: '2do Año' },
                            { value: 3, label: '3er Año' },
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
                            { value: 4, label: 'Plan A' },
                            { value: 5, label: 'Plan B' },
                            { value: 6, label: 'Plan C' },
                        ]}
                        registro={{ value, onChange: handleSelection }}
                        error={alerta && <AlertaMens text="Por favor, selecciona un plan." variant="error" />}
                    />
                </div>
            )}
            {modalidadId === 2 && value && (
                <div className="form-group">
                    <label htmlFor="modulo">Seleccionar Módulo:</label>
                    {loading ? (
                        <BotonCargando/> // Muestra un mensaje mientras carga
                    ) : error ? (
                        <p>{error}</p> // Muestra un mensaje de error si ocurre un problema
                    ) : (
                        <select id={modalidadId} value={idModulo} onChange={handleModuloChange}>
                            <option value="">Seleccionar Módulo</option>
                            {modulos && Array.isArray(modulos) && modulos.length > 0 ? (
                                modulos.map((modulo) => (
                                    <option key={modulo.id} value={modulo.id}>
                                        {modulo.nombre}
                                    </option>
                                ))
                            ) : (
                                <option value="">No hay módulos disponibles</option>
                            )}
                        </select>
                    )}
                </div>
            )}
            {idModulo && (
                <AreaEstudioSelector idModulo={idModulo} modalidadId={modalidadId} handleChange={handleModuloChange} />
           )}
        </div>
    );
};

PlanAnioSelector.propTypes = {
    modalidad: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    modalidadId: PropTypes.number.isRequired,
};

export default PlanAnioSelector;