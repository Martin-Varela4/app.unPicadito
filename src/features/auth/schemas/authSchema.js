// src/features/auth/schemas/authSchema.js
import * as yup from 'yup';

// Expresión regular: al menos una letra y un número
const passwordSecurityRegex = /^(?=.*[A-Za-z])(?=.*\d)/;

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .email('Ingresa un correo electrónico válido')
        .required('El correo electrónico es obligatorio'),
    password: yup
        .string()
        .required('La contraseña es obligatoria')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = yup.object().shape({
    username: yup
        .string()
        .trim()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(20, 'El nombre de usuario no puede superar los 20 caracteres')
        .required('El nombre de usuario es obligatorio'),
    email: yup
        .string()
        .trim()
        .email('Ingresa un correo electrónico válido')
        .required('El correo electrónico es obligatorio'),
    password: yup
        .string()
        .required('La contraseña es obligatoria')
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .matches(
            passwordSecurityRegex,
            'La contraseña debe contener al menos una letra y un número'
        ),
    confirmPassword: yup
        .string()
        .required('Debes confirmar tu contraseña')
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});