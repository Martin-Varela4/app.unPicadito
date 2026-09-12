//(Estado global con Zustand)
import { create } from 'zustand';
import {
    sendFriendshipRequest,
    respondFriendshipRequest,
    getPendingRequests,
} from '../services/friendshipService';

export const useFriendshipStore = create((set) => ({
    pendingRequests: [],
    loading: false,
    error: null,

    // Cargar lista de solicitudes
    fetchPendingRequests: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getPendingRequests();
            set({ pendingRequests: response.data || [], loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al cargar las solicitudes',
                loading: false,
            });
        }
    },

    // UP-036 / UP-045: Acciones para enviar solicitud
    sendRequest: async (receiverId) => {
        set({ loading: true, error: null });
        try {
            const response = await sendFriendshipRequest(receiverId);
            set({ loading: false });
            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al enviar la solicitud';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // UP-041 / UP-046: Acciones para aceptar o rechazar
    respondRequest: async (requestId, status) => {
        set({ loading: true, error: null });
        try {
            await respondFriendshipRequest(requestId, status);
            // Remueve la solicitud del estado local tras la respuesta exitosa
            set((state) => ({
                pendingRequests: state.pendingRequests.filter((req) => req.id !== requestId),
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al procesar la solicitud';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },
}));