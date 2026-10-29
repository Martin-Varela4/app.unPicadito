import { LOCK_WINDOW_HOURS } from '../constants/matchConstants';

export const getLocalPart = (isoString) => {
    if (!isoString) return { date: '', time: '' };
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        const parts = isoString.split('T');
        return {
            date: parts[0] || '',
            time: parts[1]?.slice(0, 5) || ''
        };
    }
    const pad = (n) => String(n).padStart(2, '0');
    return {
        date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
        time: `${pad(date.getHours())}:${pad(date.getMinutes())}`
    };
};

export const createIsoFromLocal = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const date = new Date(`${dateStr}T${timeStr}:00`);
    return date.toISOString();
};

export const isPastMatch = (isoString) => {
    if (!isoString) return false;
    const matchDate = new Date(isoString);
    return !isNaN(matchDate.getTime()) && matchDate.getTime() <= Date.now();
};

export const isWithin24Hours = (isoString) => {
    if (!isoString) return false;
    const matchDate = new Date(isoString);
    if (isNaN(matchDate.getTime())) return false;
    const diffHours = (matchDate.getTime() - Date.now()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= (LOCK_WINDOW_HOURS || 24);
};

export const formatMatchDate = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-AR');
};

export const formatMatchTime = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return isNaN(date.getTime())
        ? '—'
        : date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
};

export const formatMatchDateTime = (isoString) => {
    if (!isoString) return '—';
    return `${formatMatchDate(isoString)} - ${formatMatchTime(isoString)} hs`;
};

export const MINUTES_TO_FINALIZE = 30;

export const getFinalizeAvailableAt = (isoString) => {
    if (!isoString) return null;
    const matchDate = new Date(isoString);
    if (isNaN(matchDate.getTime())) return null;
    return new Date(matchDate.getTime() + MINUTES_TO_FINALIZE * 60 * 1000);
};