import React, { useState } from "react";
import { Pencil } from "lucide-react";

export function ProfileHeader({ player, isOwnProfile, onEditClick }) {
  const [imgError, setImgError] = useState(false);
  const defaultCover = "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
      <div className="h-44 w-full overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-800 relative">
        {!imgError ? (
          <img 
            src={player.coverImage || defaultCover} 
            alt="Cancha de fútbol" 
            className="w-full h-full object-cover"
            onError={() => setImgError(true)} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/90 text-sm font-semibold tracking-wide">
            Imagen de portada no disponible
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
        
        <div className="-mt-16 mb-3 h-28 w-28 rounded-full border-4 border-white bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-md overflow-hidden">
          {player.avatar ? (
            <img 
              src={player.avatar} 
              alt={`Foto de perfil de ${player.name}`} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span>{player.name ? player.name.charAt(0) : 'U'}</span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-800">{player.name}</h1>
        <p className="text-sm text-slate-500 mb-5">@{player.username || 'usuario'}</p>

        {/* boton de editar PARA FUTURO UP-054*/} 
        {isOwnProfile && (
          <button 
            onClick={onEditClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm text-sm"
          >
            <Pencil size={16} />
            Editar Perfil
          </button>
        )}
      </div>
    </div>
  );
}