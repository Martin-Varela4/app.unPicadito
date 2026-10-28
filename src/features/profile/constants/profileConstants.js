export const PLAYER_POSITIONS = Object.freeze([
    { value: 'ARQUERO', label: 'Arquero' },
    { value: 'DEFENSOR', label: 'Defensor' },
    { value: 'MEDIOCAMPISTA', label: 'Mediocampista' },
    { value: 'DELANTERO', label: 'Delantero' },
    { value: 'TODOTERRENO', label: 'Todoterreno' },
    { value: 'POLIFUNCIONAL', label: 'Polifuncional' },
]);

export const DEFAULT_PLAYER_POSITION = 'POLIFUNCIONAL';

export const DEFAULT_PROFILE_COVER_URL =
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80';

export const INITIAL_PROFILE_PASSWORD_VALUES = Object.freeze({
    currentPassword: '',
    password: '',
    passwordConfirm: '',
});

export const INITIAL_PROFILE_FORM_VALUES = Object.freeze({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    apodo: '',
    fotoPerfilUrl: '',
    posicionPrincipal: DEFAULT_PLAYER_POSITION,
    ...INITIAL_PROFILE_PASSWORD_VALUES,
});