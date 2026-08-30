import React from "react";
import { useFriendStore } from "../store/useFriendStore";
import { toast } from "react-hot-toast";

export const FriendRequestCard = ({ request }) => {
  const { respondToRequest, actionLoading } = useFriendStore();
  const { id, sender } = request;

  const isLoading = actionLoading[id] || false;

  const handleResponse = async (action) => {
    const result = await respondToRequest(id, action);
    if (result && !result.success) {
      toast.error(`No se pudo procesar: ${result.error}`);
    } else {
      toast.success(
        action === "accept" ? "Solicitud aceptada" : "Solicitud rechazada",
      );
    }
  };

  return (
    <div className="flex items-center justify-between py-4 gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <img
          src={sender.avatar || "https://placeholder.com"}
          alt={sender.nombre}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">
            {sender.nombre}
          </h4>
          <p className="text-xs text-gray-500">Recibida: {sender.fecha}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleResponse("accept")}
          disabled={isLoading}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 text-white text-xs font-medium rounded-lg transition-colors"
        >
          Aceptar
        </button>
        <button
          onClick={() => handleResponse("reject")}
          disabled={isLoading}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-300 transition-colors"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
};
