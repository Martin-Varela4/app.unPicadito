export default function EmptyState({
    icon = '⚽',
    title = 'No hay resultados',
    description,
    action,
    className = '',
    ...props
}) {
    return (
        <div
            className={`rounded-md border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-6 py-12 text-center ${className}`.trim()}
            {...props}
        >
            {icon && (
                <div className="mb-3 text-4xl sm:text-5xl" aria-hidden="true">
                    {icon}
                </div>
            )}
            <h3 className="font-semibold text-slate-100 sm:text-lg">{title}</h3>
            {description && (
                <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
                    {description}
                </p>
            )}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
