import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customPinIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<div class="text-[32px] leading-none drop-shadow-md cursor-pointer">📍</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const useLeafletMap = ({
    containerRef,
    lat,
    lng,
    label = '',
    direccion = '',
    readOnly = false,
    onChange,
}) => {
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
        if (!containerRef.current) return;

        const initial = initialLocationRef.current;
        const map = L.map(containerRef.current).setView([initial.lat, initial.lng], 14);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([initial.lat, initial.lng], {
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
    }, [containerRef]);

    useEffect(() => {
        if (!markerRef.current || !mapInstanceRef.current) return;

        if (readOnly) markerRef.current.dragging?.disable();
        else markerRef.current.dragging?.enable();

        const currentPos = markerRef.current.getLatLng();
        const coordsCambian = Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001;

        if (coordsCambian) {
            markerRef.current.setLatLng([lat, lng]);
            mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 0.8 });
        }

        if (label || direccion) {
            markerRef.current.bindPopup(
                `<div style="font-family: sans-serif; font-size: 13px; color: #1e293b;">
                    <strong style="color: #0f172a; font-size: 14px;">${label || 'Cancha'}</strong>
                    ${direccion ? `<br/><span style="color: #64748b; font-size: 12px;">${direccion}</span>` : ''}
                </div>`
            );
            markerRef.current.openPopup();
        }
    }, [lat, lng, readOnly, label, direccion]);
};
