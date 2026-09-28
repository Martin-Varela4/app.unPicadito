import React from 'react';
import { PlayerCard } from './PlayerCard';

export const RoomParticipantsList = ({ confirmedPlayers, substitutes, maxPlayers }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Participantes Inscriptos</h2>

            {/* Titulares Confirmados */}
            <div>
                <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                    Titulares Confirmados ({confirmedPlayers.length}/{maxPlayers})
                </h3>
                {confirmedPlayers.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Aún no hay jugadores confirmados.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {confirmedPlayers.map((player) => (
                            <PlayerCard key={player.id} player={player} type="confirmed" />
                        ))}
                    </div>
                )}
            </div>

            {/* Jugadores Suplentes */}
            <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
                    Suplentes / En Espera ({substitutes.length})
                </h3>
                {substitutes.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No hay jugadores en la lista de suplentes.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {substitutes.map((player) => (
                            <PlayerCard key={player.id} player={player} type="substitute" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};