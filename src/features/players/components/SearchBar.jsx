export const SearchBar = ({ value, onChange }) => {
  return (
    <div className="mx-auto flex w-full justify-center">
      <div className="relative w-full max-w-xl">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true">
          🔍
        </span>

        <input
          type="search" // Cambiado de 'text' a 'search' para agregar la "X" nativa de borrado
          aria-label="Buscar jugadores por nombre o usuario"
          placeholder="Buscar por nombre o usuario..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off" // Evita que el navegador encime el historial encima de tu lista
          className="min-h-12 w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/30 sm:text-base"
        />
      </div>
    </div>
  );
};
