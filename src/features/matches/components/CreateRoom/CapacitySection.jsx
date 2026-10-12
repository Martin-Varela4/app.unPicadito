import Input from '../../../../components/ui/Input';

export const CapacitySection = ({ values, errors, onChange }) => {

    return (
        <div className="bg-[var(--color-background-card)] p-6 rounded-xl border border-slate-700 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-100">3. Capacidad</h2>
            <Input
                type="number"
                label="Límite de Jugadores"
                placeholder="Ej: 10"
                name="maxPlayers"
                value={values.maxPlayers}
                onChange={(event) => onChange('maxPlayers', event.target.value)}
                error={errors.maxPlayers}
            />
            <p className="text-xs text-slate-400">Mínimo 10 (Fútbol 5) - Máximo 22 (Fútbol 11)</p>
        </div>
    );
};