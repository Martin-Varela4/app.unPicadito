import { Star } from "lucide-react";
import SectionCard from "../../../components/ui/SectionCard";
import RatingBadge from "../../../components/ui/RatingBadge";

export const ProfileRanking = ({ ranking }) => {
  const valorNumerico = Number(ranking ?? 0);
  const tieneValoracion = Number.isFinite(valorNumerico) && valorNumerico > 0;

  return (
    <SectionCard
      title="Estrellas"
      icon={<Star className="text-amber-300" size={20} fill="currentColor" />}
      hasDivider={false}
      className="shadow-md"
    >
      {tieneValoracion ? (
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
      ) : (
        <RatingBadge value={0} unratedText="Aún sin calificar" className="text-sm" />
      )}
    </SectionCard>
  );
};
