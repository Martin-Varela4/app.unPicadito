const VARIANT_STYLES = {
    error: 'border-red-500/40 bg-red-950/40 text-red-200',
    warning: 'border-amber-500/40 bg-amber-950/40 text-amber-200',
    info: 'border-sky-500/40 bg-sky-950/40 text-sky-200',
    success: 'border-green-500/40 bg-green-950/40 text-green-200',
};

const DEFAULT_ICONS = {
    error: '⚠️',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✓',
};

export default function Alert({
    children,
    message,
    variant = 'error',
    icon,
    className = '',
    ...props
}) {
    const content = children || message;
    if (!content) return null;

    const chosenIcon = icon !== undefined ? icon : DEFAULT_ICONS[variant];
    const variantClasses = VARIANT_STYLES[variant] || VARIANT_STYLES.error;

    return (
        <div
            role="alert"
            className={`flex items-center gap-2 rounded-md border p-3 text-sm ${variantClasses} ${className}`.trim()}
            {...props}
        >
            {chosenIcon && <span aria-hidden="true" className="shrink-0">{chosenIcon}</span>}
            <div className="flex-1 min-w-0">{content}</div>
        </div>
    );
}
