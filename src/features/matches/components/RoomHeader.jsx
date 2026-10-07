import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import { useAuthStore } from '../../auth/store/useAuthStore';

const CLOSED_STATUSES = ['CANCELADA', 'FINALIZADA'];

const STATUS_BADGES = {
    CANCELADA: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
    FINALIZADA: { label: 'Finalizada', className: 'bg-slate-200 text-slate-700' },
    COMPLETA: { label: 'Completa', className: 'bg-amber-100 text-amber-800' },
    ABIERTA: { label: 'Disponible', className: 'bg-green-100 text-green-800' },
};

const MEMBERSHIP_BADGES = {
    ORGANIZER: { label: 'Organizás este partido', className: 'bg-emerald-100 text-emerald-800' },
    CONFIRMED: { label: 'Sos titular', className: 'bg-blue-100 text-blue-800' },
    SUBSTITUTE: { label: 'Sos suplente', className: 'bg-amber-100 text-amber-800' },
    PENDING: { label: 'Solicitud pendiente', className: 'bg-slate-100 text-slate-700' },
};

export const RoomHeader = ({ room, roomId, availableSlots, onJoin, isJoining, joinError }) => {
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.user);

    const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room.organizerId;
    const myParticipation = room.participants?.find((p) => p.userId === currentUser?.id);
    const isClosed = CLOSED_STATUSES.includes(room.status);

    const canEdit = isOrganizer && !isClosed;

    const membership = isOrganizer ? 'ORGANIZER' : myParticipation?.status;
    const membershipBadge = MEMBERSHIP_BADGES[membership];
    const isMember = Boolean(membershipBadge);

    const canJoin =
        !isMember &&
        ['ABIERTA', 'COMPLETA'].includes(room.status) &&
        (availableSlots > 0 || room.allowsSubstitutes);

    const statusBadge =
        room.status === 'ABIERTA' && availableSlots === 0
            ? STATUS_BADGES.COMPLETA
            : STATUS_BADGES[room.status] ?? STATUS_BADGES.ABIERTA;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.className}`}>
                        {statusBadge.label}
                    </span>
                    {membershipBadge && (
                        <span id="room-membership-badge" className={`px-3 py-1 text-xs font-semibold rounded-full ${membershipBadge.className}`}>
                            {membershipBadge.label}
                        </span>
                    )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{room.title}</h1>
                <p className="text-gray-600 text-sm">{room.description || 'Sin descripción adicional.'}</p>
                {joinError && (
                    <p role="alert" className="text-sm text-red-600 font-medium">
                        {joinError}
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {canEdit && (
                    <Button id="room-edit-button" onClick={() => navigate(`/salas/${roomId}/editar`)}>
                        ✏️ Editar Sala
                    </Button>
                )}
                {canJoin && (
                    <Button id="room-join-button" onClick={onJoin} isLoading={isJoining}>
                        {room.isPublic ? 'Unirme' : 'Solicitar unirme'}
                    </Button>
                )}
            </div>
        </div>
    );
};