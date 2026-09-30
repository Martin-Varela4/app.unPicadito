import { useState } from 'react';
import { leaveMatch } from '../services/matchService';

export const useLeaveRoom = () => {
    const [isLeaving, setIsLeaving] = useState(false);
    const [error, setError] = useState('');

    const executeLeave = async (roomId) => {
        setIsLeaving(true);
        setError('');

        try {
            await leaveMatch(roomId);
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Error al salir de la sala';
            setError(errorMessage);
            return { success: false };
        } finally {
            setIsLeaving(false);
        }
    };

    return { executeLeave, isLeaving, error, setError };
};
