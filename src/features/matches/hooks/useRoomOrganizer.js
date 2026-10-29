import { useState } from 'react';
import { expelPlayer, transferOrganizer } from '../services/matchService';

export const useRoomOrganizer = (roomId, onActionSuccess) => {
    const [targetPlayer, setTargetPlayer] = useState(null);
    const [actionType, setActionType] = useState(null); // 'EXPEL' | 'TRANSFER'
    const [isLoading, setIsLoading] = useState(false);
    const [actionError, setActionError] = useState('');

    const openExpelModal = (player) => {
        setTargetPlayer(player);
        setActionType('EXPEL');
        setActionError('');
    };

    const openTransferModal = (player) => {
        setTargetPlayer(player);
        setActionType('TRANSFER');
        setActionError('');
    };

    const closeModal = () => {
        if (isLoading) return;
        setTargetPlayer(null);
        setActionType(null);
        setActionError('');
    };

    const handleConfirm = async () => {
        if (!targetPlayer) return;
        setIsLoading(true);
        setActionError('');

        try {
            const targetUserId = targetPlayer.userId ?? targetPlayer.user?.id ?? targetPlayer.usuario?.id ?? targetPlayer.id;

            if (actionType === 'EXPEL') {
                await expelPlayer(roomId, targetUserId);
            } else if (actionType === 'TRANSFER') {
                await transferOrganizer(roomId, targetUserId);
            }

            closeModal();
            if (onActionSuccess) {
                await onActionSuccess();
            }
        } catch (err) {
            setActionError(err.message || 'Ocurrió un error al procesar la acción.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        targetPlayer,
        actionType,
        isLoading,
        actionError,
        openExpelModal,
        openTransferModal,
        closeModal,
        handleConfirm,
    };
};