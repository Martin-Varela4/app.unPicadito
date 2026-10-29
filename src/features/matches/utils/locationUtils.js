import { DEFAULT_LOCATION } from '../constants/defaultLocation';

export const parseCoords = (val) => {
    if (!val) return { lat: DEFAULT_LOCATION.y, lng: DEFAULT_LOCATION.x };

    if (typeof val.lat === 'number' && typeof val.lng === 'number' && !isNaN(val.lat)) {
        return { lat: val.lat, lng: val.lng };
    }

    if (typeof val.x === 'number' && typeof val.y === 'number' && !isNaN(val.x)) {
        return { lat: val.y, lng: val.x };
    }

    if (typeof val === 'string' && val.includes('POINT')) {
        const match = val.match(/POINT\(([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\)/i);
        if (match) {
            return { lat: Number(match[2]), lng: Number(match[1]) };
        }
    }

    if (val.predio?.ubicacion) {
        return parseCoords(val.predio.ubicacion);
    }

    return { lat: DEFAULT_LOCATION.y, lng: DEFAULT_LOCATION.x };
};
