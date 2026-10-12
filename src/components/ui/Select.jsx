import { forwardRef } from 'react';

const Select = forwardRef(({
    options = [],
    label,
    name,
    disabled = false,
    error = null,
    className = '',
    ...props
}, ref) => {
    const hasEmptyOption = options.some((option) => option.value === '');

    return (
        <div className="flex min-w-0 w-full flex-col gap-1.5">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-slate-300">
                    {label}
                </label>
            )}

            <select
                ref={ref}
                id={name}
                name={name}
                disabled={disabled}
                className={`min-h-11 w-full min-w-0 rounded-md border bg-[var(--color-background-main)] px-3.5 py-2 text-sm text-white outline-none transition-colors
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)]'} 
                    disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed ${className}`}
                {...props}
            >
                {!hasEmptyOption && (
                    <option value="" disabled className="bg-[var(--color-background-main)]">
                        Selecciona una opción
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[var(--color-background-main)]">
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-xs text-red-400 font-medium">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';
export default Select;