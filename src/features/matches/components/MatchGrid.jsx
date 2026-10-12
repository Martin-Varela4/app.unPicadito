import Spinner from '../../../components/ui/Spinner';
import MatchCard from './MatchCard';

export default function MatchGrid({ matches, isLoading, error, leaveMatch, isLeaving, leaveError, joinMatch, joiningMatchId, joinError }) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner size="lg" label="Buscando partidos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div role="alert" className="flex items-center gap-2 rounded-md border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
                <span>⚠️</span>
                <span>{error}</span>
            </div>
        );
    }

    if (!matches || matches.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-slate-400">
                    No se encontraron partidos con los filtros seleccionados.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-2 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">Partidos para sumarte <span className="ml-2 rounded-sm bg-slate-800 px-2 py-1 text-sm font-normal text-slate-300">{matches.length} partidos</span></h2>
            {joinError && <p role="alert" className="text-sm text-red-400">{joinError}</p>}

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