import Button from './ui/Button';

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading,
    children,
    confirmText = 'Confirmar Cambios',
    confirmVariant = 'primary',
}) => {
    if (!isOpen) return null;

    return (
        <div onClick={(event) => event.stopPropagation()} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-5 shadow-xl sm:p-6"
            >
                <h3 id="confirm-modal-title" className="mb-4 text-xl font-bold text-slate-100">{title}</h3>
                {children ? (
                    children
                ) : (
                    <>
                        <p className="mb-6 text-slate-300">{message}</p>
                        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant={confirmVariant}
                                onClick={onConfirm}
                                isLoading={isLoading}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
