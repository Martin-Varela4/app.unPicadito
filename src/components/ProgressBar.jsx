export default function ProgressBar({ current, max }) {
    const percentage = max > 0 ? (current / max) * 100 : 0;

    const getBarColor = () => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 60) return 'bg-yellow-400';
        return 'bg-green-500';
    };

    return (
        <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
                className={`h-1.5 rounded-full transition-all duration-300 ${getBarColor()}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
            />
        </div>
    );
}
