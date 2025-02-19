import axiosInstance from '../config/axios';
import Error from '../utils/MensajeError';
// Base URL preconfigurada desde axios
//const baseURL = 'inscripcionRegistroB.php'; // Asegúrate de que tu backend maneje este endpoint

//Registrar usuario
const createU = async (data) => { 
    try { 
        const response = await axiosInstance.post('register.php', data, {
            headers: { 'Content-Type': 'application/json' }
        }); 
        console.log('Respuesta completa del servidor:', response); // Para depuración
            return response.data; 
    } catch (error) { 
        const errorInfo = Error(error);
        console.error('Error al enviar registro usuario:', error); 
        return errorInfo; 
    } 
};
// logueo
const getUser = async (data) => { 
    try {
        const response = await axiosInstance.post('api.php', {
            action: 'login',
            ...data
        }, { 
            headers: {'Content-Type': 'application/json'},
        });
        console.log('Respuesta del servidor:', response.data); // Para depuración
   
        // Verifica la estructura de la respuesta y asegúrate de que 'user' contiene el 'email'
        if (response.data.user) {
            console.log("Usuario recibido del servidor:", response.data.user); // Esto te ayudará a ver qué contiene 'user'
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
// Registrar nueva inscripción//
const create = async (formData) => { 
    try { 
        const response = await axiosInstance.post('inscripcionRegistroB.php', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, 
        }); 
            return response.data; 
    } catch (error) { 
        const errorInfo = Error(error);
        console.error('Error al enviar inscripción:', error); 
        console.error('Error al enviar inscripción:', error.response?.data || error.message);
        //throw error; 
        return errorInfo;
    } 
};

// Obtener todas las inscripciones
const getAll = async (formData) => {
    try {
        const response = await axiosInstance.get('listarEstudiantes.php', formData)
          console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo todas las inscripciones:', error);
        throw error;

    }
};

/*Consultar inscripciones por documento*/
const getByDocumento = async (dni) => {
    try {
        const response = await axiosInstance.get(`editarRegistro.php?/${dni}`);
        console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error consultando inscripción por documento:', error);
        throw error;
    }
};

// Modificar una inscripción existente
/*const update = async (id, updatedData) => {
    try {
        const response = await axiosInstance.put(`${baseURL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error modificando inscripción:', error);
        throw error;
    }
};*/

// Eliminar una inscripción
/*const remove = async (id) => {
    try {
        const response = await axiosInstance.delete(`${baseURL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error eliminando inscripción:', error);
        throw error;
    }
};*/

// Adjuntar archivo relacionado con la inscripción
/*const uploadFile = async (idInscripcion, fileData) => {
    try {
        const formData = new FormData();
        formData.append('file', fileData);

        const response = await axios.post(`${baseURL}/${idInscripcion}/documentaciones`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error subiendo archivo:', error);
        throw error;
    }
};*/

// Exportar todas las funciones
export default {
    getAll,
    getByDocumento,
    create,
    createU,
    getUser,
    //update,
    //remove,
   // uploadFile,
    //buscarDni
};
