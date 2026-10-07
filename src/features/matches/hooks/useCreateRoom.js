import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoomSchema } from '../schemas/roomSchema';
import { createMatch } from '../services/matchService';
import { createIsoFromLocal } from '../utils/dateUtils';

const DEFAULT_LOCATION = {
    x: Number(import.meta.env.VITE_DEFAULT_LNG ?? -58.3816),
    y: Number(import.meta.env.VITE_DEFAULT_LAT ?? -34.6037),
};

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
                nombreCancha: data.nombreCancha.trim(),
                direccion: data.direccion.trim(),
                fechaHoraPartido: createIsoFromLocal(data.fecha, data.hora),
                cuposTotales: Number(data.cuposTotales),
                permiteSuplentes: Boolean(data.permiteSuplentes),
                esPublica: Boolean(data.esPublica),
                ubicacion: formData.ubicacion, 
            });
            navigate(`/salas/${created.id}`, { replace: true });
        } catch (error) {
            setErrorMessage(error.message || 'No se pudo crear la sala.');
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