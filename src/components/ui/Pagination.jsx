import { ChevronLeft, ChevronRight } from 'lucide-react';

const getPageNumbers = (currentPage, totalPages) => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
        return [1, 2, 3, '...', totalPages];
    }

    if (currentPage >= totalPages - 1) {
        return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage, '...', totalPages];
};

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems,
    itemsPerPage = 12,
    onPageChange,
    className = '',
}) {
    if (!totalPages || totalPages <= 1) return null;

    const pageNumbers = getPageNumbers(currentPage, totalPages);

    const startItem = totalItems !== undefined ? (currentPage - 1) * itemsPerPage + 1 : null;
    const endItem = totalItems !== undefined ? Math.min(currentPage * itemsPerPage, totalItems) : null;

    return (
        <nav
            aria-label="Paginación"
            className={`flex flex-col items-center justify-between gap-4 py-4 sm:flex-row ${className}`.trim()}
        >
            {/* Información de cantidad de resultados */}
            {totalItems !== undefined && (
                <div className="text-xs text-slate-400 sm:text-sm">
                    Mostrando <span className="font-semibold text-slate-200">{startItem}</span> a{' '}
                    <span className="font-semibold text-slate-200">{endItem}</span> de{' '}
                    <span className="font-semibold text-slate-200">{totalItems}</span> resultados
                </div>
            )}

            {/* Controles de paginación */}
            <div className="flex items-center gap-1 sm:gap-1.5">
                {/* Botón Anterior */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Página anterior"
                >
                    <ChevronLeft size={16} className="sm:mr-1" />
                    <span className="hidden sm:inline">Anterior</span>
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, idx) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`dots-${idx}`}
                                    className="px-2 py-1 text-xs text-slate-500 select-none"
                                >
                                    ...
                                </span>
                            );
                        }

                        const isActive = page === currentPage;

                        return (
                            <button
                                key={`page-${page}`}
                                type="button"
                                onClick={() => onPageChange(page)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-xs font-semibold transition-all ${
                                    isActive
                                        ? 'bg-[var(--color-brand-primary)] text-[#21263A] shadow-sm'
                                        : 'border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] text-slate-300 hover:border-slate-600 hover:text-white'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* Botón Siguiente */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Página siguiente"
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight size={16} className="sm:ml-1" />
                </button>
            </div>
        </nav>
    );
}
