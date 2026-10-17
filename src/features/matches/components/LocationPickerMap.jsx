import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { DEFAULT_LOCATION } from '../constants/defaultLocation';

const customPinIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<div class="text-[32px] leading-none drop-shadow-md">📍</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

export const LocationPickerMap = ({ value, onChange, readOnly = false, height = '280px' }) => {
    const lat = value?.y ?? DEFAULT_LOCATION.y;
    const lng = value?.x ?? DEFAULT_LOCATION.x;
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const onChangeRef = useRef(onChange);
    const readOnlyRef = useRef(readOnly);
    const initialLocationRef = useRef({ lat, lng });

    useEffect(() => {
        onChangeRef.current = onChange;
        readOnlyRef.current = readOnly;
    }, [onChange, readOnly]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const initialLocation = initialLocationRef.current;
        const map = L.map(mapContainerRef.current).setView([initialLocation.lat, initialLocation.lng], 14);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([initialLocation.lat, initialLocation.lng], {
            icon: customPinIcon,
            draggable: !readOnlyRef.current,
        }).addTo(map);
        markerRef.current = marker;

        marker.on('dragend', () => {
            if (!readOnlyRef.current) {
                const { lat: newLat, lng: newLng } = marker.getLatLng();
                onChangeRef.current?.({ x: Number(newLng.toFixed(6)), y: Number(newLat.toFixed(6)) });
            }
        });

        map.on('click', (e) => {
            if (!readOnlyRef.current) {
                const { lat: newLat, lng: newLng } = e.latlng;
                marker.setLatLng([newLat, newLng]);
                onChangeRef.current?.({ x: Number(newLng.toFixed(6)), y: Number(newLat.toFixed(6)) });
            }
        });

        return () => {
            map.remove();
        };
    }, []);

    useEffect(() => {
        if (!markerRef.current || !mapInstanceRef.current) return;
        if (readOnly) markerRef.current.dragging?.disable();
        else markerRef.current.dragging?.enable();
        const currentPos = markerRef.current.getLatLng();
        if (currentPos.lat !== lat || currentPos.lng !== lng) {
            markerRef.current.setLatLng([lat, lng]);
            mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
        }
    }, [lat, lng, readOnly]);

    return (
        <div className="space-y-2">
            <div className="text-xs text-slate-400">
                <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-[var(--color-brand-primary)]" />
                    {!readOnly ? 'Hacé clic o arrastrá el pin hasta la cancha' : 'Ubicación de la cancha'}
                </span>
            </div>

            <div
                ref={mapContainerRef}
                style={{ height }}
                className="w-full rounded-xl border border-slate-600 overflow-hidden shadow-inner z-0"
            />
            
            <p className="text-[11px] text-slate-400">
                Coordenadas: Lat {lat.toFixed(4)}, Lng {lng.toFixed(4)}
            </p>
        </div>
    );
};