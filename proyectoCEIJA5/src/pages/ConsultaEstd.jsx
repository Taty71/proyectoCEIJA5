import PropTypes from 'prop-types';
import '../estilos/consultaEstd.css';
import CloseButton from '../components/CloseButton'; // Importa el componente CloseButton


// Función para formatear la fecha
const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const ConsultaEstd = ({ data, onClose }) => {
    // Si por alguna razón el objeto no trae success true, mostramos mensaje genérico
    if (!data?.success) {
        return <p>No se encontraron datos para el estudiante.</p>;
    }

    // Desestructuramos directamente
    const { estudiante, domicilio, inscripcion } = data;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* Reemplaza el botón con CloseButton */}
                <CloseButton onClose={onClose} />
                <h1 className="consultaEstdHeader">Datos del Estudiante</h1>
                <div className="consultaEstdRow">
                    <div className="consultaEstdSection">
                        <h3>Datos Personales</h3>
                        <p><strong>Nombre:</strong> {estudiante?.nombre || 'No especificado'}</p>
                        <p><strong>Apellido:</strong> {estudiante?.apellido || 'No especificado'}</p>
                        <p><strong>DNI:</strong> {estudiante?.dni || 'No especificado'}</p>
                        <p><strong>CUIL:</strong> {estudiante?.cuil || 'No especificado'}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {formatDate(estudiante?.fechaNacimiento)}</p>
                    </div>
                    <div className="consultaEstdSection">
                        <h3>Domicilio</h3>
                        {domicilio ? (
                            <>
                                <p><strong>Calle:</strong> {domicilio.calle || 'No especificado'}</p>
                                <p><strong>Número:</strong> {domicilio.numero || 'No especificado'}</p>
                                <p><strong>Barrio:</strong> {domicilio.barrio || 'No especificado'}</p>
                                <p><strong>Localidad:</strong> {domicilio.localidad || 'No especificado'}</p>
                                <p><strong>Provincia:</strong> {domicilio.provincia || 'No especificado'}</p>
                            </>
                        ) : (
                            <p>No se encontraron datos de domicilio.</p>
                        )}
                    </div>
                    <div className="consultaEstdSection">
                        <h3>Información Académica</h3>
                        {inscripcion ? (
                            <>
                                <p><strong>Modalidad:</strong> {inscripcion.modalidad || 'No especificada'}</p>
                                <p><strong>Curso / Plan:</strong> {inscripcion.plan || 'No especificado'}</p>
                                <p><strong>Módulo:</strong> {inscripcion.modulo || 'No especificado'}</p>
                                <p><strong>Estado:</strong> {inscripcion.estado || 'No especificado'}</p>
                                <p><strong>Fecha de Inscripción:</strong> {formatDate(inscripcion?.fechaInscripcion)}</p>
                            </>
                        ) : (
                            <p>No se encontraron datos de inscripción.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ConsultaEstd.propTypes = {
    data: PropTypes.shape({
        success: PropTypes.bool.isRequired,
        estudiante: PropTypes.object.isRequired,
        domicilio: PropTypes.object,
        inscripcion: PropTypes.object,
    }).isRequired,
    onClose: PropTypes.func.isRequired, // Nueva prop para manejar el cierre del modal
};

export default ConsultaEstd;
