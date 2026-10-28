import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../features/auth/pages/AuthPage';
import MatchesPage from '../features/matches/pages/MatchesPage';
import CreateRoomPage from '../features/matches/pages/CreateRoomPage';
import { RoomDetail } from '../features/matches/pages/RoomDetail';
import { EditRoomPage } from '../features/matches/pages/EditRoomPage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import MainLayout from '../components/MainLayout';
import { PlayersPage } from '../features/players/pages/PlayersPage';
import ProfileView from '../features/profile/pages/ProfileView';
import ProfileEdit from '../features/profile/pages/ProfileEdit';
import HomePage from '../features/home/pages/HomePage';
import { MessagesPage } from '../features/messajes/pages/MessagesPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/registro" element={<AuthPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<MatchesPage />} />
                    <Route path="/inicio" element={<HomePage />} />
                    <Route path="/profile" element={<ProfileView />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/partidos" element={<MatchesPage />} />
                    <Route path="/players" element={<PlayersPage />} />
                    <Route path="/users/:id" element={<ProfileView />} />
                    <Route path="/salas/nueva" element={<CreateRoomPage />} />
                    <Route path="/salas/:id" element={<RoomDetail />} />
                    <Route path="/salas/:id/editar" element={<EditRoomPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                </Route>
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
