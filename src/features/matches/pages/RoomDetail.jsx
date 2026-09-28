import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/axios';
import { RoomHeader } from '../components/RoomHeader';
import { RoomInfoCard } from '../components/RoomInfoCard';
import { RoomSlotsSummary } from '../components/RoomSlotsSummary';
import { RoomParticipantsList } from '../components/RoomParticipantsList';

export const RoomDetail = () => {
    const { roomId } = useParams();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoomDetail = async () => {
            try {
                const response = await api.get(`/rooms/${roomId}`);
                setRoom(response.data);
            } catch (err) {
                setError('No se pudo cargar la información de la sala.');
            } finally {
                setLoading(false);
            }
        };
        fetchRoomDetail();
    }, [roomId]);

    if (loading) return <div className="text-center py-10 text-gray-600">Cargando detalles del partido...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!room) return <div className="text-center py-10 text-gray-500">Sala no encontrada.</div>;

    const confirmedPlayers = room.participants?.filter(p => p.status === 'CONFIRMED') || [];
    const substitutes = room.participants?.filter(p => p.status === 'SUBSTITUTE') || [];
    const availableSlots = Math.max(0, room.maxPlayers - confirmedPlayers.length);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">

            {/* Cabecera */}
            <RoomHeader room={room} roomId={roomId} availableSlots={availableSlots} />

            {/* Grid de Información Principal y Cupos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoomInfoCard room={room} />
                <RoomSlotsSummary
                    maxPlayers={room.maxPlayers}
                    confirmedCount={confirmedPlayers.length}
                    availableSlots={availableSlots}
                />
            </div>

            {/* Lista de Participantes */}
            <RoomParticipantsList
                confirmedPlayers={confirmedPlayers}
                substitutes={substitutes}
                maxPlayers={room.maxPlayers}
            />

        </div>
    );
};