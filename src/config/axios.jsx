import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost/proyectoCEIJA5api/",
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export default axiosInstance;
