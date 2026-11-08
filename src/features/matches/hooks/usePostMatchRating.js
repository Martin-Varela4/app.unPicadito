import { useCallback, useEffect, useRef, useState } from 'react';
import { crearResena, getPendientesCalificar } from '../services/matchService';

export const usePostMatchRating = (roomId) => {
    const [pendientes, setPendientes] = useState([]);
    const [loadedRoomId, setLoadedRoomId] = useState(null);
    const [loadError, setLoadError] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const submittingRef = useRef(false);
    const loading = Boolean(roomId) && loadedRoomId !== roomId;

    const resetForm = useCallback(() => {
        setSelectedId(null);
        setStars(0);
        setComment('');
        setSubmitError('');
    }, []);

    const loadPendientes = useCallback(async () => {
        if (!roomId) return;
        try {
            const data = await getPendientesCalificar(roomId);
            setPendientes(data.pendientes ?? []);
            setLoadError('');
        } catch (err) {
            setLoadError(err.message || 'No se pudo cargar la lista de jugadores.');
        } finally {
            setLoadedRoomId(roomId);
        }
    }, [roomId]);

    useEffect(() => {
        if (!roomId) return undefined;

        let active = true;
        getPendientesCalificar(roomId)
            .then((data) => {
                if (!active) return;
                setPendientes(data.pendientes ?? []);
                setLoadError('');
                resetForm();
                setSuccessMessage('');
            })
            .catch((err) => {
                if (!active) return;
                setLoadError(err.message || 'No se pudo cargar la lista de jugadores.');
            })
            .finally(() => {
                if (active) setLoadedRoomId(roomId);
            });

        return () => {
            active = false;
        };
    }, [roomId, resetForm]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                loadPendientes();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [loadPendientes]);

    const selectedPlayer =
        pendientes.find((p) => p.userId === selectedId && p.puedeCalificar) ?? null;

    const selectPlayer = useCallback((userId) => {
        setSelectedId(userId);
        setStars(0);
        setComment('');
        setSubmitError('');
        setSuccessMessage('');
    }, []);

    const submit = async () => {
        if (submittingRef.current || isSubmitting) return;
        if (!selectedPlayer || stars < 1) {
            setSubmitError('Elegí un jugador y una puntuación de 1 a 5 estrellas.');
            return;
        }

        submittingRef.current = true;
        setIsSubmitting(true);
        setSubmitError('');
        setSuccessMessage('');

        try {
            await crearResena({
                salaId: roomId,
                calificadoId: selectedPlayer.userId,
                estrellas: stars,
                comentario: comment.trim(),
            });
            setSuccessMessage(`¡Calificaste a ${selectedPlayer.nombre}!`);
            resetForm();
            await loadPendientes();
        } catch (err) {
            setSubmitError(err.message || 'No se pudo guardar la calificación.');
            await loadPendientes();
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    return {
        pendientes,
        loading,
        loadError,
        reload: loadPendientes,
        selectedPlayer,
        selectedId,
        selectPlayer,
        stars,
        setStars,
        comment,
        setComment,
        isSubmitting,
        submitError,
        successMessage,
        submit,
    };
};

