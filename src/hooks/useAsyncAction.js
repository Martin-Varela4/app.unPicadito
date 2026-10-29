import { useState, useCallback } from 'react';

export const useAsyncAction = (actionFn, defaultErrorMessage = 'Ocurrió un error inesperado') => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const execute = useCallback(async (...args) => {
        setIsLoading(true);
        setError('');

        try {
            const data = await actionFn(...args);
            return { success: true, data };
        } catch (err) {
            const errorMessage = err?.message || defaultErrorMessage;
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [actionFn, defaultErrorMessage]);

    return { execute, isLoading, error, setError };
};
