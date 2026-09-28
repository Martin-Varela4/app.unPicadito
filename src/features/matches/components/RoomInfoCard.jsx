import React from 'react';

export const RoomInfoCard = ({ room }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Información del Encuentro</h2>

            <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900"> Día y Horario:</span>
                    <span>{room.date} - {room.time} hs</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900"> Predio / Cancha:</span>
                    <span>{room.location}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900"> Privacidad:</span>
                    <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-gray-700">{room.privacy || "Pública"}</span>
                </div>
            </div>
        </div>
    );
};