import { create } from 'zustand';
import axios from 'axios';

export const useFriendStore = create((set) => ({
    loadingStates: {}, // Guarda el estado de carga por cada userId
    sentRequests: {},  // Guarda qué solicitudes ya se enviaron con éxito

    sendFriendRequest: async (userId) => {
        // 1. Controlar estado de carga (spinner)
        set((state) => ({
            loadingStates: { ...state.loadingStates, [userId]: true }
        }));

        try {
            // 3. Conectar la acción con el endpoint backend (UP-039)
            // Ajusta la URL según la API de tu profesor
            await axios.post(`/api/friends/request/${userId}`);

            // 4. Cambiar diseño al completar con éxito
            set((state) => ({
                sentRequests: { ...state.sentRequests, [userId]: true },
                loadingStates: { ...state.loadingStates, [userId]: false }
            }));
            return { success: true };
        } catch (error) {
            set((state) => ({
                loadingStates: { ...state.loadingStates, [userId]: false }
            }));
            // Retornamos el error para manejar el Toast en el componente
            return { success: false, error: error.message || 'Error del servidor' };
        }
    }
}));
