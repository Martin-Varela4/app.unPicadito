//(Conexión Axios al backend)
import api from '../../../api/axiosInstance'; // Ajusta la ruta a tu instancia global de Axios

// UP-045: Enviar solicitud de amistad
export const sendFriendshipRequest = async (receiverId) => {
    const response = await api.post('/friendships', {
        receiverId: Number(receiverId),
    });
    return response.data;
};

// UP-046: Aceptar o rechazar solicitud
export const respondFriendshipRequest = async (requestId, status) => {
    const response = await api.patch(`/friendships/${requestId}/respond`, {
        status, // "ACCEPTED" o "REJECTED"
    });
    return response.data;
};

// Obtener solicitudes pendientes
export const getPendingRequests = async () => {
    const response = await api.get('/friendships/pending');
    return response.data;
};