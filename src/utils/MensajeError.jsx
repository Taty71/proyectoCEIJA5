const Error = (error) => {
    console.error('Error:', error);
    throw error.response?.data?.message || 'Error desconocido';
};
export default Error;