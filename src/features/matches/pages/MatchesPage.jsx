import { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import SearchInput from '../../../components/ui/SearchInput';
import MatchFilters from '../components/MatchFilters';
import MatchGrid from '../components/MatchGrid';
import PageContainer from '../../../components/ui/PageContainer';

export default function MatchesPage() {
    const {
        filters,
        setFilter,
        matches,
        isLoadingMatches,
        matchesError,
        leaveMatch,
        isLeaving,
        leaveError,
        joinMatch,
        joiningMatchId,
        joinError,
    } = useMatches();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setFilter('search', value);
    };

    const handleSearchClear = () => {
        setSearchTerm('');
        setFilter('search', '');
    };

    return (
        <PageContainer size="full" className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Tu próximo picadito esta acá.
                    </h1>
                    <p className="mt-2 text-sm text-slate-300 sm:text-base">
                        Buscá un partido cerca y sumate al equipo.
                    </p>
                </div>

                <div className="w-full">
                    <SearchInput
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onClear={handleSearchClear}
                        placeholder="Buscar partidos o canchas..."
                    />
                </div>
            </div>

            <MatchFilters
                filters={filters}
                onFilterChange={setFilter}
            />

            <MatchGrid
                matches={matches}
                isLoading={isLoadingMatches}
                error={matchesError}
                leaveMatch={leaveMatch}
                isLeaving={isLeaving}
                leaveError={leaveError}
                joinMatch={joinMatch}
                joiningMatchId={joiningMatchId}
                joinError={joinError}
            />
        </PageContainer>
    );
}
