import { Routes, Route, Navigate } from 'react-router-dom'; // 👈 Se quitó useState porque ya no se usa aquí
import AuthPage from '../features/auth/pages/AuthPage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Home from '../features/auth/pages/Home';

// 👇 REQUISITO: Importar ProfilePage para que la ruta funcione
import ProfilePage from '../features/auth/pages/ProfilePage'; 

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
                {/* Ruta de inicio de la aplicación */}
                <Route path="/" element={<Home />} />
                
                {/* Ruta del perfil unificado (controla visualización y edición) */}
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Comodín: cualquier ruta no existente redirige a /login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
