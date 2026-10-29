import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useLeaveRoom } from '../hooks/useLeaveRoom';
import Button from '../../../components/ui/Button';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { ACTIVE_PARTICIPANT_STATUSES, CLOSED_ROOM_STATUSES, PARTICIPANT_STATUS } from '../constants/matchConstants';

export const LeaveRoomManager = ({ room, roomId, onLeaveSuccess }) => {
    const { user: currentUser } = useAuthStore();
    const { executeLeave, isLeaving, error, setError } = useLeaveRoom();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room.organizerId;
    const myParticipation = room.participants?.find((p) => p.userId === currentUser?.id);
    const isPending = myParticipation?.status === PARTICIPANT_STATUS.PENDING;

    const isParticipant = room.participants?.some(
        (p) => p.userId === currentUser?.id && ACTIVE_PARTICIPANT_STATUSES.includes(p.status)
    );

    const isLeavable = !CLOSED_ROOM_STATUSES.includes(room.status);

    if (!isParticipant || !isLeavable) return null;

    if (isOrganizer) {
        return (
            <div className="border-t border-slate-700 mt-6 pt-4 text-center">
                <p id="room-leave-organizer-hint" className="text-sm text-slate-400">
                    Para salir de la sala, transferí la organización a otro jugador o cancelá la sala.
                </p>
            </div>
        );
    }

    const handleLeave = async () => {
        const { success } = await executeLeave(roomId);

        if (success) {
            setIsOpen(false);
            if (onLeaveSuccess) {
                onLeaveSuccess();
            } else {
                navigate('/partidos');
            }
        }
    };

    return (
        <div className="flex justify-end border-t border-slate-700 mt-6 pt-6">
            <Button variant="danger" onClick={() => setIsOpen(true)}>
                {isPending ? 'Cancelar Solicitud' : 'Salir de la Sala'}
            </Button>

            <ConfirmModal
                isOpen={isOpen}
                onClose={() => { setIsOpen(false); setError(''); }}
                title={isPending ? '¿Cancelar solicitud?' : '¿Salir de la sala?'}
            >
                <div className="flex flex-col gap-4">
                    <p className="text-slate-300">
                        {isPending
                            ? '¿Estás seguro de que deseas cancelar tu solicitud de ingreso para este partido?'
                            : '¿Estás seguro de que querés abandonar este partido? Si cambiás de opinión, tendrás que volver a solicitar tu lugar.'}
                    </p>

                    {error && (
                        <p role="alert" className="text-sm text-red-400 font-medium">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 mt-2">
                        <Button
                            variant="secondary"
                            onClick={() => { setIsOpen(false); setError(''); }}
                            disabled={isLeaving}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleLeave}
                            isLoading={isLeaving}
                        >
                            {isPending ? 'Cancelar Solicitud' : 'Confirmar Salida'}
                        </Button>
                    </div>
                </div>
            </ConfirmModal>
        </div>
    );
};
