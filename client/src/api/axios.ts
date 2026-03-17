import axios from 'axios';



const api = axios.create({
    // We fallback to '/api-proxy' if the env variable is missing to prevent 404s
    baseURL: import.meta.env.VITE_BASE_URL || '/api-proxy',
    timeout: 10000,
    withCredentials: true,
});


export default api;