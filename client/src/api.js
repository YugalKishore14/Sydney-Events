import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Adjust if port differs
    withCredentials: true,
});

export default api;
