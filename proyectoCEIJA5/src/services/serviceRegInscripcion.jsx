import axiosInstance from '../config/axios';
import FormatError from '../utils/MensajeError';


// Registrar nueva inscripción Web
const createWebInscription = async (formDataToSend) => {
    try {
        const response = await axiosInstance.post('/inscriptions/web', formDataToSend); // Nueva ruta
        return response.data;
    } catch (error) {
        console.error('Error en createWebInscription:', error);
        return FormatError(error); // Manejo uniforme de errores
    }
};

// Inscripción Estudiante Adm
const createEstd = async (formDataToSend) => {
    try {
        const response = await axiosInstance.post('/estudiantes/registrar', formDataToSend);
        if (import.meta.env.DEV) {
            console.log('Respuesta del servidor:', response.data);
        }
        return response.data;
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Error en createEstd - respuesta servidor:', error.response.data);
        }
        throw new Error(error.response.data.message || 'Ocurrió un error al enviar los datos.');
    }
};
export default {
    createWebInscription,       
    createEstd,
}