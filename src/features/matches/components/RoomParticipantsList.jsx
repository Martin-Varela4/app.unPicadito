import SectionCard from '../../../components/ui/SectionCard';
import { PlayerCard } from './PlayerCard';

function ParticipantGroupSection({
    title,
    titleColorClass,
    players,
    emptyText,
    type,
    isCurrentOrganizer,
    currentUserId,
    onExpelPlayer,
    onTransferOrganizer,
}) {
    return (
        <div>
            <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${titleColorClass}`}>
                {title}
            </h3>
            {players.length === 0 ? (
                <p className="text-sm italic text-slate-400">{emptyText}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {players.map((player) => (
                        <PlayerCard
                            key={player.id ?? player.userId}
                            player={player}
                            type={type}
                            isOrganizer={player.isOrganizer}
                            canManage={isCurrentOrganizer && player.userId !== currentUserId}
                            onExpel={onExpelPlayer}
                            onTransfer={onTransferOrganizer}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

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
        <SectionCard title="Participantes Inscriptos" className="space-y-6">
            {/* Titulares Confirmados */}
            <ParticipantGroupSection
                title={`Titulares Confirmados (${confirmedPlayers.length}/${maxPlayers})`}
                titleColorClass="text-green-300"
                players={confirmedPlayers}
                emptyText="Aún no hay jugadores confirmados."
                type="confirmed"
                isCurrentOrganizer={isCurrentOrganizer}
                currentUserId={currentUserId}
                onExpelPlayer={onExpelPlayer}
                onTransferOrganizer={onTransferOrganizer}
            />

            {/* Jugadores Suplentes */}
            <div className="pt-4 border-t border-slate-700">
                <ParticipantGroupSection
                    title={`Suplentes / En Espera (${substitutes.length})`}
                    titleColorClass="text-amber-300"
                    players={substitutes}
                    emptyText="No hay jugadores en la lista de suplentes."
                    type="substitute"
                    isCurrentOrganizer={isCurrentOrganizer}
                    currentUserId={currentUserId}
                    onExpelPlayer={onExpelPlayer}
                    onTransferOrganizer={onTransferOrganizer}
                />
            </div>
        </SectionCard>
    );
};
