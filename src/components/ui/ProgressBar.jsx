export default function ProgressBar({ current, max }) {
    const percentage = max > 0 ? (current / max) * 100 : 0;

    const getBarColor = () => (percentage >= 90 ? 'bg-red-500' : 'bg-[var(--color-brand-primary)]');

    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={Math.min(current, max)}
            className="h-1.5 w-full rounded-full bg-[var(--color-border-subtle)]"
        >
            <div
                className={`h-1.5 rounded-full transition-all duration-300 ${getBarColor()}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
            />
        </div>
    );
}
