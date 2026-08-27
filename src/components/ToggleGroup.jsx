import Spinner from './Spinner';

export default function ToggleGroup({
    options = [],
    value,
    onChange,
    label,
    isLoading = false,
}) {
    const baseButton = 'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus:outline-none';
    const activeStyles = 'bg-blue-600 text-white shadow-sm';
    const inactiveStyles = 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50';

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            {isLoading ? (
                <div className="flex items-center h-9">
                    <Spinner size="sm" />
                </div>
            ) : (
                <div className="flex items-center gap-1">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={`${baseButton} ${value === option.value ? activeStyles : inactiveStyles}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
