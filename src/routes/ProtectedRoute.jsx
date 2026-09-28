// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation} from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const location = useLocation();

  if (!hasHydrated) {
    return <div>Cargando sesión...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}