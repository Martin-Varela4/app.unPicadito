import Avatar from '../../../components/ui/Avatar';

export const PendingPlayersList = ({
    players = [],
    selectedId = null,
    disabled = false,
    onSelect,
}) => {
    return (
        <div className="border-b border-[var(--color-border-subtle)] pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <h4 className="mb-4 text-base font-semibold text-slate-100">
                Jugadores del partido
            </h4>

            <div className="flex flex-col gap-2">
                {players.map((player) => {
                    const isSelected = player.userId === selectedId;
                    const fullName = `${player.nombre || ''} ${player.apellido || ''}`.trim() || player.nombreUsuario || 'Jugador';
                    const subtitle = player.puedeCalificar
                        ? player.posicionPrincipal
                        : `Podrás calificarlo en ${player.diasRestantes} día${player.diasRestantes === 1 ? '' : 's'}`;

                    return (
                        <button
                            key={player.userId}
                            type="button"
                            disabled={!player.puedeCalificar || disabled}
                            onClick={() => onSelect?.(player.userId)}
                            className={`flex w-full items-center gap-3 rounded-sm border p-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                isSelected
                                    ? 'border-[var(--color-brand-primary)]/60 bg-slate-800'
                                    : 'border-transparent hover:bg-slate-800'
                            }`}
                        >
                            <Avatar
                                src={player.fotoPerfilUrl}
                                alt={`Foto de perfil de ${fullName}`}
                                className="h-11 w-11 shrink-0 rounded-full object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <strong className="block truncate text-sm font-semibold text-slate-100">
                                    {fullName}
                                </strong>
                                <span className="block truncate text-xs text-slate-400">
                                    {subtitle}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

