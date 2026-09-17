//(UP-041 | Lista para gestionar)
import React, { useEffect } from "react";
import { useFriendshipStore } from "../store/useFriendshipStore";

export const PendingRequestsList = () => {
  const {
    pendingRequests,
    fetchPendingRequests,
    respondRequest,
    loading,
    error,
  } = useFriendshipStore();

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleAction = async (requestId, status) => {
    await respondRequest(requestId, status);
  };

  if (loading && pendingRequests.length === 0) {
    return <div>Cargando solicitudes...</div>;
  }

  return (
    <div>
      <h2>Solicitudes de Amistad Pendientes</h2>

      {error && <div>Error: {error}</div>}

      {pendingRequests.length === 0 ? (
        <p>No tienes solicitudes pendientes.</p>
      ) : (
        <ul>
          {pendingRequests.map((req) => (
            <li key={req.id}>
              {/* Datos del emisor */}
              <div>
                {req.sender?.avatarUrl && (
                  <img
                    src={req.sender.avatarUrl}
                    alt={req.sender.username}
                    width="40"
                    height="40"
                  />
                )}
                <span>
                  {req.sender?.username || `Usuario #${req.senderId}`}
                </span>
                <small>
                  {req.createdAt
                    ? new Date(req.createdAt).toLocaleDateString()
                    : ""}
                </small>
              </div>

              {/* Botones de acción */}
              <div>
                <button
                  onClick={() => handleAction(req.id, "ACCEPTED")}
                  disabled={loading}
                >
                  Aceptar
                </button>
                <button
                  onClick={() => handleAction(req.id, "REJECTED")}
                  disabled={loading}
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
