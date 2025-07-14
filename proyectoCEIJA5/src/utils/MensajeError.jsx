const FormatError = (error) => {
    // Si el error tiene una clave "mensaje", retorna ese mensaje
    if (error?.mensaje) {
        return error.mensaje;
    }

    // Si no hay respuesta del servidor
    if (!error?.response) {
        return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    // Retorna el mensaje de error del servidor o un mensaje genérico
    return error.response.data?.message || 'Ocurrió un error inesperado.';
};

export default FormatError;

