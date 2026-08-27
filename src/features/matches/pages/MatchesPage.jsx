import { useState, useEffect } from 'react';
import { useMatches } from '../hooks/useMatches';
import { useDebounce } from '../../../hooks/useDebounce';
import SearchInput from '../../../components/SearchInput';
import MatchFilters from '../components/MatchFilters';
import MatchGrid from '../components/MatchGrid';

export default function MatchesPage() {
    const {
        filters,
        setFilter,
        matches,
        isLoadingMatches,
        matchesError,
        modalities,
        zones,
        levels,
        isLoadingOptions,
    } = useMatches();

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 400);

    useEffect(() => {
        setFilter('search', debouncedSearch);
    }, [debouncedSearch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handleSearchClear = () => {
        setSearchTerm('');
        setFilter('search', '');
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Partidos disponibles
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Encontra tu proximo partido y unite.
                    </p>
                </div>

                <div className="w-full sm:w-72">
                    <SearchInput
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onClear={handleSearchClear}
                        placeholder="Buscar partido por nombre..."
                    />
                </div>
            </div>

            <MatchFilters
                filters={filters}
                onFilterChange={setFilter}
                modalities={modalities}
                zones={zones}
                levels={levels}
                isLoadingOptions={isLoadingOptions}
            />

            <MatchGrid
                matches={matches}
                isLoading={isLoadingMatches}
                error={matchesError}
            />
        </div>
    );
}
