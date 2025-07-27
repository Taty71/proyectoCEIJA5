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
const getPaginatedEstudiantes = async (page, limit, filtroActivo = 'activos') => {
    try {
        let endpoint = `/consultar-estudiantes?page=${page}&limit=${limit}`;
        
        // Agregar parámetro de filtro según el estado
        if (filtroActivo === 'activos') {
            endpoint += '&activo=1';
        } else if (filtroActivo === 'desactivados') {
            endpoint += '&activo=0';
        }
        // Si es 'todos', no agregamos parámetro de filtro
        
        console.log('🌐 Llamando al endpoint:', endpoint);
        console.log('📋 Parámetros:', { page, limit, filtroActivo });
        
        const response = await axiosInstance.get(endpoint);
        console.log('🔄 Respuesta del backend:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('🚨 Error en getPaginatedEstudiantes:', error);
        const message = FormatError(error);
        return { error: message, success: false };
    }
};

// Obtener documentos faltantes por DNI
const getDocumentosFaltantes = async (dni) => {
    try {
        console.log('📋 Consultando documentos faltantes para DNI:', dni);
        
        const response = await axiosInstance.get(`/documentos-faltantes/${dni}`);
        console.log('📄 Respuesta documentos faltantes:', response.data);
        
        if (response.data.success) {
            return response.data.documentosFaltantes || [];
        } else {
            console.warn('⚠️ No se pudieron obtener documentos faltantes:', response.data.message);
            return [];
        }
    } catch (error) {
        console.error('🚨 Error al obtener documentos faltantes:', error);
        // Si hay error, devolver lista genérica de documentos que podrían faltar
        return [
            'Documento Nacional de Identidad (DNI)',
            'Constancia de CUIL',
            'Certificado de Nacimiento',
            'Ficha Médica',
            'Analítico Parcial'
        ];
    }
};

// Obtener estudiante específico por DNI
const getEstudiantePorDNI = async (dni) => {
    try {
        console.log('🔍 Buscando estudiante por DNI:', dni);
        
        const response = await axiosInstance.get(`/consultar-estudiantes/buscar/${dni}`);
        console.log('👤 Respuesta búsqueda por DNI:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('🚨 Error al buscar estudiante por DNI:', error);
        const message = FormatError(error);
        return { error: message, success: false };
    }
};

const updateEstd = async (data, dni, config = {}) => {
    try {
        console.log('🔄 Enviando datos al backend:', { dni, data }); // Debug log
        const response = await axiosInstance.put(`/modificar-estudiante/${dni}`, data, config);
        console.log('✅ Respuesta del backend:', response.data); // Debug log
        return response.data;
    } catch (error) {
        const message = FormatError(error);
        console.error('🚨 Error al actualizar estudiante:', message); // Debug log
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
    getDocumentosFaltantes,
    getEstudiantePorDNI,
};