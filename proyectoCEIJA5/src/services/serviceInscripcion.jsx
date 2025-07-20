import axiosInstance from '../config/axios';
import FormatError from '../utils/MensajeError';

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

const updateEstd = async (data, dni) => {
  try {
    const response = await axiosInstance.put(`/modificar-estudiante/${dni}`, data);
    return response.data;
  } catch (error) {
    const message = FormatError(error);
    throw new Error(message); 
  }
};


// Eliminar inscripción Adm (eliminación física)
const deleteEstd = async (dni) => {
    try {
        const response = await axiosInstance.delete(`/eliminar-estudiante/${dni}`);
        return response.data;
    } catch (error) {
        const message = FormatError(error);
        return { error: message };
    }
};

// Desactivar estudiante (eliminación lógica)
const deactivateEstd = async (dni) => {
    try {
        const response = await axiosInstance.patch(`/eliminar-estudiante/desactivar/${dni}`);
        return response.data;
    } catch (error) {
        const message = FormatError(error);
        return { error: message };
    }
};

export default {
    updateEstd,
    deleteEstd,
    deactivateEstd,
    getAll,
    getPaginatedEstudiantes,
};