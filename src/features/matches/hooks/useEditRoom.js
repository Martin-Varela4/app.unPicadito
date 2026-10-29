import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { roomSchema } from '../schemas/roomSchema';
import { getMatchById, updateMatch } from '../services/matchService';
import { createIsoFromLocal, isWithin24Hours } from '../utils/dateUtils';
import { INITIAL_ROOM_FORM_VALUES } from '../constants/matchConstants';
import { validateWithSchema } from '../../../utils/validation';

const getFormValues = (room) => ({
    nombre: room.title,
    nombreCancha: room.raw?.nombreCancha || room.location,
    direccion: room.raw?.direccion || room.location,
    fecha: room.date,
    hora: room.time,
    cuposTotales: room.maxPlayers,
    permiteSuplentes: room.raw?.permiteSuplentes ?? true,
    esPublica: room.raw?.esPublica ?? true,
    descripcion: room.description,
});

const buildPatch = (data, room, timeLocked) => {
    const patch = {};
    const raw = room.raw || {};

    if (data.nombre !== room.title) patch.nombre = data.nombre.trim();
    if (data.descripcion !== room.description) patch.descripcion = data.descripcion?.trim() || '';
    if (Number(data.cuposTotales) !== room.maxPlayers) patch.cuposTotales = Number(data.cuposTotales);
    if (Boolean(data.permiteSuplentes) !== raw.permiteSuplentes) patch.permiteSuplentes = Boolean(data.permiteSuplentes);
    if (Boolean(data.esPublica) !== raw.esPublica) patch.esPublica = Boolean(data.esPublica);

    if (!timeLocked) {
        if (data.nombreCancha !== raw.nombreCancha) patch.nombreCancha = data.nombreCancha.trim();
        if (data.direccion !== raw.direccion) patch.direccion = data.direccion.trim();
        if (data.fecha !== room.date || data.hora !== room.time) {
            patch.fechaHoraPartido = createIsoFromLocal(data.fecha, data.hora);
        }
    }
    return patch;
};

export const useEditRoom = (roomId) => {
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [formData, setFormData] = useState(INITIAL_ROOM_FORM_VALUES);
    const [fieldErrors, setFieldErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    useEffect(() => {
        let active = true;
        getMatchById(roomId)
            .then((data) => {
                if (!active) return;
                setRoom(data);
                setFormData(getFormValues(data));
            })
            .catch(() => {
                if (active) setErrorMessage('No se pudieron cargar los datos de la sala.');
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => { active = false; };
    }, [roomId]);

    const isTimeLocked = isWithin24Hours(room?.raw?.fechaHoraPartido);
    const handleChange = (name, value) => {
        setFormData((current) => ({ ...current, [name]: value }));
        setFieldErrors((current) => ({ ...current, [name]: '' }));
        setErrorMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!room) return;
        setErrorMessage('');

        const { isValid, data, errors } = await validateWithSchema(roomSchema, formData);
        if (!isValid) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});

        const patch = buildPatch(data, room, isTimeLocked);
        if (!Object.keys(patch).length) {
            setErrorMessage('No has realizado ningún cambio.');
            return;
        }
        setPendingData(patch);
        setIsModalOpen(true);
    };

    const confirmSubmit = async () => {
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            await updateMatch(roomId, pendingData);
            navigate(`/salas/${roomId}`);
        } catch (error) {
            setErrorMessage(error.message || 'Error al guardar los cambios.');
        } finally {
            setIsModalOpen(false);
            setIsSubmitting(false);
        }
    };

    return {
        room, formData, fieldErrors, errorMessage, isLoading, isSubmitting,
        isModalOpen, isTimeLocked, handleChange, handleSubmit, confirmSubmit,
        closeModal: () => setIsModalOpen(false),
        cancel: () => navigate(`/salas/${roomId}`),
    };
};
