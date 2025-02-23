import { useState } from 'react';
import service from '../services/service';
import RegistroEstd from './RegistroEstd';
import PropTypes from 'prop-types';
import AlertaMens from '../components/AlertaMens';
import '../estilos/estilosInscripcion.css'; // Importa el archivo CSS
import { Logo } from '../components/Logo';


const max_file_size = 600 * 1024; // 600 KB

const FormularioInscripcionEst = ({ modalidad, maxFileSize = max_file_size}) => {
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

        if (!values.nombre || !values.apellido || !values.dni || !values.cuil || !values.fechaNacimiento || !values.calle || !values.nro || !values.barrio || !values.localidad || !values.pcia) {
            setAlert({ text: 'Por favor complete todos los campos requeridos.', variant: 'error' });
            setTimeout(() => setAlert({ text: '', variant: '' }), 5000); // Desaparece después de 5 segundos
            return;
        }
        console.log("Archivos antes de enviar:", files);
        /*if (Object.keys(files).length === 0) {
            setAlert({ text: 'Por favor adjunte los archivos requeridos.', variant: 'error' });
            setTimeout(() => setAlert({ text: '', variant: '' }), 5000); // Desaparece después de 5 segundos
            return;
        }*/

        const formDataToSend = new FormData();
        Object.entries(values).forEach(([key, value]) => formDataToSend.append(key, value));
        Object.entries(files).forEach(([key, file]) =>{ if (file) {  // Verificamos que file no sea undefined o null
            formDataToSend.append(key, file);
            console.log(`Archivo añadido a FormData: ${key} - ${file.name}`);
        } else {
            console.log(`Archivo no válido para el campo: ${key}`);
        }});
        console.log("Datos a enviar:", formDataToSend);
        try {
            const response = await service.createWebInscription(formDataToSend);
            console.log("Respuesta del servidor:", response);
            if (response) {
               
                setAlert({ text: 'Formulario enviado con éxito.', variant: 'success' });
                setTimeout(() => setAlert({ text: '', variant: '' }), 5000); // Desaparece después de 5 segundos
            } else {
                setAlert({ text: 'Error al enviar el formulario.', variant: 'error' });
                setTimeout(() => setAlert({ text: '', variant: '' }), 5000); // Desaparece después de 5 segundos
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            setAlert({ text: 'Ocurrió un error al enviar los datos.', variant: 'error' });
            setTimeout(() => setAlert({ text: '', variant: '' }), 5000); // Desaparece después de 5 segundos
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
        // Estructura del formulario de inscripción
        <div className="formulario-inscripcion-adm">  
        <Logo />
       { /*  Muestra el título dinámicamente */}
            {/*<h1>{`Modalidad  ${modalidad}`}</h1>*/}
            <h2>{`Inscripción Estudiante`}</h2>
            {alert.text && <AlertaMens text={alert.text} variant={alert.variant} />}

            <RegistroEstd
                modalidad={modalidad}
                previews={previews}
                handleFileChange={handleFileChange}
                alert={alert}
                handleSubmit={handleSubmit} 
                handleReset={handleReset}
            />
                     
        </div>
    );
};
FormularioInscripcionEst.propTypes = {
    modalidad: PropTypes.string.isRequired,
    maxFileSize: PropTypes.number,
    accion: PropTypes.string.isRequired,
};

export default FormularioInscripcionEst;

