import { useState, useEffect } from 'react';
import {
    getMatches,
    getModalities,
    getZones,
    getLevels,
} from '../services/matchService';

const initialFilters = {
    modality: '',
    zone: '',
    level: '',
    date: '',
    onlyAvailable: false,
};

export const useMatches = () => {
    const [filters, setFilters] = useState(initialFilters);

    const [matches, setMatches] = useState([]);
    const [isLoadingMatches, setIsLoadingMatches] = useState(false);
    const [matchesError, setMatchesError] = useState(null);

    const [modalities, setModalities] = useState([]);
    const [zones, setZones] = useState([]);
    const [levels, setLevels] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [optionsError, setOptionsError] = useState(null);

    useEffect(() => {
        const fetchOptions = async () => {
            setIsLoadingOptions(true);
            setOptionsError(null);

            try {
                const [modalitiesData, zonesData, levelsData] = await Promise.all([
                    getModalities(),
                    getZones(),
                    getLevels(),
                ]);

                setModalities(modalitiesData);
                setZones(zonesData);
                setLevels(levelsData);
            } catch (error) {
                setOptionsError(error.message ?? 'Error al cargar las opciones de filtros.');
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchOptions();
    }, []);

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

    return {
        filters,
        setFilter,
        resetFilters,

        matches,
        isLoadingMatches,
        matchesError,

        modalities,
        zones,
        levels,
        isLoadingOptions,
        optionsError,
    };
};
