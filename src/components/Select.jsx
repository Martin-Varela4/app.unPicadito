import { forwardRef } from 'react';

const Select = forwardRef(({
    options = [],
    label,
    name,
    disabled = false,
    error = null,
    ...props
}, ref) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            <select
                ref={ref}
                id={name}
                name={name}
                disabled={disabled}
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg transition-colors outline-none
                    ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-600'} 
                    focus:ring-2 focus:ring-blue-100
                    disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
                {...props}
            >
                <option value="" disabled>Selecciona una opción</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-xs text-red-600 font-medium">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';
export default Select;