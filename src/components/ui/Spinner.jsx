export default function Spinner({ size = 'md', label, colorClass, className = '' }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-10 w-10',
    };

    const color = colorClass || 'text-[var(--color-brand-primary)]';

    return (
        <div role="status" aria-label={label || 'Cargando'} className={`flex flex-col items-center justify-center gap-2 ${className}`}>
            <svg
                aria-hidden="true"
                className={`animate-spin ${color} ${sizes[size] || sizes.md}`}
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                />
            </svg>
            {label && (
                <span className="text-sm text-slate-300">{label}</span>
            )}
        </div>
    );
}
