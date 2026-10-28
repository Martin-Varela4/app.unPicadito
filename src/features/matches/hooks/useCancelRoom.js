import { useAsyncAction } from '../../../hooks/useAsyncAction';
import { cancelarSala } from '../services/matchService';

export const useCancelRoom = () => {
    const { execute, isLoading, error, setError } = useAsyncAction(
        cancelarSala,
        'Error al cancelar la sala'
    );

    return {
        executeCancel: execute,
        isCanceling: isLoading,
        error,
        setError,
    };
};
