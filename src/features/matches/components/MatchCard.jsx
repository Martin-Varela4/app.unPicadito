import Badge from "../../../components/Badge";
import ProgressBar from "../../../components/ProgressBar";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useCancelRoom } from "../hooks/useCancelRoom";

export default function MatchCard({ match, leaveMatch, isLeaving, leaveError, onMatchLeft, joinMatch, joiningMatchId }) {
  const isComplete = match.estado === "COMPLETA";
  const cannotJoin = isComplete && !match.permiteSuplentes;
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const isOwner = currentUser?.id === match.creador?.id || currentUser?.id === match.creadorId;
  const isJoined = Boolean(match.unidoPorUsuarioActual) || isOwner;

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const { executeCancel, isCanceling, error: cancelError, setError: setCancelError } = useCancelRoom();


  const isWithin24Hours = () => {
    if (!match.fechaHoraPartido) return false;
    const matchDateTime = new Date(match.fechaHoraPartido);
    const now = new Date();
    const diffHours = (matchDateTime - now) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const isBlocked = isWithin24Hours();

  const handleLeave = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas cancelar tu participación en esta sala?",
      )
    ) {
      try {
        await leaveMatch(match.id);
        if (onMatchLeft) {
          onMatchLeft(match.id);
        }
      } catch (err) { }
    }
  };

  // Formatear fechas para mostrar en pantalla
  const fechaStr = match.fechaHoraPartido
    ? new Date(match.fechaHoraPartido).toLocaleDateString('es-AR')
    : '—';

  const horaStr = match.fechaHoraPartido
    ? new Date(match.fechaHoraPartido).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    : '—';

  const currentPlayers = match.participantes?.length || 0;
  const organizerName = match.creador?.nombre || "Organizador";

  const handleJoin = () => {
    joinMatch(match.id);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Usamos el estado real que viene de la base de datos */}
        <Badge label={match.estado} variant="status" value={match.estado} />
        {match.esPublica ? (
          <Badge label="Pública" variant="modality" value="public" />
        ) : (
          <Badge label="Privada" variant="modality" value="private" />
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">{match.nombre}</h3>
          <p className="text-sm text-slate-500">
            {match.nombreCancha} · {match.direccion || "Sin dirección"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          📅 {fechaStr} · 🕐 {horaStr}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-medium">Jugadores</span>
          <span className="text-slate-900 font-semibold">
            {currentPlayers}/{match.cuposTotales}
          </span>
        </div>
        <ProgressBar current={currentPlayers} max={match.cuposTotales} />
      </div>
      {leaveError && <p className="text-red-500 text-xs">{leaveError}</p>}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <span className="text-xs text-slate-400">por {organizerName}</span>
        <Button
          variant={isJoined ? "outline" : "primary"}
          onClick={
            isJoined
              ? () => navigate(`/rooms/${match.id}`)
              : handleJoin
          }
          disabled={
            !isJoined &&
            (cannotJoin || joiningMatchId === match.id)
          }
        >
          {isJoined
            ? "Ver partido"
            : cannotJoin
              ? "Sin lugares"
              : joiningMatchId === match.id
                ? "Uniéndome..."
                : "Unirme"}
        </Button>
        {isJoined && (
          <Button
            variant="danger"
            onClick={isOwner ? () => setIsCancelModalOpen(true) : handleLeave}
            disabled={(isOwner ? isCanceling : isLeaving) || isBlocked}
            title={
              isBlocked
                ? "No puedes salir/cancelar con menos de 24hs de anticipación"
                : ""
            }
          >
            {isBlocked
              ? "Fuera de término"
              : isOwner
                ? (isCanceling ? "Cancelando..." : "Cancelar")
                : (isLeaving ? "Saliendo..." : "Salir")}
          </Button>
        )}
      </div>

      <ConfirmModal
          isOpen={isCancelModalOpen}
          onClose={() => { setIsCancelModalOpen(false); setCancelError(''); setCancelReason(''); }}
          title="¿Cancelar la sala?"
      >
          <div className="flex flex-col gap-4 text-left">
              <p className="text-gray-600">
                  Esta acción no se puede deshacer. Indica el motivo de fuerza mayor:
              </p>
              <textarea
                  className={`w-full p-2 border rounded-md resize-none ${cancelError ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                  value={cancelReason}
                  placeholder="Ej: La cancha cerró por tormenta eléctrica."
                  onChange={(e) => {
                      setCancelReason(e.target.value);
                      if (cancelError) setCancelError('');
                  }}
              />
              {cancelError && <span className="text-red-500 text-sm">{cancelError}</span>}
              <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" onClick={() => setIsCancelModalOpen(false)} disabled={isCanceling}>
                      Volver
                  </Button>
                  <Button
                      variant="danger"
                      onClick={async () => {
                          if (cancelReason.length < 10) {
                              setCancelError("El motivo debe tener al menos 10 caracteres.");
                              return;
                          }
                          const { success } = await executeCancel(match.id, cancelReason);
                          if (success) {
                              setIsCancelModalOpen(false);
                              if (onMatchLeft) onMatchLeft(match.id);
                              else window.location.reload();
                          }
                      }}
                      disabled={isCanceling || cancelReason.length < 10}
                  >
                      {isCanceling ? 'Cancelando...' : 'Confirmar'}
                  </Button>
              </div>
          </div>
      </ConfirmModal>
    </div>
  );
}