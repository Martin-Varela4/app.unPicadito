import React from "react";
import { MessageSquare, Star } from "lucide-react";

export const ProfileReviews = ({ reviews }) => {
  const lista = Array.isArray(reviews) ? reviews : [];
  
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-slate-800">Reseñas ({lista.length})</h3>
      </div>

      {lista.length === 0 ? (
        <p className="text-sm text-slate-500 italic">Todavía no tiene reseñas.</p>
      ) : (
        <ul className="space-y-3">
          {lista.map((review, index) => (
            <li key={review.id || index} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-sm">
                  {review.calificador?.nombre || review.autor || "Usuario"}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                  <span>★ {review.estrellas}</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm">{review.comentario}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};