const colorMaps = {
    modality: {
        F5: 'bg-green-100 text-green-800',
        F11: 'bg-orange-100 text-orange-800',
    },
    status: {
        abierto: 'bg-green-100 text-green-800',
        confirmado: 'bg-blue-100 text-blue-800',
        completo: 'bg-red-100 text-red-800',
    },
    level: {
        principiante: 'bg-green-100 text-green-800',
        intermedio: 'bg-yellow-100 text-yellow-800',
        avanzado: 'bg-red-100 text-red-800',
    },
};

const defaultColor = 'bg-slate-100 text-slate-600';

export default function Badge({ label, variant, value }) {
    const variantMap = colorMaps[variant] || {};
    const colorClasses = variantMap[value] || defaultColor;

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colorClasses}`}
        >
            {label}
        </span>
    );
}
