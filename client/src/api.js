import axios from 'axios';

const api = axios.create({

    baseURL: 'https://sydney-events-backend-lyuu.onrender.com',
    withCredentials: true,
});

export default api;
