import { useState, useEffect, useCallback } from 'react';
import { getMatches, leaveMatch as leaveMatchService, joinMatch as joinMatchService } from '../services/matchService';
import { INITIAL_MATCH_FILTERS } from '../constants/matchConstants';
import { useDebounce } from '../../../hooks/useDebounce';
import { DEBOUNCE_DELAY_MS } from '../../../constants/appConstants';

const isUpcoming = (match) => {
    if (!match?.fechaHoraPartido) return true;
    return new Date(match.fechaHoraPartido) >= new Date();
};

export const useMatches = (initialFilters = INITIAL_MATCH_FILTERS) => {
    const [filters, setFilters] = useState(() => ({ ...INITIAL_MATCH_FILTERS, ...initialFilters }));
    const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY_MS);

    const [matches, setMatches] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, pagina: 1, limite: 12, totalPaginas: 1 });
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
                const rawList = Array.isArray(data) ? data : data.matches ?? [];
                const pag = !Array.isArray(data) && data.pagination ? data.pagination : {
                    total: rawList.length,
                    pagina: debouncedFilters.pagina || 1,
                    limite: debouncedFilters.limite || 12,
                    totalPaginas: 1,
                };
                setMatches(rawList.filter(isUpcoming));
                setPagination(pag);
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
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            ...(key !== 'pagina' ? { pagina: 1 } : {}),
        }));
    }, []);

    const setPage = useCallback((pagina) => {
        setFilters((prev) => ({ ...prev, pagina }));
    }, []);

    const resetFilters = () => {
        setFilters({ ...INITIAL_MATCH_FILTERS, ...initialFilters });
    };

    const leaveMatch = async (matchId, reason) => {
        setIsLeaving(true);
        setLeaveError(null);

        try {
            const data = await leaveMatchService(matchId, reason);
            setMatches((prev) =>
                prev.map((m) =>
                    m.id === matchId
                        ? { ...m, solicitudPendiente: 0, unidoPorUsuarioActual: 0 }
                        : m
                )
            );
            const freshMatches = await getMatches(filters);
            const freshList = Array.isArray(freshMatches) ? freshMatches : freshMatches.matches ?? [];
            setMatches(freshList.filter(isUpcoming));
            if (!Array.isArray(freshMatches) && freshMatches.pagination) {
                setPagination(freshMatches.pagination);
            }
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
            setMatches((prev) =>
                prev.map((m) =>
                    m.id === matchId
                        ? { ...m, solicitudPendiente: 1, unidoPorUsuarioActual: 0 }
                        : m
                )
            );
            const freshMatches = await getMatches(filters);
            const freshList = Array.isArray(freshMatches) ? freshMatches : freshMatches.matches ?? [];
            setMatches(freshList.filter(isUpcoming));
            if (!Array.isArray(freshMatches) && freshMatches.pagination) {
                setPagination(freshMatches.pagination);
            }
        } catch (error) {
            setJoinError(error.message || 'No se pudo unir al partido.');
        } finally {
            setJoiningMatchId(null);
        }
    };

    return {
        filters,
        setFilter,
        setPage,
        pagination,
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
