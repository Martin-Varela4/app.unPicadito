import { Check, X, Clock, Star } from "lucide-react";
import Avatar from "../../../components/ui/Avatar";
import Button from "../../../components/ui/Button";
import SectionCard from "../../../components/ui/SectionCard";

export const RoomJoinRequests = ({
  requests = [],
  onAccept,
  onReject,
}) => {
  if (requests.length === 0) {
    return (
      <SectionCard
        title="Solicitudes de ingreso"
        headerAction={<span className="text-sm text-slate-400">0 pendientes</span>}
      >
        <div className="py-8 text-center text-slate-400">
          No hay solicitudes pendientes
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Solicitudes de ingreso"
      headerAction={
        <span className="bg-blue-900/40 text-sky-300 px-3 py-1 rounded-full text-sm font-semibold">
          {requests.length} pendientes
        </span>
      }
    >
      <div className="space-y-3">
        {requests.map((request) => {
          const user = request.user || {};

          return (
            <div
              key={request.id}
              className="border border-[var(--color-border-subtle)] rounded-md p-4 flex flex-col sm:flex-row sm:items-center gap-4 bg-[var(--color-background-main)]/50"
            >
              {/* Datos del usuario */}
              <div className="flex items-center gap-3 flex-1">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-semibold text-slate-100">
                    {user.name}
                  </h4>

                  <p className="text-sm text-slate-400">
                    {user.username}
                  </p>

                  <div className="flex items-center gap-1 mt-1 text-sm text-amber-400">
                    <Star
                      size={14}
                      fill="currentColor"
                    />

                    <span>
                      {user.rating ?? "Sin rating"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Clock size={15} />
                <span>Solicitud pendiente</span>
              </div>

              {/* Aceptar / Rechazar */}
              <div className="flex gap-2">
                <Button
                  onClick={() => onAccept(request)}
                  className="gap-2"
                >
                  <Check size={16} />
                  Aceptar
                </Button>

                <Button
                  onClick={() => onReject(request)}
                  variant="danger"
                  className="gap-2"
                >
                  <X size={16} />
                  Rechazar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};
