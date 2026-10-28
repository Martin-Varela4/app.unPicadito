import { useState, useEffect } from "react";
import { ChatComponent } from "../components/Chat"; 
import { getFriendsChat } from "../services/messajeService";
import { mapUserToProfile } from "../../profile/services/profileMapper";
import { useAuthStore } from "../../auth/store/useAuthStore";
import Avatar from "../../../components/ui/Avatar";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingState from "../../../components/ui/LoadingState";

export function MessagesPage() {
  const user = useAuthStore((state) => state.user);
  const currentUserProfile = user ? mapUserToProfile(user) : null;
  const [misAmigos, setMisAmigos] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadFriends = async () => {
      if (!currentUserProfile?.id) {
        setLoading(false);
        return;
      }
      try {
        const response = await getFriendsChat(currentUserProfile.id);
        if (active && response) {
          const list = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];
          setMisAmigos(list);
        }
      } catch (error) {
        console.error("Error al inicializar la pantalla de mensajería:", error.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFriends();
    return () => {
      active = false;
    };
  }, [currentUserProfile?.id]);

  if (loading) {
    return <LoadingState label="Cargando entorno de chat..." className="py-20" />;
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] min-h-[500px] max-w-6xl rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] overflow-hidden shadow-sm">
      {/* Sidebar de contactos */}
      <div className="w-full sm:w-[320px] shrink-0 border-r border-[var(--color-border-subtle)] bg-slate-900/40 flex flex-col">
        {/* Cabecera del usuario actual */}
        <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center gap-3 bg-[var(--color-background-card)]">
          <Avatar 
            src={currentUserProfile?.avatar} 
            alt={`Foto de perfil de ${currentUserProfile?.name || 'usuario'}`} 
            className="w-10 h-10 rounded-full object-cover border border-[var(--color-border-subtle)]" 
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-slate-100 truncate">{currentUserProfile?.name || "Usuario"}</h4>
            <span className="text-xs text-slate-400 truncate block">@{currentUserProfile?.username || "usuario"}</span>
          </div>
        </div>
        
        {/* Lista de amigos / chats */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
          {misAmigos.length === 0 ? (
            <p className="p-4 text-center text-slate-400 text-sm">No tienes chats activos.</p>
          ) : (
            misAmigos.map((amigo) => {
              const isSelected = selectedFriend?.id === amigo.id;
              return (
                <div 
                  key={amigo.id} 
                  onClick={() => setSelectedFriend(amigo)}
                  className={`p-3.5 cursor-pointer transition-colors flex flex-col gap-0.5 ${
                    isSelected
                      ? "bg-slate-800 border-l-4 border-[var(--color-brand-primary)] text-white"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <strong className="text-sm font-semibold truncate text-slate-100">
                    {amigo.nombreUsuario || amigo.nombre}
                  </strong>
                  <span className="text-xs text-slate-400 truncate">
                    {amigo.posicionPrincipal || "Jugador"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Área del chat principal */}
      <div className="flex-1 hidden sm:flex justify-center items-center bg-[var(--color-background-main)]/40 p-4">
        {selectedFriend && currentUserProfile ? (
          <ChatComponent 
            currentUserId={currentUserProfile.id} 
            receiverId={selectedFriend.id}
            receiverName={selectedFriend.nombreUsuario || selectedFriend.nombre}
          />
        ) : (
          <EmptyState
            icon="💬"
            title="Selecciona una conversación"
            description="Elegí un contacto de la lista para chatear en tiempo real."
          />
        )}
      </div>
    </div>
  );
}
