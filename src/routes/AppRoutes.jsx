import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../features/auth/pages/AuthPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';



export default function AppRoutes() {
    return (
        <Routes>
            {/* Rutas Públicas (Solo para invitados) */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/registro" element={<AuthPage />} />
            </Route>

            {/* Rutas Protegidas (Solo para usuarios autenticados) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Comodín: cualquier ruta no existente redirige a /login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}