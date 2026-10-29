import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import { usePredioSearch } from '../hooks/usePredioSearch';

export const PredioSearchField = ({
    value,
    onChange,
    onSelectPredio,
    origenCoords,
    error,
    disabled = false,
}) => {
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const { prediosSugeridos, cargandoPredios } = usePredioSearch(value, origenCoords);

    const handleSelect = (predio) => {
        onSelectPredio(predio);
        setMostrarSugerencias(false);
    };

    return (
        <div className="relative">
            <Input
                name="busquedaPredio"
                label="Lugar / Complejo Deportivo *"
                placeholder="Buscá un complejo deportivo (ej: La Cantera, Oberá Fútbol, Tiro...)"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setMostrarSugerencias(true);
                }}
                onFocus={() => setMostrarSugerencias(true)}
                disabled={disabled}
                error={error}
            />

            {mostrarSugerencias && prediosSugeridos.length > 0 && !disabled && (
                <div className="absolute left-0 top-full z-40 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-700 bg-slate-900 p-2 shadow-2xl">
                    <div className="mb-1 px-2 py-1 text-[11px] font-semibold text-slate-400">
                        {cargandoPredios ? 'Buscando complejos...' : 'Complejos encontrados (hacé clic para elegir):'}
                    </div>

                    {prediosSugeridos.map((predio) => (
                        <button
                            key={predio.id}
                            onClick={() => handleSelect(predio)}
                            className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-xs transition-colors hover:bg-slate-800"
                        >
                            <div>
                                <p className="font-semibold text-white">{predio.nombre}</p>
                                <p className="text-[11px] text-slate-400">{predio.direccion}</p>
                            </div>

                            {predio.distanciaKm !== null && predio.distanciaKm !== undefined && (
                                <Badge className="text-[11px] text-[var(--color-brand-primary)]">
                                    📍 {predio.distanciaKm} km
                                </Badge>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
