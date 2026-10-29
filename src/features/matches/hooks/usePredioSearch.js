import { useState, useEffect } from 'react';
import { buscarPrediosCercanos } from '../services/predioService';
import { useDebounce } from '../../../hooks/useDebounce';

export const usePredioSearch = (busquedaTexto, origenCoords, radioKm = 30) => {
    const [prediosSugeridos, setPrediosSugeridos] = useState([]);
    const [cargandoPredios, setCargandoPredios] = useState(false);

    const busquedaDebounced = useDebounce(busquedaTexto, 400);

    useEffect(() => {
        if (!origenCoords?.lat || !origenCoords?.lng) return;

        let activo = true;

        const cargar = async () => {
            setCargandoPredios(true);
            try {
                const resultados = await buscarPrediosCercanos({
                    busqueda: busquedaDebounced || undefined,
                    lat: origenCoords.lat,
                    lng: origenCoords.lng,
                    radioKm,
                });
                if (activo) {
                    setPrediosSugeridos(resultados);
                }
            } catch (error) {
                console.error('Error al buscar predios:', error);
            } finally {
                if (activo) setCargandoPredios(false);
            }
        };

        cargar();

        return () => {
            activo = false;
        };
    }, [busquedaDebounced, origenCoords?.lat, origenCoords?.lng, radioKm]);

    return {
        prediosSugeridos,
        cargandoPredios,
    };
};
