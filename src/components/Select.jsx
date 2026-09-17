export default function Select({
    value,
    onChange,
    options = [],
    label,
    disabled = false,
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg transition-colors outline-none
                    border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100
                    disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
