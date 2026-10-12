import Switch from '../../../components/ui/Switch';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function MatchFilters({
    filters,
    onFilterChange,
}) {
    return (
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
                
                <Input
                    label="Lugar / Cancha"
                    name="nombreCancha"
                    type="text"
                    placeholder="Ej. La Bombonerita"
                    value={filters.nombreCancha}
                    onChange={(e) => onFilterChange('nombreCancha', e.target.value)}
                />
                <Select
                    label="Privacidad"
                    name="esPublica"
                    value={filters.esPublica}
                    onChange={(e) => onFilterChange('esPublica', e.target.value)}
                    options={[
                        { value: '', label: 'Todas' },
                        { value: 'true', label: 'Solo Públicas' },
                        { value: 'false', label: 'Solo Privadas' }
                    ]}
                />
                <Select
                    label="Suplentes"
                    name="permiteSuplentes"
                    value={filters.permiteSuplentes}
                    onChange={(e) => onFilterChange('permiteSuplentes', e.target.value)}
                    options={[
                        { value: '', label: 'Todos' },
                        { value: 'true', label: 'Permite suplentes' },
                        { value: 'false', label: 'Sin suplentes' }
                    ]}
                />
                <Input
                    label="Fecha"
                    name="date"
                    type="date"
                    min={new Date().toLocaleDateString('en-CA')}
                    value={filters.date}
                    onChange={(e) => onFilterChange('date', e.target.value)}
                />
                <Input
                    label="Hora (A partir de)"
                    name="time"
                    type="time"
                    value={filters.time}
                    onChange={(e) => onFilterChange('time', e.target.value)}
                />
                <div className="sm:col-span-2 lg:col-span-2">
                    <Switch
                        label="Solo con lugares disponibles"
                        checked={filters.onlyAvailable}
                        onChange={(e) => onFilterChange('onlyAvailable', e.target.checked)}
                    />
                </div>
            </div>
        </div>
    );
}