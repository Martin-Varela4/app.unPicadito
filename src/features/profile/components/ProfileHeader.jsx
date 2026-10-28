import { useState } from "react";
import { Pencil } from "lucide-react";
import Avatar from "../../../components/ui/Avatar";
import Button from "../../../components/ui/Button";
import { DEFAULT_PROFILE_COVER_URL } from "../constants/profileConstants";

export function ProfileHeader({ player, isOwnProfile, onEditClick }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] shadow-md">
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-r from-[var(--color-brand-dark)] to-[var(--color-brand-green)] sm:h-52">
        {!imgError ? (
          <img 
            src={player.coverImage || DEFAULT_PROFILE_COVER_URL} 
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

        {isOwnProfile && (
          <Button 
            onClick={onEditClick}
            variant="primary"
            className="gap-2"
          >
            <Pencil size={16} />
            Editar Perfil
          </Button>
        )}
      </div>
    </div>
  );
}
