import React from "react";
import { Calendar, MapPin } from "lucide-react";

export function AboutSection({ player }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-2">Sobre mí</h2>
      <p className="text-slate-600 text-sm leading-relaxed mb-6">
        {player.about || "Sin descripción por el momento."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-blue-600 shrink-0" />
          <span>{player.age ? `${player.age} años` : "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-blue-600 shrink-0" />
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