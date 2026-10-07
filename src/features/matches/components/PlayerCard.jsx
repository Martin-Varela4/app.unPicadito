export const PlayerCard = ({
    player,
    type = 'confirmed',
    isOrganizer = false,
    canManage = false,
    onExpel,
    onTransfer,
}) => {
    const isConfirmed = type === 'confirmed';
    const bgColor = isConfirmed ? 'bg-green-50/50 border-green-100' : 'bg-amber-50/50 border-amber-100';
    const borderColor = isConfirmed ? 'border-green-200' : 'border-amber-200';

    const displayName = player.firstName
        ? `${player.firstName} ${player.lastName || ''}`.trim()
        : player.username || 'Jugador';

    return (
        <div className={`flex items-center justify-between p-2.5 border rounded-lg transition-colors ${bgColor}`}>
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                <img
                    src={player.profilePictureUrl || 'https://via.placeholder.com/40'}
                    alt={player.username || 'Avatar'}
                    className={`w-10 h-10 rounded-full object-cover border shrink-0 ${borderColor}`}
                />
                <div className="overflow-hidden min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        @{player.username || 'usuario'} {player.mainPosition && `• ${player.mainPosition}`}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pl-2">
                {isOrganizer && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Org
                    </span>
                )}

                {canManage && (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            title="Hacer organizador a este jugador"
                            onClick={() => onTransfer?.(player)}
                            className="p-1 text-sm hover:bg-emerald-100 rounded-md transition-colors"
                        >
                            👑
                        </button>
                        <button
                            type="button"
                            title="Expulsar jugador de la sala"
                            onClick={() => onExpel?.(player)}
                            className="p-1 text-sm hover:bg-red-100 rounded-md transition-colors"
                        >
                            🚫
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};