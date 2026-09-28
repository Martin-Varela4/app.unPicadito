import React, { useMemo } from "react";

const TACTICAL_FORMATIONS = {
  "Fútbol 5": [
    { top: "85%", left: "50%" }, // Arquero
    { top: "65%", left: "25%" }, // Cierre / Defensor Izq
    { top: "65%", left: "75%" }, // Cierre / Defensor Der
    { top: "40%", left: "50%" }, // Ala / Mediocampista
    { top: "15%", left: "50%" }, // Pívot / Delantero
  ],
};

/**
 * TacticalBoard - Componente estilo TacticalPad para formación visual en cancha
 * @param {Array} players - Lista de jugadores [{ id, name, position, number }]
 * @param {string} modality - Modalidad de juego ('Fútbol 5', 'Fútbol 7', 'Fútbol 11')
 * @param {Function} [onPlayerClick] - Callback opcional al hacer clic en un jugador
 */
export default function TacticalBoard({
  players = [],
  modality = "Fútbol 5",
  onPlayerClick,
}) {
  const defaultPositions = useMemo(() => {
    return TACTICAL_FORMATIONS[modality] || TACTICAL_FORMATIONS["Fútbol 5"];
  }, [modality]);

  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center text-xs text-slate-500 font-semibold px-1">
        <span>Formación Visual ({modality})</span>
        <span>{players.length} Jugadores</span>
      </div>

      {/* Contenedor Cancha estilo TacticalPad */}
      <div className="relative w-full aspect-[2/3] bg-emerald-600 rounded-2xl border-4 border-slate-800 shadow-inner overflow-hidden flex flex-col justify-between p-3 select-none">
        {/* Líneas de Demarcación de la Cancha */}
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-white/40 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Área Rival (Arriba) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/6 border-b-2 border-x-2 border-white/40 rounded-b-xl pointer-events-none" />

        {/* Área Propia (Abajo) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/6 border-t-2 border-x-2 border-white/40 rounded-t-xl pointer-events-none" />

        {/* Marcación de Jugadores en el Campo */}
        {players.map((player, index) => {
          const pos = defaultPositions[index] || {
            top: `${20 + ((index * 12) % 60)}%`,
            left: `${20 + ((index * 25) % 70)}%`,
          };

          const playerName = player.name || `Jugador ${index + 1}`;
          const playerNumber = player.number || index + 1;

          return (
            <div
              key={player.id || `player-${index}`}
              onClick={() => onPlayerClick?.(player)}
              tabIndex={0}
              role="button"
              aria-label={`Jugador ${playerName}, dorsal ${playerNumber}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full"
              style={{ top: pos.top, left: pos.left }}
            >
              {/* Ficha / Camiseta del Jugador */}
              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 text-white font-bold text-xs flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                {playerNumber}
              </div>

              {/* Nombre / Label del Jugador */}
              <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm border border-white/10">
                {playerName}
              </span>
            </div>
          );
        })}

        {/* Mensaje cuando no hay jugadores asignados */}
        {players.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <span className="text-white/80 text-xs font-semibold bg-slate-900/60 px-3 py-1.5 rounded-lg">
              Sin jugadores posicionados
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
