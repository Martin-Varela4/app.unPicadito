//(UP-041 | Lista para gestionar)
import { useEffect } from "react";
import { useFriendshipStore } from "../store/useFriendshipStore";
import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";
import SectionCard from "../../../components/ui/SectionCard";
import LoadingState from "../../../components/ui/LoadingState";
import ErrorAlert from "../../../components/ui/ErrorAlert";

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
    return <LoadingState label="Cargando solicitudes..." className="py-6" />;
  }

  return (
    <SectionCard title="Solicitudes de Amistad Pendientes" hasDivider={false} className="space-y-4">
      {error && <ErrorAlert message={`Error: ${error}`} />}

      {pendingRequests.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">No tienes solicitudes pendientes.</p>
      ) : (
        <ul className="space-y-3">
          {pendingRequests.map((req) => (
            <li key={req.id} className="flex flex-col gap-4 rounded-sm border border-[var(--color-border-subtle)] p-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Datos del emisor */}
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  src={req.sender?.avatarUrl}
                  alt={`Foto de perfil de ${req.sender?.username || "usuario"}`}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <span className="min-w-0 break-words font-medium text-slate-100">
                  {req.sender?.username || `Usuario #${req.senderId}`}
                </span>
                <small className="shrink-0 text-xs text-slate-400">
                  {req.createdAt
                    ? new Date(req.createdAt).toLocaleDateString()
                    : ""}
                </small>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleAction(req.id, "ACCEPTED")}
                  variant="primary"
                  className="min-h-10 px-3 py-1.5 text-xs"
                >
                  Aceptar
                </Button>
                <Button
                  onClick={() => handleAction(req.id, "REJECTED")}
                  variant="outline"
                  className="min-h-10 px-3 py-1.5 text-xs"
                >
                  Rechazar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
};
