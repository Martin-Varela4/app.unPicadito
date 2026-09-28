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
            // 1. Validar esquema local con Yup
            await activeSchema.validate(formData, { abortEarly: false });

            // 2. Preparar el payload adaptado para el backend (Zod)
            let payload = { ...formData };

            if (!isLogin) {
                payload.nombreUsuario = payload.username;
                payload.passwordConfirm = payload.confirmPassword;
                payload.nombre = payload.username; 
                payload.apellido = "Sin apellido"; 
                delete payload.username;
                delete payload.confirmPassword;
            }

            console.log("🚀 [DEBUG] Enviando payload:", payload);

            // 3. Ejecutar servicio de Axios
            const response = await activeService(payload);
            console.log("📥 [DEBUG] Respuesta cruda del backend:", response);

            // 4. Extracción de datos
            const user = response.user ?? response.data?.user ?? response;
            const token = response.token ?? response.data?.token;
            const refreshToken = response.refreshToken ?? response.data?.refreshToken ?? null;

            console.log("🔑 [DEBUG] Token extraído:", token);
            console.log("👤 [DEBUG] Usuario extraído:", user);

            if (!token) {
                console.warn("⚠️ [DEBUG] ¡Cuidado! El token llegó como undefined o null.");
            }

            // 5. Guardar en Zustand
            storeLogin({ user, token, refreshToken });
            console.log("🔄 [DEBUG] Intentando navegar a /profile...");

            // 6. Redireccionar
            navigate('/profile', { replace: true });

        } catch (error) {
            console.error("❌ [DEBUG] Error atrapado en authenticate:", error);
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