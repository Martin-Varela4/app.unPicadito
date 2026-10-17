import { PlayerCard } from './PlayerCard';

export const RoomParticipantsList = ({
    confirmedPlayers = [],
    substitutes = [],
    maxPlayers = 10,
    currentUserId,
    isCurrentOrganizer = false,
    onExpelPlayer,
    onTransferOrganizer,
}) => {
    return (
        <div className="space-y-6 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-6">
            <h2 className="border-b border-[var(--color-border-subtle)] pb-2 text-lg font-semibold text-slate-100">
                Participantes Inscriptos
            </h2>

            {/* Titulares Confirmados */}
            <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-300">
                    Titulares Confirmados ({confirmedPlayers.length}/{maxPlayers})
                </h3>
                {confirmedPlayers.length === 0 ? (
                    <p className="text-sm italic text-slate-400">Aún no hay jugadores confirmados.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {confirmedPlayers.map((player) => (
                            <PlayerCard
                                key={player.id ?? player.userId}
                                player={player}
                                type="confirmed"
                                isOrganizer={player.isOrganizer}
                                canManage={isCurrentOrganizer && player.userId !== currentUserId}
                                onExpel={onExpelPlayer}
                                onTransfer={onTransferOrganizer}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Jugadores Suplentes */}
            <div className="pt-4 border-t border-slate-700">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-300">
                    Suplentes / En Espera ({substitutes.length})
                </h3>
                {substitutes.length === 0 ? (
                    <p className="text-sm italic text-slate-400">No hay jugadores en la lista de suplentes.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {substitutes.map((player) => (
                            <PlayerCard
                                key={player.id ?? player.userId}
                                player={player}
                                type="substitute"
                                isOrganizer={player.isOrganizer}
                                canManage={isCurrentOrganizer && player.userId !== currentUserId}
                                onExpel={onExpelPlayer}
                                onTransfer={onTransferOrganizer}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};