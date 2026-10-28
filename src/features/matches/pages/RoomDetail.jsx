import { useParams } from "react-router-dom";
import { RoomHeader } from "../components/RoomHeader";
import { RoomInfoCard } from "../components/RoomInfoCard";
import { RoomSlotsSummary } from "../components/RoomSlotsSummary";
import { RoomParticipantsList } from "../components/RoomParticipantsList";
import TacticalBoard from "../components/TacticalBoard";
import { CancelRoomManager } from "../components/CancelRoomManager";
import { LeaveRoomManager } from "../components/LeaveRoomManager";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useRoomOrganizer } from "../hooks/useRoomOrganizer";
import { useRoomDetail } from "../hooks/useRoomDetail";
import { ConfirmModal } from "../../../components/ConfirmModal";
import Button from "../../../components/ui/Button";
import PageContainer from "../../../components/ui/PageContainer";
import SectionCard from "../../../components/ui/SectionCard";
import LoadingState from "../../../components/ui/LoadingState";
import ErrorAlert from "../../../components/ui/ErrorAlert";

export const RoomDetail = () => {
  const { id: roomId } = useParams();
  const currentUser = useAuthStore((state) => state.user);

  const {
    room,
    loading,
    error,
    isJoining,
    joinError,
    loadRoom,
    handleJoin,
    handleRoomCanceled,
    confirmedPlayers,
    substitutes,
    availableSlots,
  } = useRoomDetail(roomId);

  const organizer = useRoomOrganizer(roomId, loadRoom);
  const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room?.organizerId;

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
              ? `¿Estás seguro de que deseás expulsar a ${
                  organizer.targetPlayer?.firstName || organizer.targetPlayer?.username || "este jugador"
                } de la sala?`
              : `¿Estás seguro de que deseás transferir la organización a ${
                  organizer.targetPlayer?.firstName || organizer.targetPlayer?.username || "este jugador"
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
              isLoading={organizer.isLoading}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </ConfirmModal>

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
