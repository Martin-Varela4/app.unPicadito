import Switch from '../../../components/Switch';
import Input from '../../../components/Input';
import Select from '../../../components/Select';

export default function MatchFilters({
    filters,
    onFilterChange,
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                
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
                <div className="md:col-span-2">
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