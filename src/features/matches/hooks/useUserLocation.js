import { useState, useEffect } from 'react';
import { DEFAULT_LOCATION } from '../constants/defaultLocation';
import { TIPO_UBICACION_FILTRO } from '../constants/locationConstants';

export const useUserLocation = (initialLocation) => {
    const [location, setLocation] = useState(() => {
        if (initialLocation?.lat && initialLocation?.lng) {
            return {
                lat: initialLocation.lat,
                lng: initialLocation.lng,
                nombre: initialLocation.nombre || 'Ubicación seleccionada',
                tipo: initialLocation.tipo || TIPO_UBICACION_FILTRO.OTRAS_OPCIONES,
            };
        }
        return {
            lat: DEFAULT_LOCATION.y,
            lng: DEFAULT_LOCATION.x,
            nombre: typeof navigator !== 'undefined' && navigator.geolocation ? 'Detectando ubicación...' : 'Posadas (Centro)',
            tipo: TIPO_UBICACION_FILTRO.MI_UBICACION,
        };
    });

    const [isLoadingGps, setIsLoadingGps] = useState(
        () => !initialLocation?.lat && typeof navigator !== 'undefined' && Boolean(navigator.geolocation)
    );

    const solicitarGps = (onSuccess, onError) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            const errorMsg = 'Tu navegador no soporta geolocalización.';
            if (onError) onError(errorMsg);
            else alert(errorMsg);
            return;
        }

        setIsLoadingGps(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const nuevaUbicacion = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    nombre: 'Mi ubicación actual (GPS)',
                    tipo: TIPO_UBICACION_FILTRO.MI_UBICACION,
                };
                setLocation(nuevaUbicacion);
                setIsLoadingGps(false);
                if (onSuccess) onSuccess(nuevaUbicacion);
            },
            (err) => {
                setIsLoadingGps(false);
                const errorMsg = 'No pudimos acceder a tu GPS. Podés elegir una localidad.';
                if (onError) onError(errorMsg, err);
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    };

    useEffect(() => {
        if (initialLocation?.lat) return;

        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        nombre: 'Mi ubicación actual (GPS)',
                        tipo: TIPO_UBICACION_FILTRO.MI_UBICACION,
                    });
                    setIsLoadingGps(false);
                },
                () => {
                    setLocation({
                        lat: DEFAULT_LOCATION.y,
                        lng: DEFAULT_LOCATION.x,
                        nombre: 'Posadas (Centro)',
                        tipo: TIPO_UBICACION_FILTRO.OTRAS_OPCIONES,
                    });
                    setIsLoadingGps(false);
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        }
    }, [initialLocation?.lat]);

    const seleccionarLocalidad = (loc) => {
        const nuevaUbicacion = {
            lat: loc.lat,
            lng: loc.lng,
            nombre: `${loc.nombre} (${loc.provincia})`,
            tipo: TIPO_UBICACION_FILTRO.OTRAS_OPCIONES,
        };
        setLocation(nuevaUbicacion);
        return nuevaUbicacion;
    };

    return {
        location,
        isLoadingGps,
        solicitarGps,
        seleccionarLocalidad,
    };
};
