import ToggleGroup from '../../../components/ToggleGroup';
import Select from '../../../components/Select';
import Switch from '../../../components/Switch';
import Input from '../../../components/Input';

export default function MatchFilters({
    filters,
    onFilterChange,
    modalities,
    zones,
    levels,
    isLoadingOptions,
}) {
    const modalityOptions = [
        { value: '', label: 'Todos' },
        ...modalities,
    ];
    const zoneOptions = [
        { value: '', label: 'Todas las zonas' },
        ...zones,
    ];

    const levelOptions = [
        { value: '', label: 'Todos los niveles' },
        ...levels,
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
                <ToggleGroup
                    label="Modalidad"
                    options={modalityOptions}
                    value={filters.modality}
                    onChange={(value) => onFilterChange('modality', value)}
                    isLoading={isLoadingOptions}
                />

                <Select
                    label="Zona"
                    options={zoneOptions}
                    value={filters.zone}
                    onChange={(e) => onFilterChange('zone', e.target.value)}
                    disabled={isLoadingOptions}
                />

                <Select
                    label="Nivel"
                    options={levelOptions}
                    value={filters.level}
                    onChange={(e) => onFilterChange('level', e.target.value)}
                    disabled={isLoadingOptions}
                />

                <Input
                    label="Fecha"
                    name="date"
                    type="date"
                    value={filters.date}
                    onChange={(e) => onFilterChange('date', e.target.value)}
                />
                <Input
                    label="Hora"
                    name="time"
                    type="time"
                    value={filters.time}
                    onChange={(e) => onFilterChange('time', e.target.value)}
                />

                <Switch
                    label="Solo con lugares disponibles"
                    checked={filters.onlyAvailable}
                    onChange={(e) => onFilterChange('onlyAvailable', e.target.checked)}
                />
            </div>
        </div>
    );
}
