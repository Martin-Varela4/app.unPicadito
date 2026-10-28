import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const isOwner = currentUser?.id === match.creador?.id || currentUser?.id === match.creadorId;
  const isJoined = Boolean(match.unidoPorUsuarioActual) || isOwner;
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
  const currentPlayers = match.cuposOcupados ?? match.participantes?.length ?? 0;
  const organizerName = match.creador?.nombre || "Organizador";

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
          ) : isJoined && (
            <Badge label="Sos parte" variant="status" value="confirmado" />
          )}
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

        <div className="mt-auto flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="truncate text-xs text-slate-400">por {organizerName}</span>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {!isJoined && (
              <Button variant="outline" onClick={() => navigate(`/salas/${match.id}`)}>
                Ver partido
              </Button>
            )}

            <Button
              variant={isJoined ? "outline" : "primary"}
              onClick={isJoined ? () => navigate(`/salas/${match.id}`) : handleJoin}
              disabled={!isJoined && (cannotJoin || joiningMatchId === match.id)}
            >
              {isJoined
                ? "Ir a mi sala"
                : isPast
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
                onClick={() => (isOwner ? setIsCancelModalOpen(true) : setIsLeaveModalOpen(true))}
                disabled={isLeaving || isBlocked}
                title={isBlocked ? "No puedes salir/cancelar con menos de 24hs de anticipación" : ""}
              >
                {isBlocked ? "Fuera de término" : isOwner ? "Cancelar" : isLeaving ? "Saliendo..." : "Salir"}
              </Button>
            )}
          </div>
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
            title="¿Salir de la sala?"
            message="¿Estás seguro de que deseas cancelar tu participación en esta sala?"
          />
        )}
      </CardContent>
    </Card>
  );
}
