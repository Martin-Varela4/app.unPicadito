import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../../../../components/Input';

export const CapacitySection = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">3. Capacidad</h2>
            <Input
                type="number"
                label="Límite de Jugadores"
                placeholder="Ej: 10"
                error={errors.maxPlayers?.message}
                {...register('maxPlayers')}
            />
            <p className="text-xs text-gray-500">Mínimo 10 (Fútbol 5) - Máximo 22 (Fútbol 11)</p>
        </div>
    );
};