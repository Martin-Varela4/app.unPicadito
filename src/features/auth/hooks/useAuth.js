import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { loginService, registerService } from '../services/authService';
import { loginSchema, registerSchema } from '../schemas/authSchema';
import { validateWithSchema } from '../../../utils/validation';
import { DEFAULT_EMPTY_LASTNAME } from '../../../constants/appConstants';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    const navigate = useNavigate();
    const storeLogin = useAuthStore((state) => state.login);

    const clearErrors = () => {
        setValidationErrors({});
        setApiError(null);
    };

    const authenticate = async (mode, formData) => {
        clearErrors();
        setIsLoading(true);

        const isLogin = mode === 'login';
        const activeSchema = isLogin ? loginSchema : registerSchema;
        const activeService = isLogin ? loginService : registerService;

        try {
            const { isValid, errors } = await validateWithSchema(activeSchema, formData);
            if (!isValid) {
                setValidationErrors(errors);
                return;
            }

            let payload = { ...formData };

            if (!isLogin) {
                payload.nombreUsuario = payload.username;
                payload.passwordConfirm = payload.confirmPassword;
                payload.nombre = payload.username;
                payload.apellido = DEFAULT_EMPTY_LASTNAME;
                delete payload.username;
                delete payload.confirmPassword;
            }

            const response = await activeService(payload);

            const user = response.user ?? response.data?.user ?? response;
            const token = response.token ?? response.data?.token;
            const refreshToken = response.refreshToken ?? response.data?.refreshToken ?? null;

            storeLogin({ user, token, refreshToken });

            navigate('/', { replace: true });
        } catch (error) {
            setApiError(error.message ?? 'Ocurrió un error en el servidor. Por favor intentá más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        authenticate,
        isLoading,
        validationErrors,
        apiError,
        clearErrors,
    };
};
