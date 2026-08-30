import React from "react";
import { useFriendStore } from "../store/useFriendStore";

// Nota: Para los Toasts (Notificación flotante) puedes usar una librería
// simple como 'react-hot-toast' si el profesor les permite agregarla,
// o un alert/custom toast según sus pautas.
import { toast } from "react-hot-toast";

export const FriendRequestButton = ({ userId }) => {
  const { sendFriendRequest, loadingStates, sentRequests } = useFriendStore();

  const isLoading = loadingStates[userId] || false;
  const isSent = sentRequests[userId] || false;

  const handleAction = async () => {
    const result = await sendFriendRequest(userId);

    // 5. Mostrar notificación flotante (Toast) si hay error
    if (result && !result.success) {
      toast.error(`Error: ${result.error}`);
    }
  };

  return (
    // 1. Diseñar la interfaz del botón
    <button
      onClick={handleAction}
      disabled={isLoading || isSent}
      className={`flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors
        ${
          isSent
            ? "bg-green-100 text-green-700 border border-green-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300"
        }`}
    >
      {/* 2. Controlar estado visual de carga (spinner SVG con Tailwind) */}
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://w3.org"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {/* 4. Cambiar diseño del botón al completar con éxito */}
      {isSent ? "Solicitud Enviada" : "Enviar solicitud"}
    </button>
  );
};
