import Select from '../../../../components/Select';

const mockLocations = [
    { value: '1', label: 'La Cantera - Cancha 1 (Fútbol 5)' },
    { value: '2', label: 'El Templo - Cancha Principal (Fútbol 11)' },
    { value: '3', label: 'Predio Los Álamos (Fútbol 7)' }
];

export const LocationSection = ({ values, errors, onChange }) => {

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">1. Ubicación del Partido</h2>
            <Select
                label="Predio o Cancha"
                options={mockLocations}
                name="locationId"
                value={values.locationId}
                onChange={(event) => onChange('locationId', event.target.value)}
                error={errors.locationId}
            />
        </div>
    );
};