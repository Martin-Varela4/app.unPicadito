import axios from 'axios';

//la url es momentaneo hasta que se establezca mejor la url en el .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

//el interceptor para el token (visto en clases anteriores)
api.interceptors.request.use(
  (config) => {
    //lo mismo que la url, se guarda en local hasta que se establezca en el .env
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
