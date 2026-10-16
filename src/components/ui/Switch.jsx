export default function Switch({ checked, onChange, label }) {
    return (
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <div className="flex min-h-11 items-center">
                <span className="relative h-5 w-9">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        className="peer sr-only"
                    />
                    <span className="absolute inset-0 rounded-full bg-slate-700 transition-colors peer-checked:bg-[var(--color-brand-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-brand-primary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-background-main)]" />
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-slate-100 shadow-sm transition-transform peer-checked:translate-x-4" />
                </span>
            </div>
            {label && (
                <span className="text-sm text-slate-300">{label}</span>
            )}
        </label>
    );
}
