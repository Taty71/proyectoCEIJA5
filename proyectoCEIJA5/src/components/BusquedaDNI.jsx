import { useState } from 'react';
import PropTypes from 'prop-types';
import '../estilos/busquedaDNI.css'; // Importa los estilos propios
import serviceDatos from '../services/serviceDatos';
import BotonCargando from '../components/BotonCargando'; // ajusta la ruta si cambia
import Input from '../components/Input'; // Importa el componente Input
import VolverButton from '../components/VolverButton'; // Importa el componente
import CloseButton from '../components/CloseButton'; // Importa el componente CloseButton
import '../estilos/Modal.css'; // Importa los estilos del modal
import '../estilos/estilosInscripcion.css';
import '../estilos/botonCargando.css';


const BusquedaDNI = ({ onEstudianteEncontrado, onVolver, onClose }) => {
    const [dni, setDni] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
    const soloDigitos = e.target.value.replace(/\D/g, '');
    setDni(soloDigitos);
        if (error) setError(null);            // limpia error al tipear
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!dni || dni.length < 7) {
            setError('El DNI debe tener al menos 7 dígitos.');
            return;
        }
        if (dni.length > 8) {
            setError('El DNI no puede tener más de 8 dígitos.');
            return;
        }

        setLoading(true); // Activa el estado de carga

        try {
            const resultado = await serviceDatos.getEstudianteCompletoByDni(Number(dni));

            // Introduce un retraso adicional antes de desactivar el estado de carga
            setTimeout(() => {
                setLoading(false); // Desactiva el estado de carga después del retraso

                if (resultado?.success) {
                    setError(null);
                    onEstudianteEncontrado(resultado); // Muestra el modal con los datos
                } else {
                    setError(resultado.error || 'No se encontró un estudiante con ese DNI.');
                    onEstudianteEncontrado(null);
                }
            }, 2000); // Retraso de 1 segundo
        } catch (err) {
            console.error(err);

            // Introduce un retraso adicional antes de desactivar el estado de carga en caso de error
            setTimeout(() => {
                setLoading(false); // Desactiva el estado de carga después del retraso
                setError('Hubo un problema al realizar la consulta.');
            }, 1000); // Retraso de 1 segundo
        }
    };

    return (
        <div className="busqueda-dni-container">
            {/* Contenedor para los botones arriba a la derecha */}
            <div className="button-container-right">
                <CloseButton onClose={onClose} />
                <VolverButton onClick={onVolver} />
            </div>
            <h2>Consulta de Estudiante por DNI</h2>
            <form onSubmit={handleSubmit} className="busqueda-dni-form">
                <div className="input-container">
                    <Input
                        label="DNI"
                        placeholder="Ingresa el DNI"
                        type="text"
                        registro={{
                            value: dni,
                            onChange: handleChange,
                        }}
                        error={error}
                    />
                </div>
                <div className="button-container" style={{ justifyContent: 'flex-end' }}>
                    <BotonCargando loading={loading}>Consultar</BotonCargando>
                </div>
            </form>
        </div>
    );
};

/**
 * Props:
 * - onEstudianteEncontrado (function, required): Callback when a student is found.
  accion: PropTypes.oneOf(['consultar', 'editar', 'eliminar']), // ajusta la lista según tus acciones permitidas
 * - accion (string, optional): Action type.
 */
BusquedaDNI.propTypes = {
  onEstudianteEncontrado: PropTypes.func.isRequired,
  onVolver: PropTypes.func.isRequired, // Callback para el botón "Volver"
  onClose: PropTypes.func.isRequired, // Callback para el botón "Cerrar"
};


export default BusquedaDNI;

