import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../features/auth/pages/AuthPage';
import MatchesPage from '../features/matches/pages/MatchesPage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { PlayersPage } from "../features/players/pages/PlayersPage";
import PerfilUsuario from '../features/profile/pages/ProfileView';




export default function AppRoutes() {
    return (
        <Routes>
            {/* Rutas Públicas (Solo para invitados) */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/registro" element={<AuthPage />} />

            </Route>
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/users/:id" element={<PerfilUsuario />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile/view" element={<UserProfile />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/partidos" element={<MatchesPage />} />
            </Route>

            {/* Ruta pordefecto */}
            <Route path="/" element={<Navigate to="/" replace />} />
            
            {/*Cualquier ruta no existente va redirigido al login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}