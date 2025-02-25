import { useState } from 'react';
import { Formik } from 'formik';
import service from '../services/service';
//import {createEstd, createWebInscription } from '../services/service'; // Importa correctamente la función para la inscripción web
import RegistroEstd from './RegistroEstd';
import PropTypes from 'prop-types';
import AlertaMens from '../components/AlertaMens';
import '../estilos/estilosInscripcion.css'; // Importa el archivo CSS
import { Logo } from '../components/Logo';

const max_file_size = 600 * 1024; // 600 KB

const FormularioInscripcion = ({ modalidad, maxFileSize = max_file_size, accion, isAdmin }) => {
    const [files, setFiles] = useState({});
    const [previews, setPreviews] = useState({
        dni: null,
        cuil: null,
        foto: null,
        partidaNacimiento: null,
        fichaMedica: null,
        archivoTitulo: null,
    });
    const [alert, setAlert] = useState({ text: '', variant: '' }); // Estado para la alerta

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

    const handleSubmit = async (values) => {
        setAlert({ text: '', variant: '' }); // Limpia alertas anteriores
        console.log("Valores del formulario:", values);
        console.log("Archivos adjuntos:", files);

        if (accion === "Eliminar") {
            setAlert({ text: "Función de eliminación en desarrollo", variant: "warning" });
            return;
        }

        const camposObligatorios = ['nombre', 'apellido', 'dni', 'cuil', 'fechaNacimiento', 'calle', 'nro', 'barrio', 'localidad', 'pcia'];
        const camposFaltantes = camposObligatorios.filter((campo) => !values[campo]);

        if (camposFaltantes.length > 0) {
            setAlert({ text: `Faltan completar los siguientes campos: ${camposFaltantes.join(', ')}`, variant: 'error' });
            setTimeout(() => setAlert({ text: '', variant: '' }), 5000);
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(values).forEach(([key, value]) => formDataToSend.append(key, value));
        Object.entries(files).forEach(([key, file]) => {
            if (file) {
                formDataToSend.append(key, file);
            }
        });

        try {
            let response;
            switch (accion) {
                case "Registrar":
                    response = isAdmin 
                        ? await service.createEstd(formDataToSend)  
                        : await service.createWebInscription(formDataToSend);
                    break;
            
                case "Modificar":
                    if (isAdmin) {
                        response = await service.updateEstd(formDataToSend);
                    }
                    break;
            
                case "Eliminar":
                    if (isAdmin) {
                        response = await service.deleteEstd(values.dni);
                    }
                    break;
            
                case "Consultar":
                    if (values.dni) {
                        response = await service.getByDocumento(values.dni); // Consulta por DNI
                    } else {
                        response = await service.getAll(); // Consulta de todos los inscriptos
                    }
                    break;
            
                case "Listar":
                    if (isAdmin) {
                        response = await service.getAll();
                    }
                    break;
            
                default:
                    response = await service.getAll();
            }
            

            console.log("Respuesta del servidor:", response);

            if (response && response.data) {
                setAlert({ text: response.data.message || 'Formulario enviado con éxito.', variant: 'success' });
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
            setTimeout(() => setAlert({ text: '', variant: '' }), 5000);
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
            archivoTitulo: null,
        });
    };

   
    return (
        <div className={`formulario-inscripcion-${isAdmin ? 'adm' : 'est'}`}>
            <Logo />
            <h2>{`${accion} Inscripción Estudiante`}</h2>
            {alert.text && <AlertaMens text={alert.text} variant={alert.variant} />}
            <Formik
            initialValues={{
                nombre: '', apellido: '', dni: '', cuil: '', fechaNacimiento: '', calle: '', nro: '',
                barrio: '', localidad: '', pcia: '', modalidad, planAnio: '', titulo: ''
            }}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, values }) => (
                <RegistroEstd
                    modalidad={modalidad}
                    previews={previews}
                    handleFileChange={handleFileChange}
                    alert={alert}
                    accion={accion}
                    handleSubmit={handleSubmit}
                    handleReset={handleReset}
                    setFieldValue={setFieldValue}
                    values={values}
                />)
            }
            </Formik>
            </div>
    )}
        
FormularioInscripcion.propTypes = {
    modalidad: PropTypes.string.isRequired,
    maxFileSize: PropTypes.number,
    accion: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
};

export default FormularioInscripcion;