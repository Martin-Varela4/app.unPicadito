import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from '../../../../components/Select';

const privacyOptions = [
    { value: 'PUBLIC', label: 'Pública (Cualquiera puede unirse)' },
    { value: 'PRIVATE', label: 'Privada (Solo con enlace o invitación)' }
];

const entryRequirementOptions = [
    { value: 'NONE', label: 'Sin restricciones' },
    { value: 'ADVANCED', label: 'Solo nivel avanzado' },
    { value: 'AMATEUR', label: 'Solo nivel amateur / mixto' }
];

export const PrivacySection = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">4. Privacidad y Reglas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                    label="Visibilidad de la Sala"
                    options={privacyOptions}
                    error={errors.privacy?.message}
                    {...register('privacy')}
                />
                <Select
                    label="Parámetro de Ingreso"
                    options={entryRequirementOptions}
                    error={errors.entryRequirement?.message}
                    {...register('entryRequirement')}
                />
            </div>
        </div>
    );
};