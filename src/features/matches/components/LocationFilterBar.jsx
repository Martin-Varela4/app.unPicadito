import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { OTRAS_LOCALIDADES, TIPO_UBICACION_FILTRO } from '../constants/locationConstants';

export const LocationFilterBar = ({
    tipoUbicacion,
    nombreUbicacion,
    onGpsClick,
    onLocalidadClick,
    isLoadingGps,
    label = 'Cercanas a:',
}) => {
    const [mostrarPopLocalidades, setMostrarPopLocalidades] = useState(false);

    const handleSelect = (loc) => {
        onLocalidadClick(loc);
        setMostrarPopLocalidades(false);
    };

    const isGpsActive = tipoUbicacion === TIPO_UBICACION_FILTRO.MI_UBICACION;
    const isOtherActive = tipoUbicacion === TIPO_UBICACION_FILTRO.OTRAS_OPCIONES;

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/80 bg-slate-800/50 p-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-400">{label}</span>
                <strong className="text-white">{nombreUbicacion || 'Posadas'}</strong>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    onClick={onGpsClick}
                    isLoading={isLoadingGps}
                    variant={isGpsActive ? undefined : 'outline'}
                    className="min-h-8 px-3 py-1 text-xs"
                >
                    📍 Mi GPS
                </Button>

                <div className="relative">
                    <Button
                        onClick={() => setMostrarPopLocalidades(!mostrarPopLocalidades)}
                        variant={isOtherActive ? undefined : 'outline'}
                        className="min-h-8 px-3 py-1 text-xs"
                    >
                        🌐 Elegir localidad ▾
                    </Button>

                    {mostrarPopLocalidades && (
                        <div className="absolute right-0 top-full z-50 mt-1.5 w-64 rounded-md border border-slate-700 bg-slate-900 p-2 shadow-2xl">
                            <div className="mb-2 flex items-center justify-between border-b border-slate-800 px-1 pb-1">
                                <span className="text-[11px] font-bold text-slate-200">Elegí tu localidad</span>
                                <button
                                    onClick={() => setMostrarPopLocalidades(false)}
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="max-h-52 space-y-1 overflow-y-auto">
                                {OTRAS_LOCALIDADES.map((loc) => {
                                    const seleccionada = nombreUbicacion?.includes(loc.nombre);
                                    return (
                                        <button
                                            key={loc.id}
                                            onClick={() => handleSelect(loc)}
                                            className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-slate-800 ${
                                                seleccionada
                                                    ? 'bg-slate-800 font-semibold text-[var(--color-brand-primary)]'
                                                    : 'text-slate-300 hover:text-white'
                                            }`}
                                        >
                                            <span>{loc.nombre}</span>
                                            <span className="text-[10px] text-slate-400">{loc.provincia}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
