//(UP-036 | Acción de enviar)
import React, { useState } from "react";
import { useFriendshipStore } from "../store/useFriendshipStore";

export const AddFriendButton = ({ receiverId, initialStatus = "NONE" }) => {
  const { sendRequest, loading } = useFriendshipStore();
  const [status, setStatus] = useState(initialStatus); // 'NONE' | 'PENDING'
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSendRequest = async () => {
    setErrorMessage(null);
    const result = await sendRequest(receiverId);

    if (result.success) {
      setStatus("PENDING");
    } else {
      setErrorMessage(result.error);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  return (
    <div>
      {/* Notificación simple de error */}
      {errorMessage && (
        <div role="alert">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Control del botón según estado */}
      {status === "PENDING" ? (
        <button disabled>Solicitud Enviada</button>
      ) : (
        <button onClick={handleSendRequest} disabled={loading}>
          {loading ? "Cargando..." : "Agregar amigo"}
        </button>
      )}
    </div>
  );
};
