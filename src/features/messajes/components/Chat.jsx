import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../../../services/socket";

export function ChatComponent({ currentUserId, receiverId }) {
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
                const response = await axios.get(`http://localhost:3000/api/messages/${currentUserId}/${receiverId}`);
                if (response.data.success) {
                    setMessages(response.data.data);
                }
            } catch (error) {
                console.error("Error al recuperar el historial mediante Axios:", error);
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
            content: inputText,
        };

        socket.emit("send_message", messagePayload);
        setInputText(""); 
    };

    return (
        /* chatContainer: flex flex-col h-[500px] w-[380px] border border-[#ccc] rounded-lg overflow-hidden font-sans */
        <div className="flex flex-col h-[500px] w-[380px] border border-[#ccc] rounded-lg overflow-hidden font-sans">
            
            {/* header: bg-[#1f1f1f] text-white p-[10px_15px] m-0 */}
            <div className="bg-[#1f1f1f] text-white p-[10px_15px] m-0">
                <h3 className="text-base font-bold">Chat con Usuario #{receiverId}</h3>
            </div>

            {/* messagesBox: flex-1 p-3.5 overflow-y-auto flex flex-col gap-2.5 bg-[#f9f9f9] */}
            <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-2.5 bg-[#f9f9f9]">
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        /* messageBubble: p-[9px_14px] rounded-[15px] max-w-[75%] break-words */
                        <div
                            key={msg.id || index}
                            className={`p-[9px_14px] rounded-[15px] max-w-[75%] break-words ${
                                isMe
                                    ? "bg-[#0078ff] text-white self-end"
                                    : "bg-[#e5e5ea] text-black self-start"
                            }`}
                        >
                            {msg.content}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* form: flex p-2.5 border-t border-[#ccc] bg-white */}
            <form onSubmit={handleSendMessage} className="flex p-2.5 border-t border-[#ccc] bg-white">
                {/* input: flex-1 p-2.5 rounded border border-[#ccc] outline-none */}
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 p-2.5 rounded border border-[#ccc] outline-none text-sm text-black"
                />
                {/* button: ml-2 p-[10px_16px] bg-[#0078ff] text-white border-none rounded cursor-pointer font-bold */}
                <button 
                    type="submit" 
                    className="ml-2 p-[10px_16px] bg-[#0078ff] text-white border-none rounded cursor-pointer font-bold text-sm"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}
