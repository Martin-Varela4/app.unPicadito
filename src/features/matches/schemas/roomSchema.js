import * as yup from 'yup';

export const roomSchema = yup.object().shape({
    nombre: yup
        .string()
        .required('El nombre del partido es obligatorio')
        .min(3, 'Mínimo 3 caracteres')
        .max(50, 'Máximo 50 caracteres'),
    nombreCancha: yup
        .string()
        .required('El nombre del complejo/cancha es obligatorio')
        .min(3, 'Mínimo 3 caracteres')
        .max(50, 'Máximo 50 caracteres'),
    direccion: yup
        .string()
        .required('La dirección es obligatoria')
        .min(5, 'Mínimo 5 caracteres')
        .max(100, 'Máximo 100 caracteres'),
    fecha: yup
        .string()
        .required('La fecha es obligatoria'),
    hora: yup
        .string()
        .required('La hora es obligatoria'),
    cuposTotales: yup
        .number()
        .typeError('Debe ser un número entero')
        .required('Define el límite de jugadores')
        .min(2, 'Mínimo 2 jugadores'),
    permiteSuplentes: yup.boolean().default(true),
    esPublica: yup.boolean().default(true),
    descripcion: yup
        .string()
        .max(200, 'Máximo 200 caracteres')
        .optional(),
});
