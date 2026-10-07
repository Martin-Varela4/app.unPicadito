import { Link } from 'react-router-dom';
import { Search, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../../auth/store/useAuthStore';
import { useMatches } from '../../../matches/hooks/useMatches';
import MatchCard from '../../../matches/components/MatchCard';
import Spinner from '../../../../components/Spinner';
import heroImage from '../../../../assets/hero.png';

const HomePage = () => {
    const user = useAuthStore((state) => state.user);
    const {
        matches,
        isLoadingMatches,
        matchesError,
        leaveMatch,
        isLeaving,
        leaveError,
        joinMatch,
        joiningMatchId,
    } = useMatches();

    const myMatches = matches.filter(
        (m) => Boolean(m.unidoPorUsuarioActual) || m.creador?.id === user?.id
    );

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Banner Hero */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex-1 space-y-3">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        ¡Hola{user?.nombre ? `, ${user.nombre}` : ''}! ⚽
                    </h1>
                    <p className="text-emerald-100 text-sm sm:text-base max-w-lg">
                        Encontrá un picadito cerca de tu zona o creá una nueva sala en segundos para que se sumen otros jugadores.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                            id="home-search-matches"
                            to="/partidos"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-emerald-800 font-semibold hover:bg-emerald-50 transition-colors text-sm shadow-sm"
                        >
                            <Search size={18} />
                            Buscar partidos
                        </Link>
                        <Link
                            id="home-create-room"
                            to="/salas/nueva"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/60 text-white font-semibold hover:bg-white/10 transition-colors text-sm"
                        >
                            <PlusCircle size={18} />
                            Crear sala
                        </Link>
                    </div>
                </div>

                <img
                    src={heroImage}
                    alt="Cancha de fútbol"
                    className="w-full md:w-72 lg:w-80 h-44 md:h-auto rounded-xl object-cover shadow-inner"
                />
            </section>

            {/* Sección: Mis próximos partidos */}
            <section className="flex flex-col gap-4">
                <div className="flex items-end justify-between border-b border-slate-200 pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Mis próximos partidos</h2>
                        <p className="text-xs text-slate-500">Salas en las que participás o que organizás</p>
                    </div>
                    <Link to="/partidos" className="text-sm font-semibold text-emerald-700 hover:underline">
                        Ver todos los partidos →
                    </Link>
                </div>

                {isLoadingMatches && (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                )}

                {matchesError && (
                    <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                        {matchesError}
                    </div>
                )}

                {!isLoadingMatches && !matchesError && myMatches.length === 0 && (
                    <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-2xl p-6">
                        <div className="text-3xl mb-2">⚽</div>
                        <p className="text-slate-600 font-medium">Todavía no estás anotado en ningún partido.</p>
                        <p className="text-xs text-slate-400 mt-1 mb-4">Sumate a un partido abierto o armá el tuyo.</p>
                        <Link
                            to="/partidos"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Explorar partidos disponibles
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myMatches.map((match) => (
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
            </section>
        </div>
    );
};

export default HomePage;