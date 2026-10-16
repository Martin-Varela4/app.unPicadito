import { Star } from "lucide-react";

export const ProfileRanking = ({ ranking }) => {
  const valorNumerico = Number(ranking ?? 0);
  const tieneValoracion = Number.isFinite(valorNumerico) && valorNumerico > 0;

  if (!tieneValoracion) {
    return null;
  }

  return (
    <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-5 shadow-md sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <Star className="text-amber-300" size={20} fill="currentColor" />
        <h3 className="text-lg font-bold text-slate-100">Estrellas</h3>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-3xl font-extrabold text-slate-100">
          {valorNumerico.toFixed(2)}
        </span>
        <div className="flex items-center text-amber-300">
          <Star size={22} fill="currentColor" />
        </div>
        <span className="text-sm font-medium text-slate-400 ml-1">
          en promedio
        </span>
      </div>
    </div>
  );
};
