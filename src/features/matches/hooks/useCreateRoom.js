import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoomSchema } from '../schemas/roomSchema';
import { createMatch } from '../services/matchService';
import { createIsoFromLocal } from '../utils/dateUtils';
import { DEFAULT_LOCATION } from '../constants/defaultLocation';

const initialValues = {
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
};

export const useCreateRoom = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialValues);
    const [fieldErrors, setFieldErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (name, value) => {
        setFormData((current) => ({ ...current, [name]: value }));
        setFieldErrors((current) => ({ ...current, [name]: '' }));
        setErrorMessage('');

        if (name === 'nombreCancha' && !value) {
            setFormData((current) => ({ ...current, direccion: '' }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        let data;
        try {
            data = await createRoomSchema.validate(formData, { abortEarly: false });
            setFieldErrors({});
        } catch (error) {
            if (error.name !== 'ValidationError') throw error;
            setFieldErrors(Object.fromEntries(error.inner.map(({ path, message }) => [path, message])));
            return;
        }

        setIsSubmitting(true);
        try {
            const created = await createMatch({
                nombre: data.nombre.trim(),
                descripcion: data.descripcion?.trim() || undefined,
                nombreCancha: data.nombreCancha?.trim() || undefined,
                direccion: data.direccion?.trim() || undefined,
                fechaHoraPartido: createIsoFromLocal(data.fecha, data.hora),
                cuposTotales: Number(data.cuposTotales),
                permiteSuplentes: Boolean(data.permiteSuplentes),
                esPublica: Boolean(data.esPublica),
                ubicacion: formData.ubicacion,
                duracionMinutos: 60,
            });
            navigate(`/salas/${created.id}`, { replace: true });
        } catch (error) {
            const backendMessage = error.response?.data?.message || error.message;
            setErrorMessage(backendMessage || 'No se pudo crear la sala.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        fieldErrors,
        errorMessage,
        isSubmitting,
        handleChange,
        handleSubmit,
        cancel: () => navigate(-1),
    };
};