import api from '../../../api/axiosInstance';

const ENDPOINT_MATCHES = import.meta.env.VITE_MATCHES_ENDPOINT || '/matches';
const ENDPOINT_MODALITIES = import.meta.env.VITE_MODALITIES_ENDPOINT || '/modalities';
const ENDPOINT_ZONES = import.meta.env.VITE_ZONES_ENDPOINT || '/zones';
const ENDPOINT_LEVELS = import.meta.env.VITE_LEVELS_ENDPOINT || '/levels';

export const getMatches = async (filters = {}) => {
    const response = await api.get(ENDPOINT_MATCHES, { params: filters });
    return response.data;
};

export const getMatchById = async (id) => {
    const response = await api.get(`${ENDPOINT_MATCHES}/${id}`);
    return response.data;
};

export const getModalities = async () => {
    const response = await api.get(ENDPOINT_MODALITIES);
    return response.data;
};


export const getZones = async () => {
    const response = await api.get(ENDPOINT_ZONES);
    return response.data;
};


export const getLevels = async () => {
    const response = await api.get(ENDPOINT_LEVELS);
    return response.data;
};
