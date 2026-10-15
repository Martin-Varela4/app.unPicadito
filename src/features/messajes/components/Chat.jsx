import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../../../services/socket"; // Ajusta la ruta a tu archivo socket.js

export function ChatComponent({ currentUserId, receiverId }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    // 1. Cargar historial con Axios y escuchar WebSockets en tiempo real
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        // Avisar al backend quién se conectó
        socket.emit("user_register", currentUserId);

        // Pedir el historial de mensajes antiguos
        const loadChatHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/messages/${currentUserId}/${receiverId}`);
                if (response.data.success) {
                    setMessages(response.data.data);
                }
            } catch (error) {
                console.error("Error al recuperar el historial mediante Axios:", error);
            }
        };

        loadChatHistory();

        // Escuchar mensajes entrantes del otro usuario
        socket.on("receive_message", (newMessage) => {
            if (newMessage.senderId === receiverId) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });

        // Escuchar la confirmación de nuestro propio mensaje guardado
        socket.on("message_sent", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        // Limpiar eventos al desmontar
        return () => {
            socket.off("receive_message");
            socket.off("message_sent");
        };
    }, [currentUserId, receiverId]);

    // 2. Mover el scroll al último mensaje de forma automática
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 3. Enviar mensaje al pulsar el botón o dar Enter
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const messagePayload = {
            senderId: currentUserId,
            receiverId: receiverId,
            content: inputText,
        };

        socket.emit("send_message", messagePayload);
        setInputText(""); 
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.header}>
                <h3>Chat con Usuario #{receiverId}</h3>
            </div>

            <div style={styles.messagesBox}>
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div
                            key={msg.id || index}
                            style={{
                                ...styles.messageBubble,
                                alignSelf: isMe ? "flex-end" : "flex-start",
                                backgroundColor: isMe ? "#0078ff" : "#e5e5ea",
                                color: isMe ? "#fff" : "#000",
                            }}
                        >
                            {msg.content}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={styles.form}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>
                    Enviar
                </button>
            </form>
        </div>
    );
}

const styles = {
    chatContainer: {
        display: "flex",
        flexDirection: "column",
        height: "500px",
        width: "380px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif"
    },
    header: { background: "#1f1f1f", color: "#fff", padding: "10px 15px", margin: 0 },
    messagesBox: { flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", background: "#f9f9f9" },
    messageBubble: { padding: "9px 14px", borderRadius: "15px", maxWidth: "75%", wordBreak: "break-word" },
    form: { display: "flex", padding: "10px", borderTop: "1px solid #ccc", background: "#fff" },
    input: { flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc", outline: "none" },
    button: { marginLeft: "8px", padding: "10px 16px", background: "#0078ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }
};
