import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../auth/store/useAuthStore';

const CLOSED_STATUSES = ['CANCELADA', 'FINALIZADA'];

const STATUS_BADGES = {
    CANCELADA: { label: 'Cancelada', className: 'bg-red-900/40 text-red-200' },
    FINALIZADA: { label: 'Finalizada', className: 'bg-slate-700 text-slate-200' },
    COMPLETA: { label: 'Completa', className: 'bg-amber-900/40 text-amber-200' },
    ABIERTA: { label: 'Disponible', className: 'bg-green-900/40 text-green-200' },
};

const MEMBERSHIP_BADGES = {
    ORGANIZER: { label: 'Organizás este partido', className: 'bg-[var(--color-brand-primary)] text-[#21263A]' },
    CONFIRMED: { label: 'Sos titular', className: 'bg-blue-900/40 text-blue-200' },
    SUBSTITUTE: { label: 'Sos suplente', className: 'bg-amber-900/40 text-amber-200' },
    PENDING: { label: 'Solicitud pendiente', className: 'bg-slate-800 text-slate-200' },
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
        <div className="flex flex-col items-start justify-between gap-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-6 md:flex-row md:items-center">
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
                <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">{room.title}</h1>
                <p className="text-slate-300 text-sm">{room.description || 'Sin descripción adicional.'}</p>
                {joinError && (
                    <p role="alert" className="text-sm font-medium text-red-300">
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