import { useEffect, useState } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useFinalizeRoom } from '../hooks/useFinalizeRoom';
import { getFinalizeAvailableAt } from '../utils/dateUtils';
import Button from '../../../components/ui/Button';
import { ConfirmModal } from '../../../components/ConfirmModal';

const OPEN_STATUSES = ['ABIERTA', 'COMPLETA'];
const MAX_TIMEOUT_MS = 2147483647;

export const FinalizeRoomManager = ({ room, roomId, onFinalizeSuccess }) => {
    const { user: currentUser } = useAuthStore();
    const { executeFinalize, isFinalizing, error, setError } = useFinalizeRoom();

    const [isOpen, setIsOpen] = useState(false);
    const [now, setNow] = useState(() => Date.now());

    const availableAt = getFinalizeAvailableAt(room.raw?.fechaHoraPartido);
    const availableAtMs = availableAt ? availableAt.getTime() : null;

    useEffect(() => {
        if (availableAtMs === null) return;
        const delay = Math.max(availableAtMs - Date.now(), 0);
        if (delay > MAX_TIMEOUT_MS) return;
        const timeoutId = setTimeout(() => setNow(Date.now()), delay);
        return () => clearTimeout(timeoutId);
    }, [availableAtMs]);

    const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room.organizerId;
    const isFinalizable = OPEN_STATUSES.includes(room.status);

    if (!isOrganizer || !isFinalizable) return null;

    const canFinalize = availableAtMs !== null && now >= availableAtMs;
    const availableLabel = availableAt
        ? availableAt.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
        : '';

    const handleFinalize = async () => {
        const { success } = await executeFinalize(roomId);

        if (success) {
            setIsOpen(false);
            await onFinalizeSuccess();
        }
    };

    const handleClose = () => {
        if (isFinalizing) return;
        setIsOpen(false);
        setError('');
    };

    return (
        <div className="mt-6 flex flex-col items-end gap-2 border-t border-slate-700 pt-6">
            <Button
                id="room-finalize-button"
                onClick={() => setIsOpen(true)}
                disabled={!canFinalize}
            >
                Finalizar partido
            </Button>
            {!canFinalize && availableLabel && (
                <p className="text-xs text-slate-400">
                    Se habilita el {availableLabel} hs (30 minutos después del inicio).
                </p>
            )}

            <ConfirmModal isOpen={isOpen} onClose={handleClose} title="¿Finalizar el partido?">
                <div className="flex flex-col gap-4">
                    <p className="text-slate-300">
                        La sala pasará a estado <strong>Finalizada</strong> y se habilitarán las
                        calificaciones. Esta acción no se puede deshacer.
                    </p>
                    {error && <span className="text-sm text-red-500">{error}</span>}

                    <div className="mt-2 flex justify-end gap-2">
                        <Button variant="ghost" onClick={handleClose} disabled={isFinalizing}>
                            Volver
                        </Button>
                        <Button onClick={handleFinalize} isLoading={isFinalizing}>
                            Confirmar
                        </Button>
                    </div>
                </div>
            </ConfirmModal>
        </div>
    );
};