import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';

export const RoomHeader = ({ room, roomId, availableSlots }) => {
    const navigate = useNavigate();

    const getStatusBadge = () => {
        if (room.status === 'CLOSED') {
            return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Cerrada</span>;
        }
        if (availableSlots === 0) {
            return <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">Llena</span>;
        }
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Disponible</span>;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{room.title}</h1>
                    {getStatusBadge()}
                </div>
                <p className="text-gray-600 text-sm">{room.description || "Sin descripción adicional para este partido."}</p>
            </div>
            <Button
                onClick={() => navigate(`/rooms/edit/${roomId}`)}
                className="w-full md:w-auto"
            >
                Editar Sala
            </Button>
        </div>
    );
};