import axiosInstance from '../config/axios';
import Error from '../utils/MensajeError';

// Registrar usuario
const createU = async (data) => { 
    try { 
        const response = await axiosInstance.post('register.php', data, {
            headers: { 'Content-Type': 'application/json' }
        }); 
        console.log('Respuesta completa del servidor:', response); // Para depuración
        return response.data; 
    } catch (error) { 
        const errorMessage = error.response 
            ? error.response.data 
            : "Error de conexión con el servidor.";
        
        console.error('Error al enviar:', errorMessage);
        return { error: true, message: errorMessage };
    }
};

// Logueo
const getUser = async (data) => { 
    try {
        const response = await axiosInstance.post('api.php', {
            action: 'login',
            ...data
        }, { 
            headers: {'Content-Type': 'application/json'},
        });
        console.log('Respuesta del servidor:', response.data); // Para depuración
   
        if (response.data.user) {
            console.log("Usuario recibido del servidor:", response.data.user);
            const { nombre, rol, email } = response.data.user;
            console.log('Nombre:', nombre, 'Rol:', rol, 'Email:', email);
        } else {
            console.error("El objeto 'user' no está presente en la respuesta.");
        }

        return response.data;
    } catch (error) {
        const errorInfo = Error(error);
        console.error('Error obteniendo los datos del usuario:', error);
        return errorInfo; // Manejo uniforme de errores
    }
};

// Registrar nueva inscripción Web
const createWebInscription = async (formData) => {
    try {
        const response = await axiosInstance.post('registroInscrpcionWeb.php', formData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Error en createWebInscription:', error);
        throw error;
    }
};

// Inscripción Estudiante Adm
const createEstd = async (formData) => {
    try {
        const response = await axiosInstance.post('/registroInscripcion.php', formData, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.data) {
            return {}; // Retornar un objeto vacío si la respuesta no tiene contenido
        }

        return response.data;
    } catch (error) {
        console.error("Error en service.create:", error);

        if (error.response) {
            console.error("Respuesta del servidor:", error.response);
        } else if (error.request) {
            console.error("No hubo respuesta del servidor.");
        } else {
            console.error("Error en la configuración de la solicitud.");
        }

        throw new Error("Error al procesar la solicitud");
    }
};

// Modificar inscripción Adm
const updateEstd = async (data) => {
    try {
        const response = await axiosInstance.put('ejemplo.php', data);
        return response.data;
    } catch (error) {
        console.error('Error en updateEstd:', error);
        throw error;
    }
};

// Eliminar inscripción Adm
const deleteEstd = async (dni) => {
    try {
        const response = await axiosInstance.delete(`ejemplo.php?dni=${dni}`);
        return response.data;
    } catch (error) {
        console.error('Error en deleteEstd:', error);
        throw error;
    }
};

// Obtener todas las inscripciones
const getAll = async () => {
    try {
        const response = await axiosInstance.get('consultarInscripciones.php');
        console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo todas las inscripciones:', error);
        return { error: true, message: error.message };
    }
};

// Consultar inscripciones por documento
const getByDocumento = async (dni) => {
    try {
        const response = await axiosInstance.get(`consultaDNI.php?dni=${dni}`);
        console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error consultando inscripción por DNI:', error);
        throw error;
    }
};

/// Obtener módulos por modalidad
const getModulos = async (modalidadId) => {
    try {
        const response = await axiosInstance.get(`funciones/obtenerModulo.php?modalidad=${modalidadId}`);
        if (response.status !== 200) {
            throw new Error(`Error al obtener los módulos: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error al obtener los módulos:', error.response.data);
            return { error: true, message: error.response.data.message || error.response.statusText };
        } else if (error.request) {
            console.error('Error al obtener los módulos: No se recibió respuesta del servidor', error.request);
            return { error: true, message: 'No se recibió respuesta del servidor' };
        } else {
            console.error('Error al obtener los módulos:', error.message);
            return { error: true, message: error.message };
        }
    }
};
// Obtener áreas de estudio por módulo
const getAreasEstudio = async (idModulo) => {
    try {
        const response = await axiosInstance.get(`funciones/obtenerAreaEstudio.php?modulo=${idModulo}`);
        if (response.status !== 200) {
            throw new Error(`Error al obtener las áreas de estudio: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error al obtener los módulos:', error.response.data);
            return { error: true, message: error.response.data.message || error.response.statusText };
        } else if (error.request) {
            console.error('Error al obtener los módulos: No se recibió respuesta del servidor', error.request);
            return { error: true, message: 'No se recibió respuesta del servidor' };
        } else {
            console.error('Error al obtener los módulos:', error.message);
            return { error: true, message: error.message };
        }
    }
};
// Obtener materias por año o plan y módulo

// Exportar todas las funciones
export default {
    getAll,
    getByDocumento,
    createU,
    createWebInscription,
    createEstd,
    updateEstd,
    deleteEstd,
    getUser,
    getModulos,
    getAreasEstudio
};