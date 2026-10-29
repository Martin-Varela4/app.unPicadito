import { Calendar, MapPin } from "lucide-react";
import SectionCard from "../../../components/ui/SectionCard";

export function AboutSection({ player }) {
  return (
    <SectionCard title="Sobre mí" hasDivider={false} className="shadow-md">
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
    </SectionCard>
  );
}
