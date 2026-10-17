import Input from '../../../../components/ui/Input';

export const EditRoomFields = ({ values, errors = {}, isTimeLocked = false, onChange }) => {
    const handleChange = (event) => onChange(event.target.name, event.target.value);
    const lockedClass = isTimeLocked ? 'bg-slate-800 text-slate-400 border-slate-700' : '';

    const hourOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return { value: `${hour}:00`, label: `${hour}:00` };
    });

    return (
        <div className="space-y-4">
            <Input
                name="nombre"
                label="Nombre del Partido"
                placeholder="Ej: Partido de fútbol 5"
                value={values.nombre}
                onChange={handleChange}
                error={errors.nombre}
            />
            
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                    name="nombreCancha"
                    label="Complejo / Cancha (Opcional)"
                    value={values.nombreCancha || ''}
                    onChange={handleChange}
                    disabled={isTimeLocked}
                    className={lockedClass}
                    error={errors.nombreCancha}
                />
                <Input
                    name="direccion"
                    label="Dirección (Opcional)"
                    value={values.direccion || ''}
                    onChange={handleChange}
                    disabled={isTimeLocked || !values.nombreCancha} 
                    className={`${lockedClass} ${!values.nombreCancha ? 'opacity-60 cursor-not-allowed' : ''}`}
                    error={errors.direccion}
                    placeholder={values.nombreCancha ? "Ej: Av. Siempre Viva 123" : "Seleccioná una cancha primero"}
                />
            </div>

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
                
                <div>
                    <label htmlFor="hora" className="block text-sm font-medium text-slate-200 mb-1.5">
                        Hora (en punto)
                    </label>
                    <select
                        id="hora"
                        name="hora"
                        value={values.hora || ''}
                        onChange={handleChange}
                        disabled={isTimeLocked}
                        className={`min-h-[42px] w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] p-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] ${lockedClass}`}
                    >
                        <option value="" disabled>Seleccioná una hora</option>
                        {hourOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {errors.hora && (
                        <p className="text-red-500 text-xs mt-1">{errors.hora}</p>
                    )}
                </div>
            </div>

            <Input
                name="cuposTotales"
                type="number"
                label="Cupos Totales de Jugadores"
                value={values.cuposTotales}
                onChange={handleChange}
                error={errors.cuposTotales}
            />
            
            <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-slate-200 mb-1.5">
                    Descripción / Indicaciones (Opcional)
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={3}
                    value={values.descripcion || ''}
                    onChange={handleChange}
                    className="min-h-24 w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] p-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)]"
                    placeholder="Ej: Traer pechera o camiseta clara..."
                />
                {errors.descripcion && (
                    <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
                )}
            </div>
        </div>
    );
};