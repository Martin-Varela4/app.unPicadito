import LoadingState from '../../../components/ui/LoadingState';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import EmptyState from '../../../components/ui/EmptyState';
import MatchCard from './MatchCard';

export default function MatchGrid({ matches, isLoading, error, leaveMatch, isLeaving, leaveError, joinMatch, joiningMatchId, joinError }) {
    if (isLoading) {
        return <LoadingState size="lg" label="Buscando partidos..." />;
    }

    if (error) {
        return <ErrorAlert message={error} />;
    }

    if (!matches || matches.length === 0) {
        return (
            <EmptyState
                icon="⚽"
                title="No se encontraron partidos"
                description="No hay partidos que coincidan con los filtros seleccionados. Probá modificando la búsqueda."
            />
        );
    }

    return (
        <div className="mt-2 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
                Partidos para sumarte{' '}
                <span className="ml-2 rounded-sm bg-slate-800 px-2 py-1 text-sm font-normal text-slate-300">
                    {matches.length} partidos
                </span>
            </h2>
            {joinError && <ErrorAlert message={joinError} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {matches.map((match) => (
                    <MatchCard
                        key={match.id}
                        match={match}
                        leaveMatch={leaveMatch}
                        isLeaving={isLeaving}
                        leaveError={leaveError}
                        joinMatch={joinMatch}
                        joiningMatchId={joiningMatchId}
                    />
                ))}
            </div>
        </div>
    );
}
