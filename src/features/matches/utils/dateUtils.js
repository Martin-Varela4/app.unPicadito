export const getLocalPart = (isoString) => {
    if (!isoString) return { date: '', time: '' };
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        // Fallback en caso de que venga un string sin Z ni timezone
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

export const isWithin24Hours = (isoString) => {
    if (!isoString) return false;
    const matchDate = new Date(isoString);
    const now = new Date();
    const diffHours = (matchDate - now) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
};
