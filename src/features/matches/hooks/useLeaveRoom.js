import { useAsyncAction } from '../../../hooks/useAsyncAction';
import { leaveMatch } from '../services/matchService';

export const useLeaveRoom = () => {
    const { execute, isLoading, error, setError } = useAsyncAction(
        leaveMatch,
        'Error al salir de la sala'
    );

    return {
        executeLeave: execute,
        isLeaving: isLoading,
        error,
        setError,
    };
};
