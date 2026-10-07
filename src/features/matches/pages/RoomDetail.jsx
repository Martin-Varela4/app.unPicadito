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

export const RoomDetail = () => {
  const { id: roomId } = useParams();
  const currentUser = useAuthStore((state) => state.user);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const loadRoom = useCallback(async () => {
    try {
      setError("");
      const mappedRoom = await getMatchById(roomId);
      setRoom(mappedRoom);
    } catch {
      setError("No se pudo cargar la información de la sala.");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  const organizer = useRoomOrganizer(roomId, loadRoom);
  const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room?.organizerId;

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
      <div className="text-center py-10 text-gray-600">
        Cargando detalles del partido...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!room) {
    return <div className="text-center py-10 text-gray-500">Sala no encontrada.</div>;
  }

  const confirmedPlayers = room.participants?.filter((p) => p.status === "CONFIRMED") || [];
  const substitutes = room.participants?.filter((p) => p.status === "SUBSTITUTE") || [];
  const availableSlots = Math.max(0, room.maxPlayers - confirmedPlayers.length);

  const handleRoomCanceled = () => {
    setRoom((prev) => (prev ? { ...prev, status: "CANCELADA" } : null));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 mb-12">
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

      <section className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-4">
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
          <p className="text-gray-600 text-sm">
            {organizer.actionType === "EXPEL"
              ? `¿Estás seguro de que deseás expulsar a ${
                  organizer.targetPlayer?.firstName || organizer.targetPlayer?.username || "este jugador"
                } de la sala?`
              : `¿Estás seguro de que deseás transferir la organización a ${
                  organizer.targetPlayer?.firstName || organizer.targetPlayer?.username || "este jugador"
                }? Dejarás de ser el organizador de este partido.`}
          </p>

          {organizer.actionError && (
            <p className="text-red-600 text-xs font-semibold">{organizer.actionError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={organizer.closeModal}
              disabled={organizer.isLoading}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={organizer.handleConfirm}
              disabled={organizer.isLoading}
              className={`px-4 py-2 text-sm text-white rounded-lg font-medium disabled:opacity-50 ${
                organizer.actionType === "EXPEL"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {organizer.isLoading ? "Procesando..." : "Confirmar"}
            </button>
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
    </div>
  );
};