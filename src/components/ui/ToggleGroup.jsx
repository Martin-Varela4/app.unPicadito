import Spinner from './Spinner';

export default function ToggleGroup({
    options = [],
    value,
    onChange,
    label,
    isLoading = false,
}) {
    const baseButton = 'min-h-11 px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]';
    const activeStyles = 'bg-[var(--color-brand-primary)] text-[#21263A] shadow-sm';
    const inactiveStyles = 'bg-[var(--color-background-card)] text-slate-200 border border-[var(--color-border-subtle)] hover:bg-slate-700';

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <span className="text-sm font-medium text-slate-200">
                    {label}
                </span>
            )}

            {isLoading ? (
                <div className="flex items-center h-9">
                    <Spinner size="sm" />
                </div>
            ) : (
                <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={value === option.value}
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
