import  { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ModalidadSelection from './ModalidadSelection'; // Importa el componente ModalidadSelection
import service from '../services/service';
import FormDocumentacion  from './FormDocumentacion'; // Importa el componente FormDocumentación
import { DatosPersonales } from './DatosPersonales'; // Importa el componente DatosPersonales
import { Domicilio } from './Domicilio'; // Importa el componente Domicilio
import AlertaMens from './AlertaMens'; // Importa el componente de alerta
import PropTypes from 'prop-types';

const max_file_size = 600 * 1024; // 600 KB

const FormularioInscripcionAdm = ({ modalidad, maxFileSize = max_file_size }) => {
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    
    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        console.log(`Archivo seleccionado para ${field}:`, file);
        if (file) {
            if (file.size > maxFileSize) {
                setAlert({ text: 'El archivo es demasiado grande. Máximo permitido: 600 KB.', variant: 'error' });
                return;
            }
            const url = URL.createObjectURL(file);
            setPreviews((prev) => ({ ...prev, [field]: { url, type: file.type } }));
            setFiles((prev) => ({ ...prev, [field]: file }));
        }
    };

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('Nombre es requerido'),
        apellido: Yup.string().required('Apellido es requerido'),
        dni: Yup.string().required('DNI es requerido, sin espacios y puntos'),
        cuil: Yup.string().required('CUIL es requerido'),
        fechaNacimiento: Yup.date().required('Fecha de nacimiento es requerida').typeError('Fecha inválida'),
        calle: Yup.string().required('Calle es requerida'),
        nro: Yup.string().required('Número es requerido'),
        barrio: Yup.string().required('Barrio es requerido'),
        localidad: Yup.string().required('Localidad es requerida'),
        pcia: Yup.string().required('Provincia es requerida'),
        planAnio: Yup.string().required('Por favor selecciona un año o plan'),
    });

    const handleSubmit = async (values) => {
        console.log("Valores del formulario:", values);
        console.log("Archivos adjuntos:", files);
        if (!values.nombre || !values.apellido || !values.dni || !values.cuil || !values.fechaNacimiento || !values.calle || !values.nro || !values.barrio || !values.localidad || !values.pcia) {
            setAlert({ text: 'Por favor complete todos los campos requeridos.', variant: 'error' });
            return;
        }
        if (Object.keys(files).length === 0) {
            setAlert({ text: 'Por favor adjunte los archivos requeridos.', variant: 'error' });
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        Object.entries(files).forEach(([key, file]) => {
            formDataToSend.append(key, file);
        });

        try {
            const response = await service.create(formDataToSend);
            console.log("Respuesta del servidor:", response);
            if (response) {
                setAlert({ text: 'Formulario enviado con éxito.', variant: 'success' });
            } else {
                setAlert({ text: 'Error al enviar el formulario.', variant: 'error' });
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            setAlert({ text: 'Ocurrió un error al enviar los datos.', variant: 'error' });
        }
    };

    return (
        <>
        <Formik
            initialValues={{
                nombre: '',
                apellido: '',
                dni: '',
                cuil: '',
                fechaNacimiento: '',
                calle: '',
                nro: '',
                barrio: '',
                localidad: '',
                pcia: '',
                modalidad,
                planAnio: '',
                titulo: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, handleChange, setFieldValue }) => (
                <Form method="POST" encType="multipart/form-data">
                    <div className="formd">
                        <DatosPersonales /> {/* Agrega el componente DatosPersonales */}
                        <Domicilio /> {/* Agrega el componente Domicilio */}
                        <ModalidadSelection modalidad={modalidad} handleChange={handleChange} setFieldValue={setFieldValue} values={values} /> 
                        <button type="button" className="buttonD" onClick={() =>setIsModalOpen(true)}>
                        Adjuntar Documentación
                         </button>
                        
                        <FormDocumentacion previews={previews} handleFileChange={handleFileChange} setFieldValue={setFieldValue}/> 
                        
                                                    {isModalOpen && (
                                                        <FormDocumentacion 
                                                            onClose={closeModal}
                                                            previews={previews} 
                                                            handleFileChange={(e, field) => handleFileChange(e, field, setFieldValue)} 
                                                            setFieldValue={setFieldValue}
                                                            closeModal={() => setIsModalOpen(false)}
                                                        />
                                                    )}
                   
                   
                    </div>
                    {alert.text && <AlertaMens text={alert.text} variant={alert.variant} />} 
                    <button type="submit" className="buttonF">Enviar</button>
                </Form>
            )}
        </Formik>
        </>
    );
};
FormularioInscripcionAdm.propTypes = {
    modalidad: PropTypes.string.isRequired,
    maxFileSize: PropTypes.number,
};

export default FormularioInscripcionAdm;

