import { useState } from 'react';
import PropTypes from 'prop-types';
import service from '../services/service';
import Input from './Input';
import AlertaMens from './AlertaMens';
import '../estilos/estilosDocumentacion.css';  

const BusquedaDNI = ({ onEstudianteEncontrado }) => {
    const [dni, setDni] = useState('');
    const [error, setError] = useState(null);  // Para manejar errores
   
    const handleChange = (e) => {
        setDni(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await service.getByDocumento(dni);
            if (response.status === 'success') {
                setError(null);  // Limpiar el error si se encuentra el estudiante
                onEstudianteEncontrado(response.data.data);  // Pasar los datos del estudiante encontrado
            } else {
                onEstudianteEncontrado(null);
                setError('No se encontró un estudiante con ese DNI.');
            }
        } catch (error) {
            console.error('Error al consultar el DNI:', error);
            onEstudianteEncontrado(null);
            setError('Hubo un error al buscar el estudiante.');
        }
    };

    return (
        <div>
            <h2>Consulta de Estudiante por DNI</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    label="DNI"
                    type="number"
                    name="dni"
                    placeholder="Ingresa el DNI"
                    registro={{ value: dni, onChange: handleChange }}
                    error={error && <AlertaMens text={error} variant="error" />}
                />
                <button type="submit" className='buttonF'>Consultar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} 
            {/* Mostrar mensaje de error */}
        </div>
    );
};

BusquedaDNI.propTypes = {
    onEstudianteEncontrado: PropTypes.func.isRequired,
};

export default BusquedaDNI;