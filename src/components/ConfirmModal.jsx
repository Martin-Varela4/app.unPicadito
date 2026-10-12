export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading, children }) => {
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
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="min-h-11 rounded-md bg-slate-700 px-4 py-2 text-slate-100 transition-colors hover:bg-slate-600 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="flex min-h-11 items-center rounded-md bg-[var(--color-brand-primary)] px-4 py-2 font-semibold text-[#21263A] transition-colors hover:bg-[var(--color-brand-primary-dark)] disabled:opacity-50"
                            >
                                {isLoading ? 'Guardando...' : 'Confirmar Cambios'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};