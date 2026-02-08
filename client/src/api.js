import axios from 'axios';

const api = axios.create({

    // baseURL: 'https://sydney-events-backend-lyuu.onrender.com',
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

export default api;
