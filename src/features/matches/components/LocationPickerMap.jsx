import { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { parseCoords } from '../utils/locationUtils';
import { useLeafletMap } from '../hooks/useLeafletMap';

export const LocationPickerMap = ({
    value,
    onChange,
    readOnly = false,
    height = '280px',
    label = '',
    direccion = '',
}) => {
    const { lat, lng } = parseCoords(value);
    const mapContainerRef = useRef(null);

    useLeafletMap({
        containerRef: mapContainerRef,
        lat,
        lng,
        label,
        direccion,
        readOnly,
        onChange,
    });

    return (
        <div className="space-y-2">
            <div className="text-xs text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                    <MapPin size={14} className="text-[var(--color-brand-primary)]" />
                    {!readOnly ? 'Hacé clic o arrastrá el pin hasta la cancha' : 'Ubicación de la cancha en el mapa'}
                </span>
            </div>

            <div
                ref={mapContainerRef}
                style={{ height }}
                className="w-full rounded-xl border border-slate-600 overflow-hidden shadow-inner z-0"
            />

            <p className="text-[11px] text-slate-400">
                {label ? `${label} · ` : ''}Lat {lat.toFixed(4)}, Lng {lng.toFixed(4)}
            </p>
        </div>
    );
};
