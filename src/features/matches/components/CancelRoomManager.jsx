import { useState } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import Button from '../../../components/ui/Button';
import { CancelRoomModal } from './CancelRoomModal';
import { CLOSED_ROOM_STATUSES } from '../constants/matchConstants';

export const CancelRoomManager = ({ room, roomId, onCancelSuccess }) => {
    const { user: currentUser } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room.organizerId;
    const isCancelable = !CLOSED_ROOM_STATUSES.includes(room.status);

    if (!isOrganizer || !isCancelable) return null;

    return (
        <div className="flex justify-end border-t border-slate-700 mt-6 pt-6">
            <Button variant="danger" onClick={() => setIsOpen(true)}>
                Cancelar Sala
            </Button>

            <CancelRoomModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                roomId={roomId}
                onCancelSuccess={onCancelSuccess}
            />
        </div>
    );
};
