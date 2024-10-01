// src/utils/axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://bf4bg.ondigitalocean.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Interceptor para añadir el token de autenticación
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // O donde guardes tu token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default axiosInstance;
