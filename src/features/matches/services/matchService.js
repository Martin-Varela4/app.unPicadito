import api from '../../../api/axiosInstance';
import { mapRoomFromApi } from './matchMapper';

const ENDPOINT_MATCHES = import.meta.env.VITE_MATCHES_ENDPOINT || '/salas';
const ENDPOINT_MATCHES_SEARCH = import.meta.env.VITE_MATCHES_SEARCH_ENDPOINT || '/salas/buscar';

export const getMatches = async (filters = {}) => {
    const params = {};
    if (filters.date) {
        const time = filters.time || '00:00';
        params.fechaInicio = `${filters.date}T${time}:00`;
    }
    if (filters.onlyAvailable) {
        params.estadoDisponibilidad = 'DISPONIBLES';
    }
    if (filters.search) params.nombre = filters.search;
    if (filters.nombreCancha) params.nombreCancha = filters.nombreCancha;
    
    // Solo se envían si el usuario eligió "Sí(true)" o "No(false)", si está vacío manda todas
    if (filters.esPublica !== '') params.esPublica = filters.esPublica;
    if (filters.permiteSuplentes !== '') params.permiteSuplentes = filters.permiteSuplentes;
    const response = await api.get(ENDPOINT_MATCHES_SEARCH, { params });
    return response.data?.data ?? [];
};

export const getMatchById = async (id) => {
    const response = await api.get(`${ENDPOINT_MATCHES}/${id}`);
    const rawData = response.data?.data || response.data;
    return mapRoomFromApi(rawData);
};

export const leaveMatch = async (matchId, reason) => {
    const response = await api.delete(`${ENDPOINT_MATCHES}/${matchId}/salir`, {
        data: { reason }
    });
    return response.data;
};

export const joinMatch = async (matchId) => {
    const response = await api.post(`${ENDPOINT_MATCHES}/${matchId}/unirse`);
    return response.data;
};

export const cancelarSala = async (roomId, motivoCancelacion) => {
    const response = await api.patch(`${ENDPOINT_MATCHES}/${roomId}/cancelar`, {
        motivoCancelacion
    });
    return response.data;
};

export const updateMatch = async (id, data) => {
    const response = await api.patch(`${ENDPOINT_MATCHES}/${id}`, data);
    const updatedData = response.data?.data || response.data;
    return mapRoomFromApi(updatedData);
};