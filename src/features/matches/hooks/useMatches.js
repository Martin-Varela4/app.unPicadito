import { useState, useEffect } from 'react';
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
                setMatches(data);
            } catch (error) {
                setMatchesError(error.message ?? 'Error al buscar partidos.');
            } finally {
                setIsLoadingMatches(false);
            }
        };

        fetchMatches();
    }, [filters]);

    const setFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

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
            throw new Error(message);
        } finally {
            setIsLeaving(false);
        }
    };

    const joinMatch = async (matchId) => {
        setJoiningMatchId(matchId);
        setJoinError(null);

        try {
            await joinMatchService(matchId);
            setMatches(await getMatches(filters));
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