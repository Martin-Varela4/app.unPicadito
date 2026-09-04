import axios from 'axios'; // O tu instancia configurada de Axios

//denuevo la api apuntar a la url del backend, para que no haya problemas con el token
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getProfileData = async (token) => {
  try {
    // Hacemos la petición exacta al endpoint que creaste en el backend
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}` // Enviamos el token para que el backend sepa qué ID buscar
      }
    });
    
    return response.data; // Axios devuelve la respuesta del backend aquí
  } catch (error) {
    console.error("Error en profileService del Front:", error);
    throw new Error(error.response?.data?.error || "No se pudo obtener el perfil");
  }
};
