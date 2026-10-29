import { Star } from 'lucide-react';

export default function RatingBadge({
    value,
    size = 'sm',
    unratedText = 'Aún sin calificar',
    className = '',
    showAverageLabel = false,
}) {
    const numericValue = Number(value ?? 0);
    const isRated = Number.isFinite(numericValue) && numericValue > 0;

    const starSizes = {
        sm: 14,
        md: 18,
        lg: 22,
    };

    if (!isRated) {
        return (
            <span className={`text-slate-400 italic text-xs ${className}`.trim()}>
                {unratedText}
            </span>
        );
    }

    const formattedValue = numericValue % 1 === 0 ? numericValue : numericValue.toFixed(1);

    return (
        <div className={`inline-flex items-center gap-1 font-semibold text-amber-300 ${className}`.trim()}>
            <Star
                size={starSizes[size] || 14}
                fill="currentColor"
                aria-hidden="true"
                className="shrink-0"
            />
            <span>{formattedValue}</span>
            {showAverageLabel && (
                <span className="text-xs font-normal text-slate-400 ml-0.5">
                    en promedio
                </span>
            )}
        </div>
    );
}
