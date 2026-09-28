import React from "react";
import { Star } from "lucide-react";

export const ProfileRanking = ({ ranking }) => {
  const tieneValoracion = ranking !== null && ranking !== undefined;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Star className="text-amber-500" size={20} fill="currentColor" />
        <h3 className="text-lg font-bold text-slate-800">Estrellas</h3>
      </div>
      
      {tieneValoracion ? (
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{ranking}</span>
          <div className="flex items-center text-amber-500">
            <Star size={22} fill="currentColor" />
          </div>
          <span className="text-sm font-medium text-slate-500 ml-1">en promedio</span>
        </div>
      ) : (
        <p className="text-sm text-slate-500 italic">Este jugador todavía no tiene estrellas asignadas.</p>
      )}
    </div>
  );
};