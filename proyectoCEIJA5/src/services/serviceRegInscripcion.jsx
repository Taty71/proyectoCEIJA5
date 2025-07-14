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
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error en createEstd - respuesta servidor:', error.response.data);

            // Manejo específico del error "DNI ya registrado"
            if (error.response.data.message === 'El DNI ya está registrado.') {
                throw new Error('El DNI ingresado ya está registrado en el sistema.');
            }
        } else if (error.request) {
            console.error('Error en createEstd - no se recibió respuesta:', error.request);
        } else {
            console.error('Error en createEstd - configuración:', error.message);
        }
        throw error; // Lanza el error para manejarlo en el componente
    }
};
export default {
    createWebInscription,       
    createEstd,
}