import api from '../../../api/axiosInstance';

export const walletApi = {
    getSaldo: async () => {
        const response = await api.get('/api/wallet/balance');
        return response.data;
    },
};