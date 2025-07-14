import axiosInstance from '../config/axios';
import FormatError from '../utils/MensajeError';

// Modificar inscripción Adm
const updateEstd = async (data) => {
    try {
        const response = await axiosInstance.put('/inscripcion', data);
        return response.data;
    } catch (error) {
        const message = FormatError(error);
        throw new Error(message); 
    }
};

// Eliminar inscripción Adm
const deleteEstd = async (dni) => {
    try {
        const response = await axiosInstance.delete(`/inscriptions/${dni}`);
        return response.data;
    } catch (error) {
        const message = FormatError(error);
        return { error: message };
    }
};

// Obtener todas las inscripciones
const getAll = async () => {
    try {
        const { data } = await axiosInstance.get('/consultar-estudiantes');
        if (data.success) return data.estudiantes;
        return { error: data.message || 'Error al obtener estudiantes.' };
    } catch (error) {
        const message = FormatError(error);
        return { error: message };
    }
};

// Obtener estudiantes paginados
const getPaginatedEstudiantes = async (page, limit) => {
    try {
        const response = await axiosInstance.get(`/consultar-estudiantes?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        const message = FormatError(error);
        return { error: message };
    }
};

export default {
    updateEstd,
    deleteEstd,
    getAll,
    getPaginatedEstudiantes, // Nueva función para paginación
};