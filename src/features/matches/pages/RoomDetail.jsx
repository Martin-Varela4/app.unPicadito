import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getMatchById, joinMatch } from "../services/matchService";
import { RoomHeader } from "../components/RoomHeader";
import { RoomInfoCard } from "../components/RoomInfoCard";
import { RoomSlotsSummary } from "../components/RoomSlotsSummary";
import { RoomParticipantsList } from "../components/RoomParticipantsList";
import TacticalBoard from "../components/TacticalBoard";
import { CancelRoomManager } from "../components/CancelRoomManager";
import { LeaveRoomManager } from "../components/LeaveRoomManager";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useRoomOrganizer } from "../hooks/useRoomOrganizer";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { FinalizeRoomManager } from "../components/FinalizeRoomManager";
import { getFinalizeAvailableAt } from "../utils/dateUtils";

export const RoomDetail = () => {
  const { id: roomId } = useParams();
  const currentUser = useAuthStore((state) => state.user);

  const [room, setRoom] = useState(null);
  const [loadedRoomId, setLoadedRoomId] = useState(null);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const loading = loadedRoomId !== roomId;

  const fetchRoom = useCallback(() => getMatchById(roomId), [roomId]);
  const loadRoom = useCallback(async () => {
    try {
      const mappedRoom = await fetchRoom();
      setRoom(mappedRoom);
      setError("");
      setLoadedRoomId(roomId);
    } catch {
      setError("No se pudo cargar la información de la sala.");
      setLoadedRoomId(roomId);
    }
  }, [fetchRoom, roomId]);

  useEffect(() => {
    let active = true;
    fetchRoom()
      .then((mappedRoom) => {
        if (!active) return;
        setRoom(mappedRoom);
        setError("");
      })
      .catch(() => {
        if (active) setError("No se pudo cargar la información de la sala.");
      })
      .finally(() => {
        if (active) setLoadedRoomId(roomId);
      });
    return () => {
      active = false;
    };
  }, [fetchRoom, roomId]);

  const organizer = useRoomOrganizer(roomId, loadRoom);
  const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room?.organizerId;

  const roomStatus = room?.status;
  const matchIso = room?.raw?.fechaHoraPartido;

  useEffect(() => {
    if (!matchIso || !["ABIERTA", "COMPLETA"].includes(roomStatus)) return;
    const availableAt = getFinalizeAvailableAt(matchIso);
    if (!availableAt) return;

    const MAX_TIMEOUT_MS = 2147483647;
    const MAX_ATTEMPTS = 5;
    const RETRY_MS = 30000;
    const delay = Math.max(availableAt.getTime() - Date.now(), 0);
    if (delay > MAX_TIMEOUT_MS) return;

    let cancelled = false;
    let attempts = 0;
    let timeoutId;

    const refresh = async () => {
      try {
        const fresh = await fetchRoom();
        if (cancelled) return;
        setRoom(fresh);
        const stillOpen = ["ABIERTA", "COMPLETA"].includes(fresh?.status);
        if (stillOpen && attempts < MAX_ATTEMPTS) {
          attempts += 1;
          timeoutId = setTimeout(refresh, RETRY_MS);
        }
      } catch {
      }
    };

    timeoutId = setTimeout(refresh, delay);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [fetchRoom, matchIso, roomStatus]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") loadRoom();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [loadRoom]);

  const handleJoin = async () => {
    setIsJoining(true);
    setJoinError("");
    try {
      await joinMatch(roomId);
      await loadRoom();
    } catch (err) {
      setJoinError(err.message || "No se pudo unir al partido.");
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-slate-300">
        Cargando detalles del partido...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!room) {
    return <div className="py-10 text-center text-slate-400">Sala no encontrada.</div>;
  }

  const confirmedPlayers = room.participants?.filter((p) => p.status === "CONFIRMED") || [];
  const substitutes = room.participants?.filter((p) => p.status === "SUBSTITUTE") || [];
  const availableSlots = Math.max(0, room.maxPlayers - confirmedPlayers.length);

  const handleRoomCanceled = () => {
    setRoom((prev) => (prev ? { ...prev, status: "CANCELADA" } : null));
  };

  return (
    <div className="mx-auto mb-12 max-w-4xl space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-8">
      <RoomHeader
        room={room}
        roomId={roomId}
        availableSlots={availableSlots}
        onJoin={handleJoin}
        isJoining={isJoining}
        joinError={joinError}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoomInfoCard room={room} />
        <RoomSlotsSummary
          maxPlayers={room.maxPlayers}
          confirmedCount={confirmedPlayers.length}
          availableSlots={availableSlots}
        />
      </div>

      <section className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-base font-bold text-slate-100">
          Pizarrón Táctico
        </h3>
        <TacticalBoard players={confirmedPlayers} modality={room.modality} />
      </section>

      <RoomParticipantsList
        confirmedPlayers={confirmedPlayers}
        substitutes={substitutes}
        maxPlayers={room.maxPlayers}
        currentUserId={currentUser?.id}
        isCurrentOrganizer={isOrganizer}
        onExpelPlayer={organizer.openExpelModal}
        onTransferOrganizer={organizer.openTransferModal}
      />

      {/* Modal de confirmación para Expulsar / Transferir */}
      <ConfirmModal
        isOpen={Boolean(organizer.targetPlayer)}
        onClose={organizer.closeModal}
        title={organizer.actionType === "EXPEL" ? "¿Expulsar jugador?" : "¿Transferir organización?"}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            {organizer.actionType === "EXPEL"
              ? `¿Estás seguro de que deseás expulsar a ${organizer.targetPlayer?.firstName || organizer.targetPlayer?.username || "este jugador"
              } de la sala?`
              : `¿Estás seguro de que deseás transferir la organización a ${organizer.targetPlayer?.firstName || organizer.targetPlayer?.username || "este jugador"
              }? Dejarás de ser el organizador de este partido.`}
          </p>

          {organizer.actionError && (
            <p className="text-xs font-semibold text-red-300">{organizer.actionError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={organizer.closeModal}
              disabled={organizer.isLoading}
              className="min-h-11 rounded-md bg-slate-800 px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-slate-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={organizer.handleConfirm}
              disabled={organizer.isLoading}
              className={`min-h-11 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 ${organizer.actionType === "EXPEL"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[var(--color-brand-primary)] text-[#21263A] hover:bg-[var(--color-brand-primary-dark)]"
                }`}
            >
              {organizer.isLoading ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </ConfirmModal>
      <FinalizeRoomManager
        room={room}
        roomId={roomId}
        onFinalizeSuccess={loadRoom}
      />
      <CancelRoomManager
        room={room}
        roomId={roomId}
        onCancelSuccess={handleRoomCanceled}
      />

      <LeaveRoomManager
        room={room}
        roomId={roomId}
      />
    </div>
  );
};