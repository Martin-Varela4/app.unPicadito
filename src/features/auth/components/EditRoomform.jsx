import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { roomEditSchema } from '../schemas/roomEdit.schema';
import { ConfirmModal } from '../../../components/ConfirmModal';
import api from '../../../api/axios';

export const EditRoomForm = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [initialData, setInitialData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(roomEditSchema)
    });

    // 1. Cargar datos actuales de la sala
    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                // Simulación o llamada real a tu API
                const response = await api.get(`/rooms/${roomId}`);
                const data = response.data;
                setInitialData(data);
                reset(data); // Rellena el formulario con los datos actuales
            } catch (error) {
                setSubmitStatus({ type: 'error', message: 'No se pudieron cargar los datos de la sala.' });
            }
        };
        fetchRoomData();
    }, [roomId, reset]);

    // 2. Lógica de restricción de tiempo (24 horas)
    const isTimeLocked = useMemo(() => {
        if (!initialData?.date || !initialData?.time) return false;

        const matchDateTime = new Date(`${initialData.date}T${initialData.time}`);
        const now = new Date();
        const diffInHours = (matchDateTime - now) / (1000 * 60 * 60);

        return diffInHours <= 24;
    }, [initialData]);

    // 3. Manejador previo que abre el modal
    const onSubmitRequest = (data) => {
        setPendingData(data);
        setIsModalOpen(true);
    };

    // 4. Confirmación y envío final
    const handleConfirmSubmit = async () => {
        setIsLoading(true);
        setSubmitStatus({ type: '', message: '' });

        try {
            await api.put(`/rooms/${roomId}`, pendingData);
            setSubmitStatus({ type: 'success', message: 'Cambios guardados correctamente.' });
            setIsModalOpen(false);

            // Volver a la vista de la sala tras éxito
            setTimeout(() => navigate(`/rooms/${roomId}`), 2000);
        } catch (error) {
            setSubmitStatus({ type: 'error', message: 'Error al guardar los cambios. Intenta nuevamente.' });
            setIsModalOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (!initialData) return <div className="p-4 text-center">Cargando datos de la sala...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Sala: {initialData.title}</h2>

            {/* Mostrar restricciones de tiempo */}
            {isTimeLocked && (
                <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700">
                    <strong>Restricción activa:</strong> Faltan menos de 24 horas para el partido. Algunos campos críticos (Fecha, Hora, Ubicación) ya no pueden modificarse.
                </div>
            )}

            {/* Alertas de Éxito / Error */}
            {submitStatus.message && (
                <div className={`mb-6 p-4 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {submitStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmitRequest)} className="space-y-4">

                {/* Título - Siempre editable */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la Sala *</label>
                    <input
                        type="text"
                        {...register("title")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Fecha y Hora - Bloqueados si < 24h */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha *</label>
                        <input
                            type="date"
                            {...register("date")}
                            disabled={isTimeLocked}
                            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${isTimeLocked ? 'bg-gray-100 text-gray-500 border-gray-200' : 'border-gray-300'}`}
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hora *</label>
                        <input
                            type="time"
                            {...register("time")}
                            disabled={isTimeLocked}
                            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${isTimeLocked ? 'bg-gray-100 text-gray-500 border-gray-200' : 'border-gray-300'}`}
                        />
                        {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                    </div>
                </div>

                {/* Ubicación - Bloqueado si < 24h */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ubicación *</label>
                    <input
                        type="text"
                        {...register("location")}
                        disabled={isTimeLocked}
                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${isTimeLocked ? 'bg-gray-100 text-gray-500 border-gray-200' : 'border-gray-300'}`}
                    />
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                </div>

                {/* Max Jugadores - Siempre editable */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Límite de Jugadores *</label>
                    <input
                        type="number"
                        {...register("maxPlayers")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                    {errors.maxPlayers && <p className="text-red-500 text-xs mt-1">{errors.maxPlayers.message}</p>}
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate(`/rooms/${roomId}`)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                isLoading={isLoading}
                title="Confirmar edición"
                message="¿Estás seguro de que deseas aplicar estos cambios a la sala? Todos los jugadores notificados verán la actualización."
            />
        </div>
    );
};