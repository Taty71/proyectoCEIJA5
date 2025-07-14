import { useState } from 'react';
import { Formik} from 'formik';
import serviceRegInscripcion from '../services/serviceRegInscripcion';
import serviceInscripcion from '../services/serviceInscripcion';
import RegistroEstd from './RegistroEstd';
import PropTypes from 'prop-types';
import AlertaMens from '../components/AlertaMens';
import '../estilos/estilosInscripcion.css';
import { Logo } from '../components/Logo';
import { DocumentacionNameToId } from '../utils/DocumentacionMap'; 

const max_file_size = 600 * 1024; // 600 KB

const FormularioInscripcion = ({ modalidad, maxFileSize = max_file_size, accion, isAdmin }) => {
    const [files, setFiles] = useState({});
    const [previews, setPreviews] = useState({
        dni: null,
        cuil: null,
        foto: null,
        partidaNacimiento: null,
        fichaMedica: null,
        solicitudPase: null,
        analiticoParcial: null,
        certificadoNivelPrimario: null,
    });
    const [alert, setAlert] = useState({ text: '', variant: '' });

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        console.log(`Archivo seleccionado para ${field}:`, file);
        if (file) {
            if (file.size > maxFileSize) {
                setAlert({ text: 'El archivo es demasiado grande. Máximo permitido: 600 KB.', variant: 'error' });
                setTimeout(() => setAlert({ text: '', variant: '' }), 5000);
                return;
            }
            const url = URL.createObjectURL(file);
            setPreviews((prev) => ({ ...prev, [field]: { url, type: file.type } }));
            setFiles((prev) => ({ ...prev, [field]: file }));
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
       
        try {
            setAlert({ text: '', variant: '' });
            console.log("Valores del formulario:", values);
            console.log("Archivos adjuntos:", files);

            if (accion === "Eliminar") {
                setAlert({ text: "Función de eliminación en desarrollo", variant: "warning" });
                return;
            }

            const camposObligatorios = ['nombre', 'apellido', 'dni', 'cuil', 'fechaNacimiento', 'calle', 'numero', 'barrio', 'localidad', 'pcia'];
            const camposFaltantes = camposObligatorios.filter((campo) => !values[campo]);

            if (camposFaltantes.length > 0) {
                setAlert({ text: `Faltan completar los siguientes campos: ${camposFaltantes.join(', ')}`, variant: 'error' });
                setTimeout(() => setAlert({ text: '', variant: '' }), 5000);
                return;
            }
            const detalleDocumentacion = Object.entries(previews)
                .filter(([name]) => DocumentacionNameToId[name])
                .map(([name, doc]) => ({
                    idDocumentaciones: DocumentacionNameToId[name],
                    estadoDocumentacion: doc?.url ? 'Entregado' : 'Faltante',
                    archivoDocumentacion: files[name]?.name || null,
                    fechaEntrega: doc?.url ? new Date().toISOString().slice(0, 10) : null
                }));

           const formDataToSend = new FormData();

                // Solo una vez: si la key es 'modulos', la renombrás a 'idModulo'
            Object.entries(values).forEach(([key, value]) => {
                    const campo = key === 'modulos' ? 'idModulo' : key;
                    formDataToSend.append(campo, value);
                });
                // Agregar los archivos
            Object.entries(files).forEach(([key, file]) => {
                    if (file) {
                        formDataToSend.append(key, file);
                    }
                });
                // Agregar documentación
            formDataToSend.append('detalleDocumentacion', JSON.stringify(detalleDocumentacion));
            /**/

            {/*console.log("📦 Datos enviados a la API (formDataToSend):");
                for (let [key, value] of formDataToSend.entries()) {
                    console.log(`${key}:`, value);
                }*/}

            let response;
            switch (accion) {
                case "Registrar":
                    /*
                    for (let pair of formDataToSend.entries()) {
                            console.log(`${pair[0]}:`, pair[1]);
                        }*/

                    response = isAdmin
                        ? await serviceRegInscripcion.createEstd(formDataToSend)
                        : await serviceRegInscripcion.createWebInscription(formDataToSend);
                    break;

                case "Modificar":
                    if (isAdmin) {
                        response = await serviceInscripcion.updateEstd(formDataToSend);
                    }
                    break;

                case "Eliminar":
                    if (isAdmin) {
                        response = await serviceInscripcion.deleteEstd(values.dni);
                    }
                    break;

                case "Consultar":
                    if (values.dni) {
                        response = await serviceInscripcion.getByDocumento(values.dni);
                    } else {
                        response = await serviceInscripcion.getAll();
                    }
                    break;

                case "Listar":
                    if (isAdmin) {
                        response = await serviceInscripcion.getAll();
                    }
                    break;

                default:
                    response = await serviceInscripcion.getAll();
            }
            console.log("Respuesta del servidor:", response);

            if (response && response.message) {
                setAlert({ text: response.message || 'Formulario enviado con éxito.', variant: 'success' });
            } else {
                setAlert({ text: 'El formulario se envió, pero no hubo respuesta del servidor.', variant: 'warning' });
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            let mensajeError = 'Ocurrió un error al enviar los datos.';
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
                mensajeError = error.response.data.message || mensajeError;
            }
            setAlert({ text: mensajeError, variant: 'error' });
        } finally {
            setTimeout(() => setAlert({ text: '', variant: '' }), 10000);
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setAlert({ text: '', variant: '' });
        setFiles({});
        setPreviews({
            dni: null,
            cuil: null,
            foto: null,
            partidaNacimiento: null,
            fichaMedica: null,
            solicitudPase: null,
            analiticoParcial: null,
            certificadoNivelPrimario: null,
        });
    };
    //** */
    const modalidadId = modalidad === 'Presencial' ? 1 : modalidad === 'Semipresencial' ? 2 : '';

    return (
        <div className={`formulario-inscripcion-${isAdmin ? 'adm' : 'est'}`}>
            <Logo />
          
            {alert.text && <AlertaMens text={alert.text} variant={alert.variant} />}
            <Formik
                initialValues={{
                        nombre: '', apellido: '', dni: '', cuil: '', fechaNacimiento: '', calle: '', numero: '',
                        barrio: '', localidad: '', pcia: '',
                        modalidad: modalidad || '',
                        modalidadId: typeof modalidadId === 'number' ? modalidadId : null,
                        planAnio: '',
                        modulos: '',
                        idEstadoInscripcion: ''
                    }}
                    onSubmit={handleSubmit}
                >
                {({ setFieldValue, values, isSubmitting, resetForm, handleChange  }) => (
                  
                        <RegistroEstd
                            modalidad={modalidad}
                            previews={previews}
                            handleFileChange={handleFileChange}
                            handleChange={handleChange}  
                            alert={alert}
                            accion={accion}
                            resetForm={resetForm}
                            handleSubmit={handleSubmit}
                            handleReset={handleReset}
                            setFieldValue={setFieldValue}
                            values={values}
                            isAdmin={isAdmin} 
                            isSubmitting={isSubmitting}// Pasa la prop isAdmin al componente RegistroEstd
                        />
                       
                )}
            </Formik>
        </div>
    );
};

FormularioInscripcion.propTypes = {
    modalidad: PropTypes.string.isRequired,
    maxFileSize: PropTypes.number,
    accion: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
};

export default FormularioInscripcion;