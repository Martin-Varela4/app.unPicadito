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

    const isCreator = currentUser?.id === room.creadorId;

    // Check if current user is a participant
    const isParticipant = room.participants?.some(
        (p) => p.userId === currentUser?.id || p.id === currentUser?.id
    );

    const isLeavable = room.status !== 'CANCELADA' && room.status !== 'FINALIZADA';

    // Only show for non-creator participants in an active room
    if (isCreator || !isParticipant || !isLeavable) return null;

    const handleLeave = async () => {
        const { success } = await executeLeave(roomId);

        if (success) {
            setIsOpen(false);
            if (onLeaveSuccess) {
                onLeaveSuccess();
            } else {
                navigate('/matches');
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
                            Volver
                        </Button>
                        <Button variant="danger" onClick={handleLeave} disabled={isLeaving}>
                            {isLeaving ? 'Saliendo...' : 'Confirmar salida'}
                        </Button>
                    </div>
                </div>
            </ConfirmModal>
        </div>
    );
};
