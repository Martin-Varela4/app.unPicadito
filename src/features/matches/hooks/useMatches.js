import { useState, useEffect, useCallback } from 'react';
import { getMatches, leaveMatch as leaveMatchService, joinMatch as joinMatchService } from '../services/matchService';

const initialFilters = {
    search: '', // Se usa para el nombre de la sala
    date: '',
    time: '',
    onlyAvailable: false,
    nombreCancha: '',
    esPublica: '', // string vacío significa "Todas"
    permiteSuplentes: '',
};

const isUpcoming = (match) => {
    if (!match?.fechaHoraPartido) return true;
    return new Date(match.fechaHoraPartido) >= new Date();
};

export const useMatches = () => {
    const [filters, setFilters] = useState(initialFilters);

    const [matches, setMatches] = useState([]);
    const [isLoadingMatches, setIsLoadingMatches] = useState(false);
    const [matchesError, setMatchesError] = useState(null);
    const [joiningMatchId, setJoiningMatchId] = useState(null);
    const [joinError, setJoinError] = useState(null);

    const [isLeaving, setIsLeaving] = useState(false);
    const [leaveError, setLeaveError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            setIsLoadingMatches(true);
            setMatchesError(null);

            try {
                const data = await getMatches(filters);
                const upcoming = Array.isArray(data) ? data.filter(isUpcoming) : [];
                setMatches(upcoming);
            } catch (error) {
                setMatchesError(error.message ?? 'Error al buscar partidos.');
            } finally {
                setIsLoadingMatches(false);
            }
        };

        fetchMatches();
    }, [filters]);

    const setFilter = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    const leaveMatch = async (matchId, reason) => {
        setIsLeaving(true);
        setLeaveError(null);

        try {
            const data = await leaveMatchService(matchId, reason);
            setMatches((prevMatches) => prevMatches.filter((match) => match.id !== matchId));
            return data;
        } catch (error) {
            const message = error.message || 'Error al salir de la sala';
            setLeaveError(message);
            throw new Error(message, { cause: error });
        } finally {
            setIsLeaving(false);
        }
    };

    const joinMatch = async (matchId) => {
        setJoiningMatchId(matchId);
        setJoinError(null);

        try {
            await joinMatchService(matchId);
            const freshMatches = await getMatches(filters);
            setMatches(Array.isArray(freshMatches) ? freshMatches.filter(isUpcoming) : []);
        } catch (error) {
            setJoinError(error.message || 'No se pudo unir al partido.');
        } finally {
            setJoiningMatchId(null);
        }
    };

    return {
        filters,
        setFilter,
        resetFilters,
        matches,
        isLoadingMatches,
        matchesError,
        leaveMatch,
        isLeaving,
        leaveError,
        joinMatch,
        joiningMatchId,
        joinError,
    };
};