import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoomSchema } from '../schemas/roomSchema';
import { createMatch } from '../services/matchService';
import { createIsoFromLocal } from '../utils/dateUtils';
import { INITIAL_ROOM_FORM_VALUES } from '../constants/matchConstants';
import { validateWithSchema } from '../../../utils/validation';

export const useCreateRoom = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(INITIAL_ROOM_FORM_VALUES);
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

        const { isValid, data, errors } = await validateWithSchema(createRoomSchema, formData);
        if (!isValid) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});

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
            });

            const createdId = created?.id || created?.data?.id;
            if (createdId) {
                navigate(`/salas/${createdId}`);
            } else {
                navigate('/');
            }
        } catch (error) {
            setErrorMessage(error.message || 'No se pudo crear la sala. Intente nuevamente.');
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
        cancel: () => navigate('/'),
    };
};
