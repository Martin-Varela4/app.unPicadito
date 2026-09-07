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
    // Usa la acción `login` del store (no `setAuth`, que no existe)
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
            // 1. Validar esquema con Yup
            await activeSchema.validate(formData, { abortEarly: false });

            // 2. Ejecutar servicio de Axios
            const response = await activeService(formData);

            // 3. Adaptabilidad del backend (soporta diferentes estructuras de respuesta)
            const user = response.user ?? response.data?.user ?? response;
            const token = response.token ?? response.data?.token;
            const refreshToken = response.refreshToken ?? response.data?.refreshToken ?? null;

            // 4. Guardar en Zustand usando la acción `login` del store
            storeLogin({ user, token, refreshToken });

            // 5. Redireccionar al home
            navigate('/', { replace: true });
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                // Errores de validación de Yup: mapeamos path → mensaje
                const formattedErrors = {};
                error.inner.forEach((err) => {
                    if (!formattedErrors[err.path]) {
                        formattedErrors[err.path] = err.message;
                    }
                });
                setValidationErrors(formattedErrors);
            } else {
                // Errores de red/servidor: axiosInstance ya normalizó el mensaje en error.message
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