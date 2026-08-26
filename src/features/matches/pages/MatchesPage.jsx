import { useMatches } from '../hooks/useMatches';
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

    return (
        <div className="p-6 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Partidos disponibles
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Encontrá tu próximo partido y unite.
                </p>
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
