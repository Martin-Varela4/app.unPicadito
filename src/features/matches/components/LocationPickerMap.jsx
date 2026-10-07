import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

const customPinIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="font-size: 32px; line-height: 1; transform: translate(-50%, -100%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📍</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

export const LocationPickerMap = ({ value, onChange, readOnly = false, height = '280px' }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const lat = value?.y ?? -34.6037;
    const lng = value?.x ?? -58.3816;

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current).setView([lat, lng], 14);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([lat, lng], {
            icon: customPinIcon,
            draggable: !readOnly,
        }).addTo(map);
        markerRef.current = marker;

        if (!readOnly) {
            marker.on('dragend', () => {
                const { lat: newLat, lng: newLng } = marker.getLatLng();
                onChange?.({ x: Number(newLng.toFixed(6)), y: Number(newLat.toFixed(6)) });
            });

            map.on('click', (e) => {
                const { lat: newLat, lng: newLng } = e.latlng;
                marker.setLatLng([newLat, newLng]);
                onChange?.({ x: Number(newLng.toFixed(6)), y: Number(newLat.toFixed(6)) });
            });
        }

        return () => {
            map.remove();
        };
    }, []);

    useEffect(() => {
        if (!markerRef.current || !mapInstanceRef.current) return;
        const currentPos = markerRef.current.getLatLng();
        if (currentPos.lat !== lat || currentPos.lng !== lng) {
            markerRef.current.setLatLng([lat, lng]);
            mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
        }
    }, [lat, lng]);

    const handleLocateMe = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const newCoords = {
                    x: Number(coords.longitude.toFixed(6)),
                    y: Number(coords.latitude.toFixed(6)),
                };
                onChange?.(newCoords);
            },
            null,
            { timeout: 5000 }
        );
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-emerald-600" />
                    {!readOnly ? 'Hacé clic o arrastrá el pin hasta la cancha' : 'Ubicación de la cancha'}
                </span>
                {!readOnly && (
                    <button
                        type="button"
                        onClick={handleLocateMe}
                        className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                    >
                        <Navigation size={12} />
                        Mi ubicación
                    </button>
                )}
            </div>

            <div
                ref={mapContainerRef}
                style={{ height }}
                className="w-full rounded-xl border border-slate-300 overflow-hidden shadow-inner z-0"
            />
            
            <p className="text-[11px] text-slate-400">
                Coordenadas: Lat {lat.toFixed(4)}, Lng {lng.toFixed(4)}
            </p>
        </div>
    );
};