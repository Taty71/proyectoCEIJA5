import axiosInstance from '../config/axios';
import Error from '../utils/MensajeError';


//Registrar usuario
const createU = async (data) => { 
    try { 
        const response = await axiosInstance.post('register.php', data, {
            //headers: { 'Content-Type': 'application/json' }
        }); 
        console.log('Respuesta completa del servidor:', response); // Para depuración
            return response.data; 
    }  catch (error) { 
        const errorMessage = error.response 
            ? error.response.data 
            : "Error de conexión con el servidor.";
        
        console.error('Error al enviar:', errorMessage);
        
        return { error: true, message: errorMessage };
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
// Registrar nueva inscripción Web//
/*const service = {
    createWebInscription: (formData) => {
        return axiosInstance.post('/inscripcionWebEstd', formData);
    },
}*/
const createWebInscription = async (formDataToSend) => { 
    try { 
        const response = await axiosInstance.post('inscripcionWebEstd.php', formDataToSend); 
            return response.data; 
    }  catch (error) {
        console.error('Error al realizar inscripciones:', error);
        return { error: true, message: error.message };
    };
}
// Registrar nueva inscripción Adm//
const create = async (formData) => { 
    try { 
        const response = await axiosInstance.post('inscripcionRegistroB.php', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, 
         
        }); 
            return response.data; 
    }  catch (error) {
        console.error('Error al inscribir:', error);
        throw error;
    }
};

// Obtener todas las inscripciones
/*const getAll = async (formData) => {
    try {
        const response = await axiosInstance.get('consultarInscripciones.php', formData)
          console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo todas las inscripciones:', error);
        throw error;

    }
};*/
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


/*Consultar inscripciones por documento*/
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
// Obtener materias por año o plan
const getMaterias = async (idAnioPlan) => {
    try {
        const response = await axiosInstance.get(`materias.php?idAnioPlan=${idAnioPlan}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las materias:', error);
        return { error: true, message: error.message };
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
    createWebInscription,
    getUser,
    getMaterias
    //update,
    //remove,
   // uploadFile,
    //buscarDni
};
