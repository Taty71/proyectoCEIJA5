import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import useGestionDocumentacion from '../hooks/useGestionDocumentacion';
import GestionEstudianteView from './GestionEstudianteView';
import serviceRegInscripcion from '../services/serviceRegInscripcion';
import serviceInscripcion from '../services/serviceInscripcion';

const GestionEstudiante = ({ modalidad, accion, isAdmin, onClose }) => {
    const navigate = useNavigate();
    const {
        files,
        previews,
        alert,
        setAlert,
        handleFileChange,
        buildDetalleDocumentacion,
        resetArchivos,
    } = useGestionDocumentacion();

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
            setAlert({ text: '', variant: '' });

            const camposObligatorios = ['nombre', 'apellido', 'dni', 'cuil', 'fechaNacimiento', 'calle', 'numero', 'barrio', 'localidad', 'pcia'];
            const camposFaltantes = camposObligatorios.filter((campo) => !values[campo]);

            if (camposFaltantes.length > 0) {
                setAlert({ text: `Faltan completar: ${camposFaltantes.join(', ')}`, variant: 'error' });
                return;
            }

            const detalleDocumentacion = buildDetalleDocumentacion();
            const formDataToSend = new FormData();
            formDataToSend.append('modalidad', modalidad);

            Object.entries(values).forEach(([key, value]) => {
                // Excluir campos de archivos para evitar conflictos
                const archivosFields = ['archivo_dni', 'archivo_cuil', 'archivo_partidaNacimiento', 'archivo_fichaMedica', 
                                       'archivo_solicitudPase', 'archivo_analiticoParcial', 'archivo_certificadoNivelPrimario', 'foto'];
                if (!archivosFields.includes(key)) {
                    const campo = key === 'modulos' ? 'idModulo' : key;
                    formDataToSend.append(campo, value);
                }
            });

            Object.entries(files).forEach(([key, file]) => {
                if (file) formDataToSend.append(key, file);
            });

            formDataToSend.append('detalleDocumentacion', JSON.stringify(detalleDocumentacion));

            let response;
            if (accion === "Registrar") {
                response = isAdmin
                    ? await serviceRegInscripcion.createEstd(formDataToSend)
                    : await serviceRegInscripcion.createWebInscription(formDataToSend);
            } else if (accion === "Modificar" && isAdmin) {
                response = await serviceInscripcion.updateEstd(formDataToSend, values.dni);
            }

            if (response?.message) {
                setAlert({ text: response.message, variant: 'success' });
            } else {
                setAlert({ text: 'El formulario se envió, pero no hubo respuesta.', variant: 'warning' });
            }
        } catch (error) {
            const mensajeError = error.response?.data?.message || 'Ocurrió un error al enviar los datos.';
            setAlert({ text: mensajeError, variant: 'error' });
        } finally {
            setTimeout(() => setAlert({ text: '', variant: '' }), 10000);
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{
                nombre: '', apellido: '', tipoDocumento: '', dni: '', paisEmision: '', cuil: '', fechaNacimiento: '', calle: '', numero: '',
                barrio: '', localidad: '', pcia: '',
                modalidad: modalidad || '',
                modalidadId: modalidad === 'Presencial' ? 1 : modalidad === 'Semipresencial' ? 2 : null,
                planAnio: '',
                modulos: '',
                idEstadoInscripcion: '',
            }}
            onSubmit={handleSubmit}
        >
            {(formikProps) => (
                <GestionEstudianteView
                    onClose={onClose}
                    navigate={navigate}
                    previews={previews}
                    alert={alert}
                    setAlert={setAlert}
                    accion={accion}
                    isAdmin={isAdmin}
                    resetArchivos={resetArchivos}
                    handleFileChange={handleFileChange}
                    {...formikProps}
                />
            )}
        </Formik>
    );
};

GestionEstudiante.propTypes = {
    modalidad: PropTypes.string.isRequired,
    accion: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default GestionEstudiante;
