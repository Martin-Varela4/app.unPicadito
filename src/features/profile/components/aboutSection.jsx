import { Calendar, MapPin } from "lucide-react";

export function AboutSection({ player }) {
  return (
    <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-5 shadow-md sm:p-6">
      <h2 className="text-lg font-bold text-slate-100 mb-2">Sobre mí</h2>
      <p className="text-slate-300 text-sm leading-relaxed mb-6">
        {player.about || "Sin descripción por el momento."}
      </p>

      <div className="grid grid-cols-1 gap-4 border-t border-slate-700 pt-4 text-sm text-slate-300 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="shrink-0 text-[var(--color-brand-primary)]" />
          <span>{player.age ? `${player.age} años` : "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="shrink-0 text-[var(--color-brand-primary)]" />
          <span>{player.location || "Ubicación no especificada"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">👟</span>
          <span>{player.playingSince || "Jugador activo"}</span>
        </div>
      </div>
    </div>
  );
}