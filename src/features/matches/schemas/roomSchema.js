import * as yup from 'yup';

export const roomSchema = yup.object().shape({
    nombre: yup
        .string()
        .required('El nombre del partido es obligatorio')
        .min(3, 'Mínimo 3 caracteres')
        .max(50, 'Máximo 50 caracteres'),
    nombreCancha: yup
        .string()
        .min(3, 'Mínimo 3 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .optional()
        .nullable(),
    direccion: yup
        .string()
        .min(5, 'Mínimo 5 caracteres')
        .max(100, 'Máximo 100 caracteres')
        .optional()
        .nullable(),
    fecha: yup
        .string()
        .required('La fecha es obligatoria'),
    hora: yup
        .string()
        .matches(/^([01]\d|2[0-3]):00$/, 'La hora debe ser en punto (ej: 14:00, 15:00)')
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
        .optional()
        .nullable(),
});

export const createRoomSchema = roomSchema.test('fecha-futura', 'La fecha y hora del partido deben ser futuras', 
    function ({ fecha, hora }) {
        if (!fecha || !hora) return true; // los required ya informan si falta alguno
        const isFuture = new Date(`${fecha}T${hora}:00`) > new Date();
        return isFuture || this.createError({ path: 'fecha', message: 'La fecha y hora del partido deben ser futuras' });
    }
);