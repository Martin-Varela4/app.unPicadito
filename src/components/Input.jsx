export default function Input({
    label,
    name,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    error = null,
    disabled = false,
    required = false,
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg transition-colors outline-none
          placeholder:text-slate-400
          disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
          ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                {...props}
            />

            {error && (
                <p className="text-xs text-red-600 font-medium">{error}</p>
            )}
        </div>
    );
}