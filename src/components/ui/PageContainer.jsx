export default function PageContainer({
    children,
    size = 'lg',
    title,
    subtitle,
    headerAction,
    className = '',
    ...props
}) {
    const sizeClasses = {
        sm: 'max-w-2xl',
        md: 'max-w-3xl',
        lg: 'max-w-4xl',
        xl: 'max-w-7xl',
        full: 'max-w-[1400px]',
    };

    const maxWidth = sizeClasses[size] || sizeClasses.lg;

    return (
        <div className={`mx-auto w-full ${maxWidth} px-4 py-6 sm:px-6 sm:py-8 ${className}`.trim()} {...props}>
            {(title || subtitle || headerAction) && (
                <header className="mb-6 sm:mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {title && (
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="mt-1 text-sm text-[var(--color-text-secondary)] sm:text-base">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {headerAction && <div className="shrink-0">{headerAction}</div>}
                </header>
            )}
            {children}
        </div>
    );
}
