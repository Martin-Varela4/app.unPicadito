import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    name,
    type = 'text',
    placeholder = '',
    error = null,
    disabled = false,
    required = false,
    className = '',
    ...props
}, ref) => { // <-- Recibimos la ref aquí
    return (
        <div className="flex min-w-0 w-full flex-col gap-1.5">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-slate-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <input
                ref={ref} // <-- Pasamos la ref al input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`min-h-11 w-full min-w-0 rounded-md border bg-[var(--color-background-main)] px-3.5 py-2 text-sm text-white outline-none transition-colors
          placeholder:text-slate-400
          disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed
          ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[var(--color-border-subtle)] focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)]'
                    } ${className}`}
                {...props}
            />

            {error && (
                <p className="text-xs text-red-400 font-medium">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;