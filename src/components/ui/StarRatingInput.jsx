import { Star } from 'lucide-react';

export default function StarRatingInput({
    value = 0,
    onChange,
    disabled = false,
    max = 5,
    className = '',
}) {
    const stars = Array.from({ length: max }, (_, index) => index + 1);

    return (
        <div role="radiogroup" aria-label="Puntuación" className={`flex items-center gap-1 ${className}`.trim()}>
            {stars.map((n) => (
                <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={value === n}
                    aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                    disabled={disabled}
                    onClick={() => onChange?.(n)}
                    className="rounded-sm p-1 text-amber-300 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Star size={28} fill={n <= value ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>
            ))}
            <span className="ml-2 text-sm text-slate-300">
                {value > 0 ? `${value}/${max}` : 'Sin puntuar'}
            </span>
        </div>
    );
}

