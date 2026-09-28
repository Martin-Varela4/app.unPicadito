import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../../../../components/Input';

export const DateTimeSection = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">2. Día y Horario</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    type="date"
                    label="Fecha del Partido"
                    error={errors.date?.message}
                    {...register('date')}
                />
                <Input
                    type="time"
                    label="Horario"
                    error={errors.time?.message}
                    {...register('time')}
                />
            </div>
        </div>
    );
};