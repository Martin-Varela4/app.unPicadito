export default function Switch({ checked, onChange, label }) {
    return (
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
            </div>
            {label && (
                <span className="text-sm text-slate-700">{label}</span>
            )}
        </label>
    );
}
