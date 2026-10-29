import api from '../../../api/axiosInstance';

export const buscarPrediosCercanos = async (filtros = {}) => {
    const params = {};
    if (filtros.lat !== undefined) params.lat = filtros.lat;
    if (filtros.lng !== undefined) params.lng = filtros.lng;
    if (filtros.radioKm !== undefined) params.radioKm = filtros.radioKm;
    if (filtros.busqueda) params.busqueda = filtros.busqueda;

    const response = await api.get('/predios/cercanos', { params });
    return response.data?.data ?? [];
};

export const obtenerCanchasPorPredio = async (predioId) => {
    const response = await api.get(`/predios/${predioId}/canchas`);
    return response.data?.data ?? [];
};
