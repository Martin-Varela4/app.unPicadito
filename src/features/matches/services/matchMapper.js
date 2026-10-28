import { getLocalPart } from '../utils/dateUtils';
import { PARTICIPANT_STATUS, ROOM_STATUS } from '../constants/matchConstants';

const mapParticipantStatus = (p) => {
    if (p.estado === 'PENDIENTE') return PARTICIPANT_STATUS.PENDING;
    if (p.estado !== 'CONFIRMADO') return PARTICIPANT_STATUS.INACTIVE;
    return p.rol === 'SUPLENTE' ? PARTICIPANT_STATUS.SUBSTITUTE : PARTICIPANT_STATUS.CONFIRMED;
};

const mapParticipant = (p) => ({
    ...p,
    participationId: p.id,
    id: p.usuario?.id,
    userId: p.usuario?.id,
    role: p.rol,
    isOrganizer: p.rol === 'ORGANIZADOR' && p.estado === 'CONFIRMADO',
    status: mapParticipantStatus(p),
    username: p.usuario?.nombreUsuario,
    firstName: p.usuario?.nombre,
    lastName: p.usuario?.apellido,
    profilePictureUrl: p.usuario?.fotoPerfilUrl,
    mainPosition: p.usuario?.posicionPrincipal,
    reputation: p.usuario?.reputacion,
});

export const mapRoomFromApi = (rawRoom) => {
    if (!rawRoom) return null;

    const local = getLocalPart(rawRoom.fechaHoraPartido);
    const participants = (rawRoom.participantes || []).map(mapParticipant);
    const organizer = participants.find((p) => p.isOrganizer);

    return {
        id: rawRoom.id,
        title: rawRoom.nombre || '',
        description: rawRoom.descripcion || '',
        date: local.date,
        time: local.time,
        location: rawRoom.direccion || rawRoom.nombreCancha || '',
        maxPlayers: rawRoom.cuposTotales || 0,
        creatorId: rawRoom.creador?.id ?? rawRoom.creadorId,
        organizerId: organizer?.userId ?? null,
        status: rawRoom.estado || ROOM_STATUS.ABIERTA,
        isPublic: Boolean(rawRoom.esPublica),
        privacy: rawRoom.esPublica ? 'Pública' : 'Privada',
        allowsSubstitutes: Boolean(rawRoom.permiteSuplentes),
        maxSubstitutes: rawRoom.cuposSuplentesMax ?? 0,
        participants,
        raw: rawRoom,
    };
};
