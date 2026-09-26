import * as yup from "yup";

export const roomEditSchema = yup.object().shape({
    title: yup.string().required("El nombre de la sala es obligatorio").max(50, "Máximo 50 caracteres"),
    location: yup.string().required("La ubicación es obligatoria"),
    date: yup.date().required("La fecha es obligatoria").typeError("Fecha inválida"),
    time: yup.string().required("La hora es obligatoria"),
    maxPlayers: yup.number().required("Define el límite de jugadores").min(10, "Mínimo 10 jugadores (Fútbol 5)"),
    description: yup.string().max(200, "Máximo 200 caracteres"),
});