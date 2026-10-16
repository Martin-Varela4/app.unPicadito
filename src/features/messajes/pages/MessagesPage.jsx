import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatComponent } from "../components/Chat"; 
import { mapUserToProfile } from "../../profile/services/profile.mapper";
import { getMyProfile } from "../../profile/services/profile.service";

export function MessagesPage() {
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [misAmigos, setMisAmigos] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnvironment = async () => {
      try {
        const rawUserData = await getMyProfile();
        const mappedProfile = mapUserToProfile(rawUserData);
        setCurrentUserProfile(mappedProfile);

        const friendsResponse = await axios.get(`http://localhost:3000/api/friendships/${mappedProfile.id}`);
        if (friendsResponse.data) {
          setMisAmigos(friendsResponse.data); 
        }
      } catch (error) {
        console.error("Error al inicializar la pantalla de mensajería:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadEnvironment();
  }, []);

  if (loading) {
    return <div className="text-center p-5 font-sans">Cargando entorno de chat... ⚽</div>;
  }

  return (
    /* pageContainer: flex h-screen w-screen font-sans */
    <div className="flex h-screen w-screen font-sans text-black">
      
      {/* sidebar: w-[320px] bg-white border-r border-[#ddd] flex flex-col */}
      <div className="w-[320px] bg-white border-r border-[#ddd] flex flex-col">
        
        {/* sidebarHeader: p-[15px] bg-[#f0f2f5] border-b border-[#ddd] flex items-center gap-3 */}
        <div className="p-[15px] bg-[#f0f2f5] border-b border-[#ddd] flex items-center gap-3">
          {/* userAvatar: w-10 h-10 rounded-full object-cover */}
          <img 
            src={currentUserProfile?.avatar || "https://placeholder.com"} 
            alt="Tu perfil" 
            className="w-10 h-10 rounded-full object-cover" 
          />
          <div>
            <h4 className="m-0 font-bold text-sm">{currentUserProfile?.name}</h4>
            <span className="text-xs text-gray-500">@{currentUserProfile?.username}</span>
          </div>
        </div>
        
        {/* friendsList: flex-1 overflow-y-auto */}
        <div className="flex-1 overflow-y-auto">
          {misAmigos.length === 0 ? (
            <p className="p-[15px] text-[#888] text-sm">No tienes chats activos.</p>
          ) : (
            misAmigos.map((amigo) => (
              /* friendCard: p-[15px] border-b border-[#f0f0f0] cursor-pointer flex flex-col gap-1 */
              <div 
                key={amigo.id} 
                onClick={() => setSelectedFriendId(amigo.id)}
                className="p-[15px] border-b border-[#f0f0f0] cursor-pointer flex flex-col gap-1"
                style={{ 
                  backgroundColor: selectedFriendId === amigo.id ? "#e5e5ea" : "transparent" 
                }}
              >
                <strong className="text-sm">{amigo.nombreUsuario || amigo.nombre}</strong>
                <span className="text-xs text-[#666]">{amigo.posicionPrincipal}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* chatArea: flex-1 flex justify-center items-center bg-[#efeae2] */}
      <div className="flex-1 flex justify-center items-center bg-[#efeae2]">
        {selectedFriendId ? (
          <ChatComponent 
            currentUserId={currentUserProfile.id} 
            receiverId={selectedFriendId} 
          />
        ) : (
          /* centerText: text-center p-5 */
          <div className="text-center p-5">
            <h3 className="text-lg font-bold">Selecciona una conversación para chatear 💬</h3>
            <p className="text-sm text-[#666] mt-1">Conexión cifrada en tiempo real</p>
          </div>
        )}
      </div>
    </div>
  );
}
