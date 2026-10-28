import { useState } from 'react';
import { ConfirmModal } from '../../../components/ConfirmModal';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';
import { useCancelRoom } from '../hooks/useCancelRoom';
import { CANCEL_REASON_MAX_LENGTH, CANCEL_REASON_MIN_LENGTH } from '../constants/matchConstants';

export const CancelRoomModal = ({ isOpen, onClose, roomId, onCancelSuccess }) => {
    const { executeCancel, isCanceling, error, setError } = useCancelRoom();
    const [motivo, setMotivo] = useState('');

    const handleClose = () => {
        setError('');
        setMotivo('');
        onClose();
    };

    const handleConfirm = async () => {
        const trimmed = motivo.trim();
        if (trimmed.length < CANCEL_REASON_MIN_LENGTH) {
            setError(`El motivo debe tener al menos ${CANCEL_REASON_MIN_LENGTH} caracteres.`);
            return;
        }
        if (trimmed.length > CANCEL_REASON_MAX_LENGTH) {
            setError(`El motivo no puede superar los ${CANCEL_REASON_MAX_LENGTH} caracteres.`);
            return;
        }

        const { success } = await executeCancel(roomId, trimmed);
        if (success) {
            handleClose();
            if (onCancelSuccess) {
                onCancelSuccess();
            }
        }
    };

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={handleClose}
            title="¿Cancelar la sala?"
        >
            <div className="flex flex-col gap-4 text-left">
                <p className="text-slate-300">
                    Esta acción no se puede deshacer. Indica el motivo de fuerza mayor:
                </p>

                <Textarea
                    name="motivoCancelacion"
                    rows={3}
                    value={motivo}
                    maxLength={CANCEL_REASON_MAX_LENGTH}
                    placeholder="Ej: La cancha cerró por tormenta eléctrica."
                    onChange={(e) => {
                        setMotivo(e.target.value);
                        if (error) setError('');
                    }}
                    error={error}
                />

                <div className="flex justify-end gap-2 mt-2">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isCanceling}
                    >
                        Volver
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        isLoading={isCanceling}
                        disabled={isCanceling || motivo.trim().length < CANCEL_REASON_MIN_LENGTH}
                    >
                        Confirmar Cancelación
                    </Button>
                </div>
            </div>
        </ConfirmModal>
    );
};

export default CancelRoomModal;
