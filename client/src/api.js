import axios from 'axios';

const api = axios.create({

    // baseURL: 'https://sydney-events-backend-lyuu.onrender.com',
    baseURL: 'http://yugal.aniketverma.xyz',
    withCredentials: true,
});

export default api;
