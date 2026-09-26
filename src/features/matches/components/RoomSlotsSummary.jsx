import React from 'react';

export const RoomSlotsSummary = ({ maxPlayers, confirmedCount, availableSlots }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Estado de Cupos</h2>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{maxPlayers}</p>
                    <p className="text-xs text-gray-500 mt-1">Máximo</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Confirmados</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">{availableSlots}</p>
                    <p className="text-xs text-gray-500 mt-1">Vacantes</p>
                </div>
            </div>
        </div>
    );
};