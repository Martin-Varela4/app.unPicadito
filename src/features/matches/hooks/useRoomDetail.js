import { useState, useEffect, useCallback } from "react";
import { getMatchById, joinMatch, acceptJoinRequest, rejectJoinRequest } from "../services/matchService";
import { ROOM_STATUS, PARTICIPANT_STATUS } from "../constants/matchConstants";

export const useRoomDetail = (roomId) => {
  const [room, setRoom] = useState(null);
  const [loadedRoomId, setLoadedRoomId] = useState(null);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
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

  const handleRoomCanceled = () => {
    setRoom((prev) => (prev ? { ...prev, status: ROOM_STATUS.CANCELADA } : null));
  };

  const handleAcceptRequest = async (request) => {
    const participationId = request.participationId || request.id;
    if (!participationId) return;
    setIsActionLoading(true);
    setActionError("");
    try {
      await acceptJoinRequest(roomId, participationId);
      await loadRoom();
    } catch (err) {
      setActionError(err.message || "Error al aceptar la solicitud.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectRequest = async (request) => {
    const participationId = request.participationId || request.id;
    if (!participationId) return;
    setIsActionLoading(true);
    setActionError("");
    try {
      await rejectJoinRequest(roomId, participationId);
      await loadRoom();
    } catch (err) {
      setActionError(err.message || "Error al rechazar la solicitud.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmedPlayers =
    room?.participants?.filter((p) => p.status === PARTICIPANT_STATUS.CONFIRMED) || [];
  const substitutes =
    room?.participants?.filter((p) => p.status === PARTICIPANT_STATUS.SUBSTITUTE) || [];
  const pendingRequests =
    room?.participants?.filter((p) => p.status === PARTICIPANT_STATUS.PENDING || p.role === 'SOLICITANTE') || [];
  const availableSlots = room ? Math.max(0, room.maxPlayers - confirmedPlayers.length) : 0;

  return {
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
  };
};

export default useRoomDetail;
