import { getLocalPart } from '../utils/dateUtils';

export const mapRoomFromApi = (rawRoom) => {
    if (!rawRoom) return null;

    const local = getLocalPart(rawRoom.fechaHoraPartido);

    return {
        id: rawRoom.id,
        title: rawRoom.nombre || '',
        description: rawRoom.descripcion || '',
        date: local.date,
        time: local.time,
        location: rawRoom.direccion || rawRoom.nombreCancha || '',
        maxPlayers: rawRoom.cuposTotales || 0,
        creatorId: rawRoom.creadorId || rawRoom.creador?.id,
        status: rawRoom.estado || 'ABIERTA',
        privacy: rawRoom.esPublica ? 'Pública' : 'Privada',
        participants: (rawRoom.participantes || []).map(p => ({
            ...p,
            id: p.id || p.usuario?.id,
            status: p.estado || "CONFIRMED"
        })),
        raw: rawRoom
    };
};
