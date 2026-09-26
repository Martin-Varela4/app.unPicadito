import Spinner from '../../../components/Spinner';
import MatchCard from './MatchCard';

export default function MatchGrid({ matches, isLoading, error }) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner size="lg" label="Buscando partidos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
            </div>
        );
    }

    if (!matches || matches.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-slate-500">
                    No se encontraron partidos con los filtros seleccionados.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-500">
                <span className="font-semibold text-blue-600">{matches.length}</span>{' '}
                partidos encontrados
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </div>
        </div>
    );
}
