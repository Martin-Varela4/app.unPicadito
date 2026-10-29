import SectionCard from "../../../components/ui/SectionCard";

export const ProfileReviews = ({ reviews }) => {
  const lista = Array.isArray(reviews) ? reviews : [];
  
  return (
    <SectionCard title={`Reseñas (${lista.length})`} hasDivider={false} className="shadow-md">
      {lista.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Todavía no tiene reseñas.</p>
      ) : (
        <ul className="space-y-3">
          {lista.map((review, index) => (
            <li key={review.id || index} className="space-y-1 rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100 text-sm">
                  {review.calificador?.nombre || review.autor || "Usuario"}
                </span>
                <div className="flex items-center gap-1 text-sm font-medium text-amber-300">
                  <span>★ {review.estrellas}</span>
                </div>
              </div>
              <p className="text-slate-300 text-sm">{review.comentario}</p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
};
