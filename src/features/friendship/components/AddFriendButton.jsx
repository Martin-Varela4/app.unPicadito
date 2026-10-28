//(UP-036 | Acción de enviar)
import { useState } from "react";
import { useFriendshipStore } from "../store/useFriendshipStore";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

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
    <div className="inline-flex flex-col items-start gap-2">
      {/* Notificación simple de error */}
      {errorMessage && <Alert message={errorMessage} />}

      {/* Control del botón según estado */}
      {status === "PENDING" ? (
        <Button disabled variant="outline">Solicitud Enviada</Button>
      ) : (
        <Button onClick={handleSendRequest} disabled={loading} isLoading={loading}>
          Agregar amigo
        </Button>
      )}
    </div>
  );
};
