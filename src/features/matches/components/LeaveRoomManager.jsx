import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useLeaveRoom } from '../hooks/useLeaveRoom';
import Button from '../../../components/Button';
import { ConfirmModal } from '../../../components/ConfirmModal';

export const LeaveRoomManager = ({ room, roomId, onLeaveSuccess }) => {
    const { user: currentUser } = useAuthStore();
    const { executeLeave, isLeaving, error, setError } = useLeaveRoom();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room.organizerId;

    const isParticipant = room.participants?.some(
        (p) => p.userId === currentUser?.id && ['CONFIRMED', 'SUBSTITUTE', 'PENDING'].includes(p.status)
    );

    const isLeavable = room.status !== 'CANCELADA' && room.status !== 'FINALIZADA';

    if (!isParticipant || !isLeavable) return null;

    if (isOrganizer) {
        return (
            <div className="border-t border-slate-200 mt-6 pt-4 text-center">
                <p id="room-leave-organizer-hint" className="text-sm text-slate-500">
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
        <div className="flex justify-end border-t border-slate-200 mt-6 pt-6">
            <Button variant="danger" onClick={() => setIsOpen(true)}>
                Salir de la Sala
            </Button>

            <ConfirmModal
                isOpen={isOpen}
                onClose={() => { setIsOpen(false); setError(''); }}
                title="¿Salir de la sala?"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-gray-600">
                        Vas a dejar tu lugar en este partido. Si querés volver a unirte,
                        tendrás que hacerlo desde la lista de partidos (sujeto a disponibilidad).
                    </p>

                    {error && <span className="text-red-500 text-sm">{error}</span>}

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isLeaving}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleLeave} isLoading={isLeaving}>
                            Confirmar Salida
                        </Button>
                    </div>
                </div>
            </ConfirmModal>
        </div>
    );
};