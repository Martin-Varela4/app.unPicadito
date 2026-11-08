import SectionCard from "../../../components/ui/SectionCard";

export const ProfileReviews = ({ reviews }) => {
  const lista = Array.isArray(reviews) ? reviews : [];

  return (
    <SectionCard title={`Reseñas (${lista.length})`} hasDivider={false} className="shadow-md">
      {lista.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Todavía no tiene reseñas.</p>
      ) : (
        <ul className="space-y-3">
          {lista.map((review, index) => {
            const autor =
              [review.calificador?.nombre, review.calificador?.apellido]
                .filter(Boolean)
                .join(" ") ||
              review.autor ||
              "Usuario";

            return (
              <li
                key={review.id || index}
                className="space-y-1.5 rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-100">
                    {autor}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-medium text-amber-300">
                    <span>★ {review.estrellas}</span>
                  </div>
                </div>
                {review.comentario && (
                  <p className="text-sm text-slate-300">{review.comentario}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
};
