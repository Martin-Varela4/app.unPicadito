import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import HourPicker from '../../../components/HourPicker';
import { obtenerCanchasPorPredio } from '../services/predioService';
import { parseCoords } from '../utils/locationUtils';
import { useUserLocation } from '../hooks/useUserLocation';
import { LocationFilterBar } from './LocationFilterBar';
import { PredioSearchField } from './PredioSearchField';
import { CanchaSelectCards } from './CanchaSelectCards';

export const RoomFormFields = ({ values, errors = {}, isTimeLocked = false, onChange }) => {
    const handleChange = (event) => onChange(event.target.name, event.target.value);
    const lockedClass = isTimeLocked ? 'bg-slate-800 text-slate-400 border-slate-700' : '';

    const { location, isLoadingGps, solicitarGps, seleccionarLocalidad } = useUserLocation();
    const [canchasDisponibles, setCanchasDisponibles] = useState([]);

    const handleGpsClick = () => {
        solicitarGps(
            (nuevaUbicacion) => {
                if (!values.canchaId) {
                    onChange('ubicacion', { x: nuevaUbicacion.lng, y: nuevaUbicacion.lat });
                }
            },
            (msg) => alert(msg)
        );
    };

    const handleLocalidadClick = (loc) => {
        const nuevaUbicacion = seleccionarLocalidad(loc);
        if (!values.canchaId) {
            onChange('ubicacion', { x: nuevaUbicacion.lng, y: nuevaUbicacion.lat });
        }
    };

    const handleSelectPredio = async (predio) => {
        onChange('predioId', predio.id);
        onChange('nombrePredio', predio.nombre);
        onChange('direccion', predio.direccion);
        onChange('canchaId', '');
        onChange('nombreCancha', '');

        const coords = parseCoords(predio.ubicacion || predio);
        onChange('ubicacion', { x: coords.lng, y: coords.lat });

        try {
            const canchas = await obtenerCanchasPorPredio(predio.id);
            setCanchasDisponibles(canchas);
        } catch (error) {
            console.error('Error al cargar canchas del predio:', error);
        }
    };

    const handleSelectCancha = (cancha) => {
        onChange('canchaId', cancha.id);
        onChange('nombreCancha', cancha.nombre);
        onChange('cuposTotales', cancha.cuposRecomendados || 10);
    };

    return (
        <div className="space-y-4">
            <Input
                name="nombre"
                label="Nombre del Partido"
                placeholder="Ej: Picadito nocturno"
                value={values.nombre}
                onChange={handleChange}
                error={errors.nombre}
            />

            <LocationFilterBar
                tipoUbicacion={location.tipo}
                nombreUbicacion={location.nombre}
                onGpsClick={handleGpsClick}
                onLocalidadClick={handleLocalidadClick}
                isLoadingGps={isLoadingGps}
            />

            <PredioSearchField
                value={values.nombrePredio || ''}
                onChange={(texto) => onChange('nombrePredio', texto)}
                onSelectPredio={handleSelectPredio}
                origenCoords={location}
                disabled={isTimeLocked}
                error={errors.canchaId && !values.predioId ? 'Primero elegí un complejo' : undefined}
            />

            {values.predioId && (
                <CanchaSelectCards
                    nombrePredio={values.nombrePredio}
                    canchas={canchasDisponibles}
                    canchaSeleccionadaId={values.canchaId}
                    onSelectCancha={handleSelectCancha}
                    error={errors.canchaId}
                />
            )}

            <Input
                name="direccion"
                label="Dirección del Complejo"
                value={values.direccion || ''}
                disabled
                className="bg-slate-800 text-slate-300 border-slate-700 cursor-not-allowed"
                placeholder="Se completa automáticamente al elegir el complejo"
            />

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                    name="fecha"
                    type="date"
                    label="Fecha"
                    value={values.fecha}
                    onChange={handleChange}
                    disabled={isTimeLocked}
                    className={lockedClass}
                    error={errors.fecha}
                />

                <HourPicker
                    name="hora"
                    value={values.hora || ''}
                    onChange={handleChange}
                    disabled={isTimeLocked}
                    className={lockedClass}
                    error={errors.hora}
                />
            </div>

            <Input
                name="cuposTotales"
                type="number"
                label="Cupos Totales de Jugadores"
                value={values.cuposTotales}
                onChange={handleChange}
                error={errors.cuposTotales}
            />

            <Textarea
                name="descripcion"
                label="Descripción / Indicaciones (Opcional)"
                placeholder="Ej: Traer pechera o camiseta clara..."
                value={values.descripcion || ''}
                onChange={handleChange}
                error={errors.descripcion}
                rows={3}
            />
        </div>
    );
};

export const EditRoomFields = RoomFormFields;
