import Input from './Input';

export default function SearchInput({
    value,
    onChange,
    onClear,
    placeholder = 'Buscar...',
    ...props
}) {
    const showClear = value?.length > 0;

    return (
        <div className="relative w-full">
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
            </svg>

            <Input
                name="search"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`pl-10 ${showClear ? 'pr-9' : ''}`}
                {...props}
            />

            {showClear && onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}
