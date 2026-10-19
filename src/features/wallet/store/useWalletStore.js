import { create } from 'zustand';
import { walletApi } from '../services/walletApi';

export const useWalletStore = create((set) => ({
    saldoCredito: 0,
    isLoading: false,
    error: null,

    fetchSaldo: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await walletApi.getSaldo();
            set({ saldoCredito: Number(data.saldoCredito), isLoading: false });
        } catch (err) {
            set({ error: 'Error al cargar el saldo', isLoading: false });
        }
    },

    setSaldo: (nuevoSaldo) => set({ saldoCredito: Number(nuevoSaldo) }),
}));