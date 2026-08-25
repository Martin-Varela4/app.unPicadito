import api from '../../../api/axiosInstance';

// Endpoints configurables por variable de entorno o rutas por defecto
const ENDPOINT_LOGIN = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || '/auth/login';
const ENDPOINT_REGISTER = import.meta.env.VITE_AUTH_REGISTER_ENDPOINT || '/auth/register';

/**
 * Servicio para iniciar sesión
 * @param {Object} credentials - { email, password }
 */
export const loginService = async (credentials) => {
    const response = await api.post(ENDPOINT_LOGIN, credentials);
    return response.data;
};

/**
 * Servicio para registrar un nuevo usuario
 * @param {Object} userData - { username, email, password }
 */
export const registerService = async (userData) => {
    const { confirmPassword, ...payload } = userData;
    const response = await api.post(ENDPOINT_REGISTER, payload);
    return response.data;
};