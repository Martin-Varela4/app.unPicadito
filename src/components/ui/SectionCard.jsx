export default function SectionCard({
    title,
    icon,
    headerAction,
    hasDivider = true,
    children,
    className = '',
    contentClassName = '',
    ...props
}) {
    return (
        <section
            className={`space-y-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-6 ${className}`.trim()}
            {...props}
        >
            {(title || headerAction) && (
                <div className={`flex items-center justify-between gap-2 ${hasDivider ? 'border-b border-[var(--color-border-subtle)] pb-2' : ''}`.trim()}>
                    {title && (
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
                            {icon && <span aria-hidden="true">{icon}</span>}
                            <span>{title}</span>
                        </h2>
                    )}
                    {headerAction && <div className="shrink-0">{headerAction}</div>}
                </div>
            )}
            <div className={contentClassName}>
                {children}
            </div>
        </section>
    );
}
