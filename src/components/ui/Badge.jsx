const colorMaps = {
    modality: {
        F5: 'bg-slate-800 text-slate-300 border border-slate-700',
        F11: 'bg-slate-800 text-slate-300 border border-slate-700',
        public: 'bg-slate-700 text-slate-100',
        private: 'bg-slate-800 text-slate-200 border border-slate-700',
    },
    status: {
        ABIERTA: 'bg-[var(--color-brand-green)] text-white',
        abierto: 'bg-[var(--color-brand-green)] text-white',
        COMPLETA: 'bg-red-700 text-white',
        completa: 'bg-red-700 text-white',
        CANCELADA: 'bg-red-900/40 text-red-200',
        FINALIZADA: 'bg-slate-700 text-slate-100',
        confirmado: 'bg-blue-600 text-white',
        completo: 'bg-red-600 text-white',
        publica: 'bg-slate-700 text-white',
        organizas: 'bg-[var(--color-brand-primary)] text-[#21263A]',
    },
    level: {
        principiante: 'bg-slate-800 text-slate-300',
        intermedio: 'bg-slate-800 text-slate-300',
        avanzado: 'bg-slate-800 text-slate-300',
    },
};

const defaultColor = 'bg-slate-800 text-slate-200 border border-slate-700';

export default function Badge({ label, variant, value }) {
    const variantMap = colorMaps[variant] || {};
    const colorClasses = variantMap[value] || defaultColor;

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${colorClasses}`}
        >
            {label}
        </span>
    );
}
