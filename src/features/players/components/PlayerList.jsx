export const PlayerList = ({ players }) => {
  const handleViewProfile = (playerId, username) => {
    // guía para el que tenga que implementar la navegación a la página de perfil del jugador
    console.log(`[Futura Implementación]: Redirigir a /players/${playerId}`);
    alert(`acá se abririía el perfil de @${username} (ID: ${playerId})`);
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      {players.map((player) => (
        <div 
          key={player.id} 
          className="flex flex-col gap-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          {/* Datos del Jugador */}
          <div className="min-w-0">
            <h3 className="mb-2 break-words font-semibold text-slate-100">
              {player.nombre} {player.apellido}{" "}
              <span className="text-sm font-normal text-slate-400">
                (@{player.nombreUsuario})
              </span>
            </h3>
            <p className="text-sm text-slate-300">
              <strong>Posición:</strong> {player.posicionPrincipal}
            </p>
          </div>

          {/* Botón de ejemplo */}
          <button
            onClick={() => handleViewProfile(player.id, player.nombreUsuario)}
            className="min-h-11 shrink-0 rounded-md border border-[var(--color-border-subtle)] bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
          >
            Ver Perfil 
          </button>
        </div>
      ))}
    </div>
  );
};
