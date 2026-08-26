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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-4">
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
            </div>

            <Switch
                label="Solo con lugares disponibles"
                checked={filters.onlyAvailable}
                onChange={(e) => onFilterChange('onlyAvailable', e.target.checked)}
            />
        </div>
    );
}
