//(UP-041 | Lista para gestionar)
import { useEffect } from "react";
import { useFriendshipStore } from "../store/useFriendshipStore";
import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";

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
    return <div role="status" className="py-6 text-center text-sm text-slate-300">Cargando solicitudes...</div>;
  }

  return (
    <section className="space-y-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-100">Solicitudes de Amistad Pendientes</h2>

      {error && <div role="alert" className="rounded-sm border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">Error: {error}</div>}

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
                  disabled={loading}
                  isLoading={loading}
                >
                  Aceptar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction(req.id, "REJECTED")}
                  disabled={loading}
                >
                  Rechazar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
