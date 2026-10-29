import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Badge from "../../../components/ui/Badge";
import ProgressBar from "../../../components/ui/ProgressBar";
import Button from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { CancelRoomModal } from "./CancelRoomModal";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { ROOM_STATUS } from "../constants/matchConstants";
import {
  isPastMatch as checkPastMatch,
  isWithin24Hours as checkWithin24Hours,
  formatMatchDate,
  formatMatchTime,
} from "../utils/dateUtils";

export default function MatchCard({
  match,
  leaveMatch,
  isLeaving,
  leaveError,
  onMatchLeft,
  joinMatch,
  joiningMatchId,
}) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const isPast = checkPastMatch(match.fechaHoraPartido);
  const isComplete = match.estado === ROOM_STATUS.COMPLETA;
  const cannotJoin = isPast || (isComplete && !match.permiteSuplentes);
  const myParticipation = match.participantes?.find(
    (p) => (p.usuario?.id || p.userId) === currentUser?.id
  );
  const isOwner = currentUser?.id === match.creador?.id || currentUser?.id === match.creadorId;
  const isPending =
    !isOwner &&
    (Boolean(match.solicitudPendiente) ||
      myParticipation?.estado === "PENDIENTE" ||
      myParticipation?.status === "PENDING");
  const isConfirmed =
    isOwner ||
    Boolean(match.unidoPorUsuarioActual) ||
    myParticipation?.estado === "CONFIRMADO" ||
    myParticipation?.status === "CONFIRMED" ||
    myParticipation?.status === "SUBSTITUTE";
  const isBlocked = checkWithin24Hours(match.fechaHoraPartido);

  const handleConfirmLeave = async () => {
    try {
      if (leaveMatch) await leaveMatch(match.id);
      setIsLeaveModalOpen(false);
      onMatchLeft?.(match.id);
    } catch {
      // Manejado en store/hook
    }
  };

  const handleJoin = () => joinMatch?.(match.id);

  const handleCardClick = (event) => {
    if (event.target.closest('button, a, input, select, textarea, [role="dialog"]')) return;
    navigate(`/salas/${match.id}`);
  };

  const fechaStr = formatMatchDate(match.fechaHoraPartido);
  const horaStr = formatMatchTime(match.fechaHoraPartido);
  const currentPlayers =
    match.cuposOcupados ??
    match.participantes?.filter(
      (p) =>
        p.estado === "CONFIRMADO" ||
        p.status === "CONFIRMED" ||
        p.status === "SUBSTITUTE"
    )?.length ??
    0;

  return (
    <Card
      onClick={handleCardClick}
      className="group flex cursor-pointer flex-col gap-3 rounded-sm transition duration-200 hover:border-[var(--color-brand-primary)]/50 hover:shadow-[0_0_12px_rgba(208,211,77,0.12)] focus-within:border-[var(--color-brand-primary)]/60"
    >
      <CardContent className="flex h-full flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge label={match.estado} variant="status" value={match.estado} />
          <Badge
            label={match.esPublica ? "Pública" : "Privada"}
            variant="modality"
            value={match.esPublica ? "public" : "private"}
          />
          {isOwner ? (
            <Badge label="Organizás" variant="status" value="organizas" />
          ) : isPending ? (
            <Badge label="Solicitud enviada" variant="status" value="solicitud_enviada" />
          ) : isConfirmed ? (
            <Badge label="Sos parte" variant="status" value="confirmado" />
          ) : null}
        </div>

        <div className="mt-1">
          <h3 className="text-base font-bold text-white transition-colors group-hover:text-[var(--color-brand-primary)]">
            <Link to={`/salas/${match.id}`} className="rounded-sm" title="Ver detalles de la sala">
              {match.nombre}
            </Link>
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {match.nombreCancha} · {match.direccion || "Sin dirección"}
          </p>
        </div>

        <div className="mt-1 text-sm text-slate-400">
          <span>📅 {fechaStr} · 🕐 {horaStr}</span>
        </div>

        <div className="mt-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Jugadores</span>
            <span className="text-white font-semibold">{currentPlayers}/{match.cuposTotales}</span>
          </div>
          <ProgressBar current={currentPlayers} max={match.cuposTotales} />
        </div>

        {leaveError && <p className="text-red-500 text-xs mt-1">{leaveError}</p>}

        <div className="mt-auto flex flex-wrap items-center justify-end gap-2 border-t border-[var(--color-border-subtle)] pt-3">
          {!isConfirmed && (
            <Button variant="outline" onClick={() => navigate(`/salas/${match.id}`)}>
              Ver partido
            </Button>
          )}

          {isConfirmed && (
            <Button variant="outline" onClick={() => navigate(`/salas/${match.id}`)}>
              Ir a mi sala
            </Button>
          )}

          {!isConfirmed && !isPending && (
            <Button
              variant="primary"
              onClick={handleJoin}
              disabled={cannotJoin || joiningMatchId === match.id}
            >
              {isPast
                ? "Finalizado"
                : cannotJoin
                  ? "Sin lugares"
                  : joiningMatchId === match.id
                    ? (match.esPublica ? "Uniéndome..." : "Solicitando...")
                    : (match.esPublica ? "Unirme" : "Solicitar")}
            </Button>
          )}

          {isPending && (
            <Button
              variant="danger"
              onClick={() => setIsLeaveModalOpen(true)}
              disabled={isLeaving}
            >
              {isLeaving ? "Cancelando..." : "Cancelar solicitud"}
            </Button>
          )}

          {isConfirmed && (
            <Button
              variant="danger"
              onClick={() => (isOwner ? setIsCancelModalOpen(true) : setIsLeaveModalOpen(true))}
              disabled={isLeaving || isBlocked}
              title={isBlocked ? "No puedes salir/cancelar con menos de 24hs de anticipación" : ""}
            >
              {isBlocked ? "Fuera de término" : isOwner ? "Cancelar" : isLeaving ? "Saliendo..." : "Salir"}
            </Button>
          )}
        </div>

        {isCancelModalOpen && (
          <CancelRoomModal
            isOpen={true}
            onClose={() => setIsCancelModalOpen(false)}
            roomId={match.id}
            onCancelSuccess={() => onMatchLeft?.(match.id) ?? leaveMatch?.(match.id)}
          />
        )}

        {isLeaveModalOpen && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setIsLeaveModalOpen(false)}
            onConfirm={handleConfirmLeave}
            isLoading={isLeaving}
            title={isPending ? "¿Cancelar solicitud?" : "¿Salir de la sala?"}
            message={
              isPending
                ? "¿Estás seguro de que deseas cancelar tu solicitud para unirte a esta sala?"
                : "¿Estás seguro de que deseas cancelar tu participación en esta sala?"
            }
            confirmText={isPending ? "Cancelar solicitud" : "Salir de la sala"}
            confirmVariant="danger"
          />
        )}
      </CardContent>
    </Card>
  );
}
