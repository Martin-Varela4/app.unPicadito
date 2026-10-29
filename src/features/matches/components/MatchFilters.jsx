import Switch from '../../../components/ui/Switch';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import SectionCard from '../../../components/ui/SectionCard';
import { PRIVACY_FILTER_OPTIONS, SUBSTITUTES_FILTER_OPTIONS } from '../constants/matchConstants';
import { DEFAULT_LOCATION } from '../constants/defaultLocation';
import { TIPO_UBICACION_FILTRO } from '../constants/locationConstants';
import { LocationFilterBar } from './LocationFilterBar';

export default function MatchFilters({
    filters,
    onFilterChange,
}) {
    const handleGpsClick = () => {
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    onFilterChange('lat', pos.coords.latitude);
                    onFilterChange('lng', pos.coords.longitude);
                    onFilterChange('localidadNombre', 'Mi ubicación (GPS)');
                    onFilterChange('tipoUbicacion', TIPO_UBICACION_FILTRO.MI_UBICACION);
                },
                () => {
                    onFilterChange('lat', DEFAULT_LOCATION.y);
                    onFilterChange('lng', DEFAULT_LOCATION.x);
                    onFilterChange('localidadNombre', 'Posadas (Centro)');
                    onFilterChange('tipoUbicacion', TIPO_UBICACION_FILTRO.MI_UBICACION);
                }
            );
        } else {
            onFilterChange('lat', DEFAULT_LOCATION.y);
            onFilterChange('lng', DEFAULT_LOCATION.x);
            onFilterChange('localidadNombre', 'Posadas (Centro)');
            onFilterChange('tipoUbicacion', TIPO_UBICACION_FILTRO.MI_UBICACION);
        }
    };

    const handleLocalidadClick = (loc) => {
        onFilterChange('lat', loc.lat);
        onFilterChange('lng', loc.lng);
        onFilterChange('localidadNombre', `${loc.nombre} (${loc.provincia})`);
        onFilterChange('tipoUbicacion', TIPO_UBICACION_FILTRO.OTRAS_OPCIONES);
    };

    return (
        <SectionCard hasDivider={false} className="p-4 sm:p-5">
            <div className="mb-4">
                <LocationFilterBar
                    tipoUbicacion={filters.tipoUbicacion}
                    nombreUbicacion={filters.localidadNombre}
                    onGpsClick={handleGpsClick}
                    onLocalidadClick={handleLocalidadClick}
                    label="Ubicación de búsqueda:"
                />
            </div>

            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                    label="Lugar / Cancha"
                    name="nombreCancha"
                    placeholder="Ej. La Cantera"
                    value={filters.nombreCancha}
                    onChange={(e) => onFilterChange('nombreCancha', e.target.value)}
                />

                <Select
                    label="Privacidad"
                    name="esPublica"
                    value={filters.esPublica}
                    onChange={(e) => onFilterChange('esPublica', e.target.value)}
                    options={PRIVACY_FILTER_OPTIONS}
                />

                <Select
                    label="Suplentes"
                    name="permiteSuplentes"
                    value={filters.permiteSuplentes}
                    onChange={(e) => onFilterChange('permiteSuplentes', e.target.value)}
                    options={SUBSTITUTES_FILTER_OPTIONS}
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
        </SectionCard>
    );
}
