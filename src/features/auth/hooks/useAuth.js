import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuthStore } from '../store/useAuthStore';
import { loginService, registerService } from '../services/authService';
import { loginSchema, registerSchema } from '../schemas/authSchema';

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
            await activeSchema.validate(formData, { abortEarly: false });

            let payload = { ...formData };

            if (!isLogin) {
                payload.nombreUsuario = payload.username;
                payload.passwordConfirm = payload.confirmPassword;
                payload.nombre = payload.username; 
                payload.apellido = "Sin apellido"; 
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
            if (error instanceof yup.ValidationError) {
                const formattedErrors = {};
                error.inner.forEach((err) => {
                    if (!formattedErrors[err.path]) {
                        formattedErrors[err.path] = err.message;
                    }
                });
                setValidationErrors(formattedErrors);
            } else {
                setApiError(error.message ?? 'Ocurrió un error en el servidor. Por favor intentá más tarde.');
            }
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