import * as yup from 'yup';

export const baseProfileSchema = yup.object().shape({
  nombreUsuario: yup
    .string()
    .trim()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
    .required('El nombre de usuario es obligatorio.'),
  nombre: yup.string().trim().required('El nombre es obligatorio.'),
  apellido: yup.string().trim().required('El apellido es obligatorio.'),
  apodo: yup.string().trim().nullable(),
  fotoPerfilUrl: yup.string().trim().nullable(),
  posicionPrincipal: yup.string().required('La posición principal es obligatoria.'),
});

export const profileWithPasswordSchema = baseProfileSchema.shape({
  currentPassword: yup.string().required('Debes ingresar tu contraseña actual.'),
  password: yup
    .string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres.')
    .required('Debes ingresar la nueva contraseña.'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], 'La nueva contraseña y su confirmación no coinciden.')
    .required('Debes confirmar la nueva contraseña.'),
});

export const getProfileSchema = (changePassword) =>
  changePassword ? profileWithPasswordSchema : baseProfileSchema;
