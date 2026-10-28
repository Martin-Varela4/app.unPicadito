import { DEFAULT_LOCATION } from './defaultLocation';

export const ROOM_STATUS = Object.freeze({
    ABIERTA: 'ABIERTA',
    COMPLETA: 'COMPLETA',
    CANCELADA: 'CANCELADA',
    FINALIZADA: 'FINALIZADA',
});

export const CLOSED_ROOM_STATUSES = Object.freeze([
    ROOM_STATUS.CANCELADA,
    ROOM_STATUS.FINALIZADA,
]);

export const PARTICIPANT_STATUS = Object.freeze({
    CONFIRMED: 'CONFIRMED',
    SUBSTITUTE: 'SUBSTITUTE',
    PENDING: 'PENDING',
    INACTIVE: 'INACTIVE',
});

export const ACTIVE_PARTICIPANT_STATUSES = Object.freeze([
    PARTICIPANT_STATUS.CONFIRMED,
    PARTICIPANT_STATUS.SUBSTITUTE,
    PARTICIPANT_STATUS.PENDING,
]);

export const ORGANIZER_ACTION_TYPES = Object.freeze({
    EXPEL: 'EXPEL',
    TRANSFER: 'TRANSFER',
});

export const CANCEL_REASON_MIN_LENGTH = 10;
export const CANCEL_REASON_MAX_LENGTH = 500;
export const LOCK_WINDOW_HOURS = 24;

export const INITIAL_ROOM_FORM_VALUES = Object.freeze({
    nombre: '',
    nombreCancha: '',
    direccion: '',
    fecha: '',
    hora: '',
    cuposTotales: 10,
    permiteSuplentes: true,
    esPublica: true,
    descripcion: '',
    ubicacion: DEFAULT_LOCATION,
});

export const INITIAL_MATCH_FILTERS = Object.freeze({
    search: '',
    date: '',
    time: '',
    onlyAvailable: false,
    nombreCancha: '',
    esPublica: '',
    permiteSuplentes: '',
});

export const PRIVACY_FILTER_OPTIONS = Object.freeze([
    { value: '', label: 'Todas' },
    { value: 'true', label: 'Solo Públicas' },
    { value: 'false', label: 'Solo Privadas' },
]);

export const SUBSTITUTES_FILTER_OPTIONS = Object.freeze([
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Permite suplentes' },
    { value: 'false', label: 'Sin suplentes' },
]);

export const ROOM_STATUS_CONFIG = Object.freeze({
    [ROOM_STATUS.CANCELADA]: { label: 'Cancelada', className: 'bg-red-900/40 text-red-200' },
    [ROOM_STATUS.FINALIZADA]: { label: 'Finalizada', className: 'bg-slate-700 text-slate-200' },
    [ROOM_STATUS.COMPLETA]: { label: 'Completa', className: 'bg-amber-900/40 text-amber-200' },
    [ROOM_STATUS.ABIERTA]: { label: 'Disponible', className: 'bg-green-900/40 text-green-200' },
});

export const MEMBERSHIP_STATUS_CONFIG = Object.freeze({
    ORGANIZER: { label: 'Organizás este partido', className: 'bg-[var(--color-brand-primary)] text-[#21263A]' },
    [PARTICIPANT_STATUS.CONFIRMED]: { label: 'Sos titular', className: 'bg-blue-900/40 text-blue-200' },
    [PARTICIPANT_STATUS.SUBSTITUTE]: { label: 'Sos suplente', className: 'bg-amber-900/40 text-amber-200' },
    [PARTICIPANT_STATUS.PENDING]: { label: 'Solicitud pendiente', className: 'bg-slate-800 text-slate-200' },
});
