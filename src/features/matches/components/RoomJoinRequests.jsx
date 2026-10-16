import { Check, X, Clock, Star } from "lucide-react";
import Avatar from "../../../components/ui/Avatar";

export const RoomJoinRequests = ({
  requests = [],
  onAccept,
  onReject,
}) => {
  if (requests.length === 0) {
    return (
      <section className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-100 text-base">
            Solicitudes de ingreso
          </h3>

          <span className="text-sm text-slate-400">
            0 pendientes
          </span>
        </div>

        <div className="py-8 text-center text-slate-400">
          No hay solicitudes pendientes
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-background-card)] p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-sm">
      
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-100 text-base">
            Solicitudes de ingreso
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Jugadores que quieren unirse
          </p>
        </div>

        <span className="bg-blue-900/40 text-sky-300 px-3 py-1 rounded-full text-sm font-semibold">
          {requests.length} pendientes
        </span>
      </div>

      {/* Lista de solicitudes */}
      <div className="space-y-3">
        {requests.map((request) => {
          const user = request.user;

          return (
            <div
              key={request.id}
              className="border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
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

                  <div className="flex items-center gap-1 mt-1 text-sm text-yellow-600">
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

                <span>
                  Solicitud pendiente
                </span>
              </div>

              {/* Aceptar / Rechazar */}
              <div className="flex gap-2">
                
                <button
                  type="button"
                  onClick={() => onAccept(request)}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[#21263A] transition-colors hover:bg-[var(--color-brand-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Check size={16} />
                  Aceptar
                </button>

                <button
                  type="button"
                  onClick={() => onReject(request)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-900/40 text-red-200 text-sm font-semibold hover:bg-red-200 transition"
                >
                  <X size={16} />
                  Rechazar
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};