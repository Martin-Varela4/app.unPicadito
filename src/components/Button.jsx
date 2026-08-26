export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-medium text-sm rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow',
        secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-300',
        outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-200',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${fullWidth ? 'w-full' : ''}`}
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