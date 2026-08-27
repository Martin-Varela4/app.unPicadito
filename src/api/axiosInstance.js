import axios from 'axios';
// 🚀 CORREGIDO: Cambiado de '../' a '../' para salir correctamente a la raíz de src
import { useAuthStore } from '../features/auth/store/useAuthStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Solicitud: Adjunta el JWT guardado en Zustand
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Centraliza y normaliza los errores HTTP
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let customErrorMessage = 'Ocurrió un error en la conexión con el servidor.';

        if (error.response) {
            // El servidor respondió con un status fuera de 2xx
            customErrorMessage =
                error.response.data?.message ||
                error.response.data?.error ||
                `Error del servidor (${error.response.status})`;

            if (error.response.status === 401) {
                useAuthStore.getState().logout();
            }
        } else if (error.request) {
            // La petición se envió pero no hubo respuesta
            customErrorMessage = 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
        } else {
            customErrorMessage = error.message;
        }

        return Promise.reject(new Error(customErrorMessage));
    }
);

export default api;
