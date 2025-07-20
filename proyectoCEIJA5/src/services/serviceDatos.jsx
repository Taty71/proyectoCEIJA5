import axiosInstance from '../config/axios';
import FormatError from '../utils/MensajeError';

// Obtener datos del domicilio por ID
const getDomicilioById = async (idDomicilio) => {
    try {
        const response = await axiosInstance.get(`/datos-domicilio/${idDomicilio}`);
        return response.data.domicilio;
    } catch (error) {
        console.error('Error al obtener el domicilio:', error);
        const message = FormatError(error);
        return { error: message };
    }
};

// Obtener información académica por ID de estudiante
const getInscripcionByEstudianteId = async (idEstudiante) => {
    try {
        const response = await axiosInstance.get(`/datos-inscripcion/${idEstudiante}`);
        return response.data.inscripcion;
    } catch (error) {
        console.error('Error al obtener la inscripción:', error);
        const message = FormatError(error);
        return { error: message };
    }
};

// Obtener datos completos del estudiante por DNI
const getEstudianteCompletoByDni = async (dni) => {
    if (!dni || !/^\d{7,8}$/.test(String(dni))) {
        return { error: 'DNI no válido.' };
    }
    try {
        const { data } = await axiosInstance.get(`/consultar-estudiantes-dni/${dni}`);
        console.log('Respuesta completa del servicio:', data); // Verifica la respuesta aquí
        console.log('Documentación recibida:', data.documentacion); // Verifica específicamente la documentación
        return data;
    } catch (error) {
        const message = FormatError(error);
        return { error: message };
    }
};

export default {
    getDomicilioById,
    getInscripcionByEstudianteId,
    getEstudianteCompletoByDni,
};