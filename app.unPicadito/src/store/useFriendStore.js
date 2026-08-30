import { create } from 'zustand';
import axios from 'axios';
export const useFriendStore = create((set) => ({

    loadingStates: {},
    sentRequests: {},
    incomingRequests: [],
    loadingList: false,
    actionLoading: {},

    sendFriendRequest: async (userId) => {
        set((state) => ({
            loadingStates: { ...state.loadingStates, [userId]: true }
        }));

        try {
            await axios.post(`/api/friends/request/${userId}`);

            set((state) => ({
                sentRequests: { ...state.sentRequests, [userId]: true },
                loadingStates: { ...state.loadingStates, [userId]: false }
            }));
            return { success: true };
        } catch (error) {
            set((state) => ({
                loadingStates: { ...state.loadingStates, [userId]: false }
            }));
            return { success: false, error: error.message || 'Error del servidor' };
        }
    },

    fetchIncomingRequests: async () => {
        set({ loadingList: true });
        try {

            const response = await axios.get('/api/friends/requests');
            set({ incomingRequests: response.data, loadingList: false });
        } catch (error) {
            set({ loadingList: false });
            console.error('Error al cargar solicitudes', error);
        }
    },

    respondToRequest: async (requestId, action) => {
        set((state) => ({
            actionLoading: { ...state.actionLoading, [requestId]: true }
        }));

        try {
            await axios.post(`/api/friends/requests/${requestId}/${action}`);

            set((state) => ({
                incomingRequests: state.incomingRequests.filter(req => req.id !== requestId),
                actionLoading: { ...state.actionLoading, [requestId]: false }
            }));

            return { success: true };
        } catch (error) {
            set((state) => ({
                actionLoading: { ...state.actionLoading, [requestId]: false }
            }));
            return { success: false, error: error.message || 'Error al procesar la acción' };
        }
    }
}));
