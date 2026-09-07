import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';

export default function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirige a login guardando la ruta previa para posibles retornos
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}