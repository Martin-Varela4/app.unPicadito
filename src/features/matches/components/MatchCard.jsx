import Badge from "../../../components/ui/Badge";
import ProgressBar from "../../../components/ui/ProgressBar";
import Button from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useCancelRoom } from "../hooks/useCancelRoom";

export default function MatchCard({ match, leaveMatch, isLeaving, leaveError, onMatchLeft, joinMatch, joiningMatchId }) {
  const isPastMatch = Boolean(match.fechaHoraPartido && new Date(match.fechaHoraPartido) <= new Date());
  const isComplete = match.estado === "COMPLETA";
  const cannotJoin = isPastMatch || (isComplete && !match.permiteSuplentes);
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
      } catch {
        return;
      }
    }
  };

  // Formatear fechas para mostrar en pantalla
  const fechaStr = match.fechaHoraPartido
    ? new Date(match.fechaHoraPartido).toLocaleDateString('es-AR')
    : '—';

  const horaStr = match.fechaHoraPartido
    ? new Date(match.fechaHoraPartido).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    : '—';

  const currentPlayers = match.cuposOcupados ?? match.participantes?.length ?? 0;
  const organizerName = match.creador?.nombre || "Organizador";

  const handleJoin = () => {
    joinMatch(match.id);
  };

  const handleCardClick = (event) => {
    if (event.target.closest('button, a, input, select, textarea, [role="dialog"]')) return;
    navigate(`/salas/${match.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group flex cursor-pointer flex-col gap-3 rounded-sm transition duration-200 hover:border-[var(--color-brand-primary)]/50 hover:shadow-[0_0_12px_rgba(208,211,77,0.12)] focus-within:border-[var(--color-brand-primary)]/60 focus-within:shadow-[0_0_12px_rgba(208,211,77,0.12)]"
    >
      <CardContent className="flex h-full flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Usamos el estado real que viene de la base de datos */}
        <Badge label={match.estado} variant="status" value={match.estado} />
        {match.esPublica ? (
          <Badge label="Pública" variant="modality" value="public" />
        ) : (
          <Badge label="Privada" variant="modality" value="private" />
        )}

        {isOwner ? (
          <Badge label="Organizás" variant="status" value="organizas" />
        ) : isJoined && (
          <Badge label="Sos parte" variant="status" value="confirmado" />
        )}
      </div>

      <div className="mt-1 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white transition-colors group-hover:text-[var(--color-brand-primary)]">
            <Link
              to={`/salas/${match.id}`}
              className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
              title="Ver detalles de la sala"
            >
              {match.nombre}
            </Link>
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {match.nombreCancha} · {match.direccion || "Sin dirección"}
          </p>
        </div>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-sm text-slate-400">
        <span>
          📅 {fechaStr} · 🕐 {horaStr}
        </span>
      </div>
      <div className="mt-1 flex flex-col gap-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium">Jugadores</span>
          <span className="text-white font-semibold">
            {currentPlayers}/{match.cuposTotales}
          </span>
        </div>
        <ProgressBar current={currentPlayers} max={match.cuposTotales} />
      </div>
      {leaveError && <p className="text-red-500 text-xs mt-1">{leaveError}</p>}
      <div className="mt-auto flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="truncate text-xs text-slate-400">por {organizerName}</span>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Botón secundario para ver el detalle de la sala siempre disponible */}
          {!isJoined && (
            <Button
              variant="outline"
              onClick={() => navigate(`/salas/${match.id}`)}
            >
              Ver partido
            </Button>
          )}

          <Button
            variant={isJoined ? "outline" : "primary"}
            onClick={
              isJoined
                ? () => navigate(`/salas/${match.id}`)
                : handleJoin
            }
            disabled={
              !isJoined &&
              (cannotJoin || joiningMatchId === match.id)
            }
          >
            {isJoined
              ? "Ir a mi sala"
              : isPastMatch
                ? "Finalizado"
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
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => { setIsCancelModalOpen(false); setCancelError(''); setCancelReason(''); }}
        title="¿Cancelar la sala?"
      >
        <div className="flex flex-col gap-4 text-left">
          <p className="text-slate-300">
            Esta acción no se puede deshacer. Indica el motivo de fuerza mayor:
          </p>
          <textarea
            className={`w-full p-2 border rounded-md resize-none bg-slate-800 text-white ${cancelError ? 'border-red-500' : 'border-slate-700'}`}
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
      </CardContent>
    </Card>
  );
}