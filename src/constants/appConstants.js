export const DEBOUNCE_DELAY_MS = 400;
export const DEFAULT_EMPTY_LASTNAME = 'Sin apellido';
export const AUTH_STORAGE_KEY = 'unpicadito_auth_session';

export const NAV_ITEMS = Object.freeze([
    { path: '/inicio', label: 'Inicio', iconName: 'Home', end: true },
    { path: '/partidos', label: 'Buscar Partidos', iconName: 'Search', end: false },
    { path: '/players', label: 'Jugadores', iconName: 'Users', end: false },
    { path: '/messages', label: 'Mensajes', iconName: 'MessageSquare', end: false },
]);