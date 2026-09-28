import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';

export default function PublicRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/profile" replace />; // temporal, hasta que exista Home
    }

    return <Outlet />;
}