import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';

/**
 * PrivateRoute — guard de rutas autenticadas.
 *
 * Si el usuario NO tiene token en el store Zustand,
 * redirige a /auth?mode=login y preserva la URL de origen
 * en el state para poder redirigir de vuelta post-login si se desea.
 *
 * Uso en App.jsx:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/" element={<HomePage />} />
 *   </Route>
 */
const PrivateRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
