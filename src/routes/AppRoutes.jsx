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
import PerfilUsuario from '../features/profile/pages/ProfileView';
import EditProfileForm from '../features/profile/pages/ProfileEdit';
import HomePage from '../features/home/components/page/HomePage';
import ProfileEdit from '../features/players/pages/ProfileEdit';
import { MessagesPage } from '../features/messajes/pages/MessagesPAge';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/registro" element={<AuthPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<PerfilUsuario />} />
<<<<<<< HEAD
                    <Route path="/profileEdit" element={<ProfileEdit />} />
=======
                    <Route path="/profile/edit" element={<EditProfileForm />} />
>>>>>>> fdfaa1dc27a4ac5e99e61147a99c4654a7683904
                    <Route path="/partidos" element={<MatchesPage />} />
                    <Route path="/players" element={<PlayersPage />} />
                    <Route path="/users/:id" element={<PerfilUsuario />} />
                    <Route path="/salas/nueva" element={<CreateRoomPage />} />
                    <Route path="/salas/:id" element={<RoomDetail />} />
                    <Route path="/salas/:id/editar" element={<EditRoomPage />} />
                    <Route path="/messages" element={<MessagesPage/>} />
                </Route>
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}