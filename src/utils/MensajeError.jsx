const Error = (error) => {
    console.error('Error:', error); // Para depuración
    return {
        success: false,
        message: error.response?.data?.message || 'Ocurrió un error inesperado.',
    };
};
export default Error;
