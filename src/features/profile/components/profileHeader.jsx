import { useState } from "react";
import { Pencil } from "lucide-react";
import Avatar from "../../../components/ui/Avatar";

export function ProfileHeader({ player, isOwnProfile, onEditClick }) {
  const [imgError, setImgError] = useState(false);
  const defaultCover = "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] shadow-md">
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-r from-[var(--color-brand-dark)] to-[var(--color-brand-green)] sm:h-52">
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
        
        <div className="-mt-16 mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--color-background-card)] bg-[var(--color-brand-green)] text-3xl font-bold text-white shadow-md">
          <Avatar
            src={player.avatar}
            alt={`Foto de perfil de ${player.name || "usuario"}`}
            className="h-full w-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold text-slate-100">{player.name}</h1>
        <p className="text-sm text-slate-400 mb-5">@{player.username || 'usuario'}</p>

        {/* boton de editar PARA FUTURO UP-054*/} 
        {isOwnProfile && (
          <button 
            onClick={onEditClick}
            className="flex min-h-11 items-center gap-2 rounded-md bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-medium text-[#21263A] shadow-sm transition hover:bg-[var(--color-brand-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Pencil size={16} />
            Editar Perfil
          </button>
        )}
      </div>
    </div>
  );
}