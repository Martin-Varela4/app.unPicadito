export function Card({ children, className = '', ...props }) {
    return (
        <div
            className={`bg-[var(--color-background-card)] border border-[var(--color-border-subtle)] rounded-sm overflow-hidden shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '', ...props }) {
    return (
        <div className={`p-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '', ...props }) {
    return (
        <div className={`p-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '', ...props }) {
    return (
        <div className={`p-4 pt-0 border-t border-[var(--color-border-subtle)] mt-2 ${className}`} {...props}>
            {children}
        </div>
    );
}
