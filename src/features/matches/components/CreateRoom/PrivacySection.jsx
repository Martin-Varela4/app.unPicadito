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

export const PrivacySection = ({ values, errors, onChange }) => {

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">4. Privacidad y Reglas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                    label="Visibilidad de la Sala"
                    options={privacyOptions}
                    name="privacy"
                    value={values.privacy}
                    onChange={(event) => onChange('privacy', event.target.value)}
                    error={errors.privacy}
                />
                <Select
                    label="Parámetro de Ingreso"
                    options={entryRequirementOptions}
                    name="entryRequirement"
                    value={values.entryRequirement}
                    onChange={(event) => onChange('entryRequirement', event.target.value)}
                    error={errors.entryRequirement}
                />
            </div>
        </div>
    );
};