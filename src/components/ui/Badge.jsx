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
        solicitud_enviada: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
        pendiente: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    },
    level: {
        principiante: 'bg-slate-800 text-slate-300',
        intermedio: 'bg-slate-800 text-slate-300',
        avanzado: 'bg-slate-800 text-slate-300',
    },
};

const defaultColor = 'bg-slate-800 text-slate-200 border border-slate-700';

export default function Badge({ label, children, variant, value, className = '', ...props }) {
    const variantMap = variant ? colorMaps[variant] || {} : {};
    const colorClasses = value && variantMap[value] ? variantMap[value] : (className ? '' : defaultColor);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorClasses} ${className}`.trim()}
            {...props}
        >
            {children || label}
        </span>
    );
}
