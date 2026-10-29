import Button from '../../../components/ui/Button';

export const CanchaSelectCards = ({
    nombrePredio,
    canchas = [],
    canchaSeleccionadaId,
    onSelectCancha,
    error,
}) => {
    if (!canchas || canchas.length === 0) {
        return (
            <div className="rounded-md border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-xs text-slate-400">Cargando canchas disponibles...</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border border-slate-700 bg-slate-900/60 p-3 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
                Seleccioná la cancha en <span className="text-[var(--color-brand-primary)]">{nombrePredio}</span> *:
            </label>

            <div className="flex flex-wrap gap-2">
                {canchas.map((cancha) => {
                    const isSelected = canchaSeleccionadaId === cancha.id;
                    const formato = cancha.tipoFutbol ? cancha.tipoFutbol.replace('_', ' ') : 'FÚTBOL';

                    return (
                        <Button
                            key={cancha.id}
                            onClick={() => onSelectCancha(cancha)}
                            variant={isSelected ? undefined : 'outline'}
                            className="min-h-9 px-3 py-1.5 text-xs"
                        >
                            ⚽ {cancha.nombre} · {formato} ({cancha.cuposRecomendados} jugadores)
                        </Button>
                    );
                })}
            </div>

            {error && (
                <p className="text-xs font-medium text-red-400">{error}</p>
            )}
        </div>
    );
};
