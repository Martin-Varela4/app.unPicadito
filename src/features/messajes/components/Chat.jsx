import { useEffect, useState, useRef } from "react";
import { getChatHistory } from "../services/messajeService";
import { socket } from "../../../services/socket";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export function ChatComponent({ currentUserId, receiverId, receiverName }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("user_register", currentUserId);

        const loadChatHistory = async () => {
            try {
                const response = await getChatHistory(currentUserId, receiverId);
                if (response?.success && Array.isArray(response.data)) {
                    setMessages(response.data);
                } else if (Array.isArray(response?.data)) {
                    setMessages(response.data);
                } else if (Array.isArray(response)) {
                    setMessages(response);
                }
            } catch (error) {
                console.error("Error al recuperar el historial:", error);
            }
        };

        loadChatHistory();

        socket.on("receive_message", (newMessage) => {
            if (newMessage.senderId === receiverId) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });

        socket.on("message_sent", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("receive_message");
            socket.off("message_sent");
        };
    }, [currentUserId, receiverId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const messagePayload = {
            senderId: currentUserId,
            receiverId: receiverId,
            content: inputText.trim(),
        };

        socket.emit("send_message", messagePayload);
        setInputText(""); 
    };

    return (
        <div className="flex flex-col h-[520px] w-full max-w-lg rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-slate-800/90 border-b border-[var(--color-border-subtle)] px-4 py-3 text-slate-100 flex items-center justify-between">
                <h3 className="text-base font-semibold">
                    {receiverName ? `Chat con ${receiverName}` : `Chat con Usuario #${receiverId}`}
                </h3>
            </div>

            {/* Messages box */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[var(--color-background-main)]/60">
                {messages.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
                        No hay mensajes anteriores. ¡Comenzá la conversación!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div
                                key={msg.id || index}
                                className={`p-2.5 px-3.5 rounded-xl max-w-[75%] break-words text-sm shadow-sm ${
                                    isMe
                                        ? "bg-[var(--color-brand-primary)] text-[#21263A] font-medium self-end rounded-tr-xs"
                                        : "bg-slate-800 text-slate-100 border border-[var(--color-border-subtle)] self-start rounded-tl-xs"
                                }`}
                            >
                                {msg.content}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-background-card)]">
                <Input
                    name="message"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1"
                />
                <Button type="submit" disabled={!inputText.trim()} className="shrink-0 min-h-11">
                    Enviar
                </Button>
            </form>
        </div>
    );
}
