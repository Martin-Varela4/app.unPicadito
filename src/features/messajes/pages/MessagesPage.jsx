import { useState, useEffect } from "react";
import axios from "axios";
import { ChatComponent } from "../components/Chat"
import { mapUserToProfile } from "../../profile/services/profile.mapper"
import { getMyProfile } from "../../profile/services/profile.service"

export function MessagesPage() {
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [misAmigos, setMisAmigos] = useState([]);
    const [selectedFriendId, setSelectedFriendId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEnviroment = async () => {
            try {
                //peticion al servicio
                const rawUserData = await getMyProfile();

                //peticion al mapeador
                const mappedProfile = mapUserToProfile(rawUserData);
                setCurrentUserProfile(mappedProfile);

                //buscar amigos y chats
                const friendResponse = await axios.get(`http://localhost:3000/api/friendships/${mappedProfile.id}`);
                if (friendResponse.data) {
                    setMisAmigos(friendResponse.data);
                }
            } catch (error) {
                console.error("Error al inicializar el mensajero: ", error.message);
            } finally {
                setLoading(false);
            }
        };

        loadEnviroment();
    }, []);
    if (loading) {
        return <div style={{ textAlign: "center", padding: "20px" }}>Cargando Chat---</div>
    }

    return (
        <div style={styles.pageContainer}>
            {/*sidebar*/}
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    {/*Avatar obtenido del mapeado*/}
                    <img
                    src={currentUserProfile?.avatar || "https://www.shutterstock.com/es/image-vector/avatar-profile-interface-display-default-2686603347"}
                    alt="Tu Perfil"
                    style={styles.userAvatar}
                    />
                    <div>
                        <h4 style={{ margin: 0 }}>{currentUserProfile?.name}</h4>
                        <span style={{ fontSize: "12px", color: "hsl(244, 94%, 12%)" }}>@{currentUserProfile?.username}</span>
                    </div>
                </div>

                <div style={styles.friendList}>
                    {misAmigos.length === 0 ? (
                        <p style={{ padding: "15px", color: "#888" }}> No hay chats activos</p>
                    ) : (
                      misAmigos.map((amigo) => (
                        <div
                        key={amigo.id}
                        onClick={() => setSelectedFriendId(amigo.id)}
                        style={{
                            ...styles.friendCard,
                            background: selectedFriendId === amigo.id ? "#e5e5ea" : "transparent"
                        }}
                        >
                            <strong>{amigo.nombreUsuario || amigo.nombre}</strong>
                            <span style={{ fontSize: "12p", color: "#646363" }}>{amigo.posicionPrincipal}</span>
                        </div>
                      ))
                    )}
                </div>
            </div>

            {/* caja de chat*/}
            <div style={styles.chatArea}>
                {selectedFriendId ? (
                    <chatComponent

                    currentUserId={currentUserProfile.id}
                    receiverId={selectedFriendId}
                    />
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <h3>Amigos</h3>
                        <p style={{ color: "#857e7e" }}>conexion</p>
                    </div>
                )}
            </div>
        </div>
    );
}

//estilo (por ahora)
const styles = {
  pageContainer: { display: "flex", height: "100vh", width: "100vw", fontFamily: "Arial, sans-serif" },
  sidebar: { width: "320px", background: "#fff", borderRight: "1px solid #ddd", display: "flex", flexDirection: "column" },
  sidebarHeader: { padding: "15px", background: "#f0f2f5", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", gap: "12px" },
  userAvatar: { width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" },
  friendsList: { flex: 1, overflowY: "auto" },
  friendCard: { padding: "15px", borderBottom: "1px solid #f0f0f0", cursor: "pointer", display: "flex", flexDirection: "column", gap: "4px" },
  chatArea: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "#efeae2" }
};
