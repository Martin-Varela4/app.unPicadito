import Button from './Button';

export default function FormActions({
    children,
    onCancel,
    cancelText = 'Cancelar',
    submitText = 'Guardar',
    isLoading = false,
    isSubmitDisabled = false,
    submitVariant = 'primary',
    submitIcon,
    className = '',
    ...props
}) {
    return (
        <div
            className={`flex flex-col-reverse justify-end gap-3 border-t border-[var(--color-border-subtle)] pt-4 sm:flex-row ${className}`.trim()}
            {...props}
        >
            {children ? (
                children
            ) : (
                <>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant={submitVariant}
                        isLoading={isLoading}
                        disabled={isSubmitDisabled || isLoading}
                        className="w-full sm:w-auto"
                    >
                        {submitIcon && <span className="mr-2 inline-flex items-center">{submitIcon}</span>}
                        {submitText}
                    </Button>
                </>
            )}
        </div>
    );
}
