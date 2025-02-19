import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost/proyectoCEIJA5api/",
});

export default axiosInstance;
