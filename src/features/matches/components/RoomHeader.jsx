import { useNavigate } from 'react-router';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { CLOSED_ROOM_STATUSES, ROOM_STATUS, MEMBERSHIP_STATUS_CONFIG, ROOM_STATUS_CONFIG } from '../constants/matchConstants';

export const RoomHeader = ({ room, roomId, availableSlots, onJoin, isJoining, joinError }) => {
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.user);

    const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room.organizerId;
    const myParticipation = room.participants?.find((p) => p.userId === currentUser?.id);
    const isClosed = CLOSED_ROOM_STATUSES.includes(room.status);
    const canEdit = isOrganizer && !isClosed;

    const membership = isOrganizer ? 'ORGANIZER' : myParticipation?.status;
    const membershipBadge = MEMBERSHIP_STATUS_CONFIG[membership];
    const isMember = Boolean(membershipBadge);
    const canRate = room.status === 'FINALIZADA' && ['ORGANIZER', 'CONFIRMED', 'SUBSTITUTE'].includes(membership);

    const canJoin =
        !isMember &&
        [ROOM_STATUS.ABIERTA, ROOM_STATUS.COMPLETA].includes(room.status) &&
        (availableSlots > 0 || room.allowsSubstitutes);

    const statusBadge =
        room.status === ROOM_STATUS.ABIERTA && availableSlots === 0
            ? ROOM_STATUS_CONFIG[ROOM_STATUS.COMPLETA]
            : ROOM_STATUS_CONFIG[room.status] ?? ROOM_STATUS_CONFIG[ROOM_STATUS.ABIERTA];

    return (
        <div className="flex flex-col items-start justify-between gap-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-6 md:flex-row md:items-center">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge className={statusBadge.className}>
                        {statusBadge.label}
                    </Badge>
                    {membershipBadge && (
                        <Badge id="room-membership-badge" className={membershipBadge.className}>
                            {membershipBadge.label}
                        </Badge>
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
                {canRate && (
                    <Button id="room-rate-button" disabled title="Disponible próximamente (UP-061)">
                        ⭐ Calificar jugadores
                    </Button>
                )}
            </div>
        </div>
    );
};
