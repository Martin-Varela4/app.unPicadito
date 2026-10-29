import { useEffect } from "react";
import { useParams } from "react-router";
import { RoomHeader } from "../components/RoomHeader";
import { RoomInfoCard } from "../components/RoomInfoCard";
import { RoomSlotsSummary } from "../components/RoomSlotsSummary";
import { RoomParticipantsList } from "../components/RoomParticipantsList";
import { RoomJoinRequests } from "../components/RoomJoinRequests";
import TacticalBoard from "../components/TacticalBoard";
import { CancelRoomManager } from "../components/CancelRoomManager";
import { FinalizeRoomManager } from "../components/FinalizeRoomManager";
import { LeaveRoomManager } from "../components/LeaveRoomManager";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useRoomOrganizer } from "../hooks/useRoomOrganizer";
import { useRoomDetail } from "../hooks/useRoomDetail";
import { ROOM_STATUS } from "../constants/matchConstants";
import { getFinalizeAvailableAt } from "../utils/dateUtils";
import { ConfirmModal } from "../../../components/ConfirmModal";
import Button from "../../../components/ui/Button";
import PageContainer from "../../../components/ui/PageContainer";
import SectionCard from "../../../components/ui/SectionCard";
import LoadingState from "../../../components/ui/LoadingState";
import ErrorAlert from "../../../components/ui/ErrorAlert";

const OPEN_ROOM_STATUSES = [ROOM_STATUS.ABIERTA, ROOM_STATUS.COMPLETA];
const MAX_TIMEOUT_MS = 2147483647;
const MAX_REFRESH_ATTEMPTS = 5;
const REFRESH_RETRY_MS = 30000;

export const RoomDetail = () => {
  const { id: roomId } = useParams();
  const currentUser = useAuthStore((state) => state.user);

  const {
    room,
    loading,
    error,
    isJoining,
    joinError,
    actionError,
    isActionLoading,
    loadRoom,
    handleJoin,
    handleRoomCanceled,
    handleAcceptRequest,
    handleRejectRequest,
    confirmedPlayers,
    substitutes,
    pendingRequests,
    availableSlots,
  } = useRoomDetail(roomId);

  const organizer = useRoomOrganizer(roomId, loadRoom);
  const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room?.organizerId;

  const roomStatus = room?.status;
  const matchDate = room?.raw?.fechaHoraPartido;

  useEffect(() => {
    if (loading || !matchDate || !OPEN_ROOM_STATUSES.includes(roomStatus)) return;

    const availableAt = getFinalizeAvailableAt(matchDate);
    if (!availableAt) return;

    const delay = Math.max(availableAt.getTime() - Date.now(), 0);
    if (delay > MAX_TIMEOUT_MS) return;

    let cancelled = false;
    let attempts = 0;
    let timeoutId;

    const refreshRoom = async () => {
      const refreshedRoom = await loadRoom();
      if (cancelled) return;

      if (
        (!refreshedRoom || OPEN_ROOM_STATUSES.includes(refreshedRoom.status)) &&
        attempts < MAX_REFRESH_ATTEMPTS
      ) {
        attempts += 1;
        timeoutId = setTimeout(refreshRoom, REFRESH_RETRY_MS);
      }
    };

    timeoutId = setTimeout(refreshRoom, delay);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [loadRoom, loading, matchDate, roomStatus]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadRoom();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadRoom]);

  if (loading) {
    return <LoadingState label="Cargando detalles del partido..." className="py-20" />;
  }

  if (error) {
    return (
      <PageContainer size="lg">
        <ErrorAlert message={error} />
      </PageContainer>
    );
  }

  if (!room) {
    return (
      <PageContainer size="lg">
        <div className="py-10 text-center text-slate-400">Sala no encontrada.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="lg" className="space-y-5 sm:space-y-6">
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

      <SectionCard title="Pizarrón Táctico">
        <TacticalBoard players={confirmedPlayers} modality={room.modality} />
      </SectionCard>

      {/* Solicitudes de ingreso (solo visible para el organizador de la sala) */}
      {isOrganizer && (!room.isPublic || pendingRequests.length > 0) && (
        <div className="space-y-2">
          {actionError && <ErrorAlert message={actionError} />}
          <RoomJoinRequests
            requests={pendingRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            isLoading={isActionLoading}
          />
        </div>
      )}

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
            <Button
              type="button"
              variant="outline"
              onClick={organizer.closeModal}
              disabled={organizer.isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant={organizer.actionType === "EXPEL" ? "danger" : "primary"}
              onClick={organizer.handleConfirm}
              disabled={organizer.isLoading}
              className={`min-h-11 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                organizer.actionType === "EXPEL"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-[var(--color-brand-primary)] text-[#21263A] hover:bg-[var(--color-brand-primary-dark)]"
              }`}
            >
              Confirmar
            </Button>
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
    </PageContainer>
  );
};

export default RoomDetail;
