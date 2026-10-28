import { useState, useEffect, useCallback } from 'react';
import { getMatches, leaveMatch as leaveMatchService, joinMatch as joinMatchService } from '../services/matchService';
import { INITIAL_MATCH_FILTERS } from '../constants/matchConstants';
import { useDebounce } from '../../../hooks/useDebounce';
import { DEBOUNCE_DELAY_MS } from '../../../constants/appConstants';

const isUpcoming = (match) => {
    if (!match?.fechaHoraPartido) return true;
    return new Date(match.fechaHoraPartido) >= new Date();
};

export const useMatches = () => {
    const [filters, setFilters] = useState(INITIAL_MATCH_FILTERS);
    const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY_MS);

    const [matches, setMatches] = useState([]);
    const [isLoadingMatches, setIsLoadingMatches] = useState(false);
    const [matchesError, setMatchesError] = useState(null);
    const [joiningMatchId, setJoiningMatchId] = useState(null);
    const [joinError, setJoinError] = useState(null);

    const [isLeaving, setIsLeaving] = useState(false);
    const [leaveError, setLeaveError] = useState(null);

    useEffect(() => {
        let active = true;

        const fetchMatches = async () => {
            setIsLoadingMatches(true);
            setMatchesError(null);

            try {
                const data = await getMatches(debouncedFilters);
                if (!active) return;
                const upcoming = Array.isArray(data) ? data.filter(isUpcoming) : [];
                setMatches(upcoming);
            } catch (error) {
                if (active) setMatchesError(error.message ?? 'Error al buscar partidos.');
            } finally {
                if (active) setIsLoadingMatches(false);
            }
        };

        fetchMatches();

        return () => {
            active = false;
        };
    }, [debouncedFilters]);

    const setFilter = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const resetFilters = () => {
        setFilters(INITIAL_MATCH_FILTERS);
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
