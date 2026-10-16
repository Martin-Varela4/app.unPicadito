export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    onClick,
    ...props
}) {
    const baseStyles = 'inline-flex min-h-11 items-center justify-center font-semibold text-sm rounded-md px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-main)] disabled:opacity-60 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-dark)] text-[#21263A] focus:ring-[var(--color-brand-primary)] shadow-sm hover:shadow',
        secondary: 'border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[#21263A] focus:ring-[var(--color-brand-primary)]',
        outline: 'border border-slate-500 hover:bg-slate-800 text-slate-300 focus:ring-slate-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
        ghost: 'hover:bg-slate-800 text-slate-300 focus:ring-slate-700',
        gradient: 'bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-green)] text-[#21263A] shadow-sm hover:opacity-90',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4 text-current"
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
                    <span>Cargando...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
}