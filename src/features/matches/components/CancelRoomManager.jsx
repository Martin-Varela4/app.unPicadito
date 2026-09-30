import { useState } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useCancelRoom } from '../hooks/useCancelRoom';
import Button from '../../../components/Button';
import { ConfirmModal } from '../../../components/ConfirmModal';

export const CancelRoomManager = ({ room, roomId, onCancelSuccess }) => {
    const { user: currentUser } = useAuthStore();
    const { executeCancel, isCanceling, error, setError } = useCancelRoom();
    
    const [isOpen, setIsOpen] = useState(false);
    const [motivo, setMotivo] = useState('');

    const isCreator = currentUser?.id === room.creadorId;
    const isCancelable = room.status !== 'CANCELADA' && room.status !== 'FINALIZADA';

    if (!isCreator || !isCancelable) return null;

    const handleCancelar = async () => {
        if (motivo.length < 10) {
            setError('El motivo debe tener al menos 10 caracteres.');
            return;
        }
        if (motivo.length > 500) {
            setError('El motivo no puede superar los 500 caracteres.');
            return;
        }

        const { success } = await executeCancel(roomId, motivo);
        
        if (success) {
            setIsOpen(false);
            setMotivo('');
            onCancelSuccess(); 
        }
    };

    return (
        <div className="flex justify-end border-t border-slate-200 mt-6 pt-6">
            <Button variant="danger" onClick={() => setIsOpen(true)}>
                Cancelar Sala
            </Button>

            <ConfirmModal 
                isOpen={isOpen} 
                onClose={() => { setIsOpen(false); setError(''); setMotivo(''); }}
                title="¿Cancelar la sala?"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-gray-600">
                        Esta accion no se puede deshacer. Indica el motivo de fuerza mayor:
                    </p>
                    <textarea
                        className={`w-full p-2 border rounded-md resize-none ${error ? 'border-red-500' : 'border-gray-300'}`}
                        rows={4}
                        maxLength={500}
                        placeholder="Ej: La cancha cerró por tormenta eléctrica."
                        value={motivo}
                        onChange={(e) => {
                            setMotivo(e.target.value);
                            if (error) setError(''); // Limpia el error visual al escribir
                        }}
                    />
                    {error && <span className="text-red-500 text-sm">{error}</span>}
                    
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isCanceling}>
                            Volver
                        </Button>
                        <Button variant="danger" onClick={handleCancelar} disabled={isCanceling || motivo.length < 10}>
                            {isCanceling ? 'Cancelando...' : 'Confirmar'}
                        </Button>
                    </div>
                </div>
            </ConfirmModal>
        </div>
    );
};