import axios from '../config/axios';
//import mensajeError from '../utils/MensajeError';
// Base URL preconfigurada desde axios
const baseURL = 'inscripcionRegistroB.php'; // Asegúrate de que tu backend maneje este endpoint

// Obtener todas las inscripciones
const getAll = async () => {
    try {
        const response = await axios.get('listarEstudiantes.php');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo todas las inscripciones:', error);
        throw error;
    }
};

// Consultar inscripciones por documento
const getByDocumento = async (dni) => {
    try {
        const response = await axios.get(`${baseURL}?documento=${dni}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error consultando inscripción por documento:', error);
        throw error;
    }
};

// Registrar nueva inscripción//
const create = async (formData) => { 
    try { 
        const response = await axios.post('inscripcionRegistroB.php', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, 
        }); 
            return response.data; 
    } catch (error) { 
        console.error('Error al enviar inscripción:', error); 
        throw error; 
    } 
};

// editar estudiante registrado //
const buscarDni = async (formData) => { 
    try { 
        const response = await axios.get('editarRegistro.php', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, 
        }); 
            return response.data; 
    } catch (error) { 
        console.error('Error al enviar inscripción:', error); 
        throw error; 
    } 
};

/*const create = async (formData) => {
    try {
        const response = await axios.post(`${baseURL}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response;
    } catch (error) {
        console.error("Error al enviar inscripción:", error);
        throw error;
    }
};*/


// Modificar una inscripción existente
const update = async (id, updatedData) => {
    try {
        const response = await axios.put(`${baseURL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error modificando inscripción:', error);
        throw error;
    }
};

// Eliminar una inscripción
const remove = async (id) => {
    try {
        const response = await axios.delete(`${baseURL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error eliminando inscripción:', error);
        throw error;
    }
};

// Adjuntar archivo relacionado con la inscripción
const uploadFile = async (idInscripcion, fileData) => {
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
};

// Exportar todas las funciones
export default {
    getAll,
    getByDocumento,
    create,
    update,
    remove,
    uploadFile,
    buscarDni
};
