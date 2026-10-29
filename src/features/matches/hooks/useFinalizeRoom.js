import { useState } from 'react';
import { finalizarSala } from '../services/matchService';

export const useFinalizeRoom = () => {
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [error, setError] = useState('');

    const executeFinalize = async (roomId) => {
        setIsFinalizing(true);
        setError('');

        try {
            await finalizarSala(roomId);
            return { success: true };
        } catch (err) {
            setError(err.message || 'Error al finalizar la sala');
            return { success: false };
        } finally {
            setIsFinalizing(false);
        }
    };

    return { executeFinalize, isFinalizing, error, setError };
};