import * as yup from 'yup';

// Obtenemos la fecha actual y le sumamos 1 hora para evitar crear partidos en el pasado inmediato
const minDate = new Date();
minDate.setHours(minDate.getHours() + 1);

export const createRoomSchema = yup.object().shape({
    locationId: yup.string()
        .required('Debes seleccionar un predio o cancha.'),
    date: yup.date()
        .required('La fecha es obligatoria.')
        .min(new Date(), 'La fecha no puede ser en el pasado.'),
    time: yup.string()
        .required('El horario es obligatorio.')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM).'),
    maxPlayers: yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('El límite de jugadores es obligatorio.')
        .min(10, 'El mínimo para un partido es de 10 jugadores (Fútbol 5).')
        .max(22, 'El máximo permitido es de 22 jugadores (Fútbol 11).'),
    privacy: yup.string()
        .oneOf(['PUBLIC', 'PRIVATE'], 'Privacidad no válida.')
        .required('Selecciona el nivel de privacidad.'),
    entryRequirement: yup.string()
        .nullable() // Parámetro opcional dependiendo de la lógica de negocio
});