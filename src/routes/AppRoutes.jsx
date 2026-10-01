import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../features/auth/pages/AuthPage';
import MatchesPage from '../features/matches/pages/MatchesPage';
import { RoomDetail } from '../features/matches/pages/RoomDetail';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { PlayersPage } from "../features/players/pages/PlayersPage";
import PerfilUsuario from '../features/profile/pages/ProfileView';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/registro" element={<AuthPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<PerfilUsuario />} />
                <Route path="/partidos" element={<MatchesPage />} />
                <Route path="/players" element={<PlayersPage />} />
                <Route path="/users/:id" element={<PerfilUsuario />} />
                <Route path='/salas/:id' element={<RoomDetail />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}