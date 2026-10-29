export const INITIAL_AUTH_STATE = Object.freeze({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
});

export const INITIAL_AUTH_FORM_VALUES = Object.freeze({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
});

export const AUTH_MODES = Object.freeze({
    LOGIN: 'login',
    REGISTER: 'register',
});