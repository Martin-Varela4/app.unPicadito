import { useState } from 'react';
import { cancelarSala } from '../services/matchService';

export const useCancelRoom = () => {
    const [isCanceling, setIsCanceling] = useState(false);
    const [error, setError] = useState('');

    const executeCancel = async (roomId, motivo) => {
        setIsCanceling(true);
        setError('');
        
        try {
            await cancelarSala(roomId, motivo);
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Error al cancelar la sala';
            setError(errorMessage);
            return { success: false };
        } finally {
            setIsCanceling(false);
        }
    };

    return { executeCancel, isCanceling, error, setError };
};