import Input from '../../../../components/ui/Input';

export const DateTimeSection = ({ values, errors, onChange }) => {

    return (
        <div className="bg-[var(--color-background-card)] p-6 rounded-xl border border-slate-700 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-100">2. Día y Horario</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    type="date"
                    label="Fecha del Partido"
                    name="date"
                    value={values.date}
                    onChange={(event) => onChange('date', event.target.value)}
                    error={errors.date}
                />
                <Input
                    type="time"
                    label="Horario"
                    name="time"
                    value={values.time}
                    onChange={(event) => onChange('time', event.target.value)}
                    error={errors.time}
                />
            </div>
        </div>
    );
};