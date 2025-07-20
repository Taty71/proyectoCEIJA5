import { useState } from 'react';
import PropTypes from 'prop-types';
import '../estilos/busquedaDNI.css'; // Importa los estilos propios
import serviceDatos from '../services/serviceDatos';
import BotonCargando from '../components/BotonCargando'; // ajusta la ruta si cambia
import Input from '../components/Input'; // Importa el componente Input
import CloseButton from '../components/CloseButton'; // Importa el componente CloseButton
import VolverButton from '../components/VolverButton'; // Importa el componente VolverButton
import '../estilos/Modal.css'; // Importa los estilos del modal
import '../estilos/estilosInscripcion.css';
import '../estilos/botonCargando.css';


const BusquedaDNI = ({ onEstudianteEncontrado, onClose, onVolver, esConsultaDirecta = false, modoModificacion = false, modoEliminacion = false }) => {
    const [dni, setDni] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        const soloDigitos = e.target.value.replace(/\D/g, '');
        setDni(soloDigitos);
        if (error) setError(null);            // limpia error al tipear
    };

    const clearError = () => {
        setError(null);
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
                    // Solo mostrar el error localmente, no duplicar en GestionCRUD
                    const errorMessage = resultado.error || 'No se encontró un estudiante con ese DNI.';
                    setError(errorMessage);
                    
                    // Auto-limpiar el error después de 5 segundos
                    setTimeout(() => {
                        setError(null);
                    }, 5000);
                    
                    // No llamar a onEstudianteEncontrado para evitar alertas duplicadas
                }
            }, 2000); // Retraso de 2 segundos
        } catch (err) {
            console.error(err);

            // Introduce un retraso adicional antes de desactivar el estado de carga en caso de error
            setTimeout(() => {
                setLoading(false); // Desactiva el estado de carga después del retraso
                setError('Hubo un problema al realizar la consulta.');
                
                // Auto-limpiar el error después de 5 segundos
                setTimeout(() => {
                    setError(null);
                }, 5000);
            }, 1000); // Retraso de 1 segundo
        }
    };

    return (
        <div className="busqueda-dni-container">
            {/* Contenedor de botones superior */}
            {!esConsultaDirecta && (
                <div className="modal-header-buttons">
                    {onVolver && (
                        <VolverButton onClick={onVolver} />
                    )}
                    {onClose && (
                        <CloseButton onClose={onClose} variant="modal" />
                    )}
                </div>
            )}
                  
            <h2>{modoEliminacion ? "Eliminar Estudiante por DNI" : modoModificacion ? "Modificar Estudiante por DNI" : "Consulta de Estudiante por DNI"}</h2>
            <form onSubmit={handleSubmit} className="busqueda-dni-form">
                <div className="input-container">
                    <Input
                        label="DNI"
                        placeholder={modoEliminacion ? "Ingrese el DNI del estudiante que desea eliminar" : modoModificacion ? "Ingrese el DNI del estudiante que desea modificar" : "Ingresa el DNI"}
                        type="text"
                        registro={{
                            value: dni,
                            onChange: handleChange,
                        }}
                    />
                    {/* Mostrar error personalizado con botón de cerrar */}
                    {error && (
                        <div className="error-message">
                            <div className="error-message-content">
                                <span>{error}</span>
                            </div>
                            <button 
                                type="button"
                                className="error-close-btn"
                                onClick={clearError}
                                title="Cerrar mensaje"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
                <div className="button-container" style={{ justifyContent: 'flex-end' }}>
                    <BotonCargando loading={loading}>
                        {modoEliminacion ? "Buscar para Eliminar" : modoModificacion ? "Buscar para Modificar" : "Buscar"}
                    </BotonCargando>
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
  onClose: PropTypes.func.isRequired, // Callback para el botón "Cerrar"
  onVolver: PropTypes.func, // Callback para el botón "Volver"
  esConsultaDirecta: PropTypes.bool, // Indica si es consulta directa (oculta botón cerrar)
  modoModificacion: PropTypes.bool, // Indica si está en modo modificación
  modoEliminacion: PropTypes.bool, // Indica si está en modo eliminación
};


export default BusquedaDNI;

