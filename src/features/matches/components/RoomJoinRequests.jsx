import { Check, X, Clock, Star } from "lucide-react";

export const RoomJoinRequests = ({
  requests = [],
  onAccept,
  onReject,
}) => {
  if (requests.length === 0) {
    return (
      <section className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base">
            Solicitudes de ingreso
          </h3>

          <span className="text-sm text-slate-500">
            0 pendientes
          </span>
        </div>

        <div className="py-8 text-center text-slate-500">
          No hay solicitudes pendientes
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
      
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Solicitudes de ingreso
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Jugadores que quieren unirse
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
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
              className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              
              {/* Datos del usuario */}
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-semibold text-slate-900">
                    {user.name}
                  </h4>

                  <p className="text-sm text-slate-500">
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
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                >
                  <Check size={16} />
                  Aceptar
                </button>

                <button
                  type="button"
                  onClick={() => onReject(request)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-semibold hover:bg-red-200 transition"
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