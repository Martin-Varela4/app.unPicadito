import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Search, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useMatches } from '../../matches/hooks/useMatches';
import { CLOSED_ROOM_STATUSES, ROOM_STATUS } from '../../matches/constants/matchConstants';
import MatchCard from '../../matches/components/MatchCard';
import PageContainer from '../../../components/ui/PageContainer';
import LoadingState from '../../../components/ui/LoadingState';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import EmptyState from '../../../components/ui/EmptyState';
import heroImage from '../../../assets/cancha-fondo.jpg';
import { ProfileRanking } from '../../profile/components/ProfileRanking';
import { getMyProfile } from '../../profile/services/profileService';

const HOME_MATCHES_FILTERS = { misSalas: true, limite: 50 };

const HomePage = () => {
    const user = useAuthStore((state) => state.user);
    const [myRanking, setMyRanking] = useState(user?.reputacion ?? 0);

    const {
        matches,
        isLoadingMatches,
        matchesError,
        leaveMatch,
        isLeaving,
        leaveError,
        joinMatch,
        joiningMatchId,
    } = useMatches(HOME_MATCHES_FILTERS);

    useEffect(() => {
        let active = true;
        getMyProfile()
            .then((profile) => {
                if (active && profile?.reputacion !== undefined) {
                    setMyRanking(profile.reputacion);
                }
            })
            .catch(() => {
                // Mantiene el último valor conocido si falla la consulta en segundo plano
            });

        return () => {
            active = false;
        };
    }, []);

    const myMatches = matches.filter(
        (m) => Boolean(m.unidoPorUsuarioActual) || m.creador?.id === user?.id || Boolean(m.solicitudPendiente)
    );

    const upcomingMatches = myMatches.filter((m) => !CLOSED_ROOM_STATUSES.includes(m.estado));
    const finishedMatches = myMatches.filter(
        (m) =>
            m.estado === ROOM_STATUS.FINALIZADA &&
            (Boolean(m.unidoPorUsuarioActual) || m.creador?.id === user?.id)
    );

    return (
        <PageContainer size="xl" className="flex flex-col gap-6 sm:gap-8">
            {/* Banner Hero */}
            <section
                className="relative isolate flex min-h-64 items-center overflow-hidden rounded-md border border-emerald-900/60 bg-[#17241f] p-5 text-white shadow-sm sm:p-8 md:min-h-72"
            >
                <img
                    src={heroImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center] opacity-35 md:left-auto md:w-3/5 md:opacity-100"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-[#17241f] via-[#17241f]/90 to-[#17241f]/55 md:to-transparent"
                />
                <div className="relative max-w-2xl space-y-3">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        ¡Hola{user?.nombre ? `, ${user.nombre}` : ''}! ⚽
                    </h1>
                    <p className="max-w-lg text-sm text-slate-300 sm:text-base">
                        Encontrá un picadito cerca de tu zona o creá una nueva sala en segundos para que se sumen otros jugadores.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                            id="home-search-matches"
                            to="/partidos"
                            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-semibold text-[#21263A] shadow-sm transition-colors hover:bg-[var(--color-brand-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <Search size={18} />
                            Buscar partidos
                        </Link>
                        <Link
                            id="home-create-room"
                            to="/salas/nueva"
                            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-400 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-background-card)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
                        >
                            <PlusCircle size={18} />
                            Crear sala
                        </Link>
                    </div>
                </div>
            </section>

            <ProfileRanking ranking={myRanking} />

            {/* Sección: Mis próximos partidos */}
            <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 border-b border-[var(--color-border-subtle)] pb-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Mis próximos partidos</h2>
                        <p className="text-xs text-slate-400">Salas en las que participás o que organizás</p>
                    </div>
                    <Link to="/partidos" className="text-sm font-semibold text-[var(--color-brand-primary)] hover:underline">
                        Ver todos los partidos →
                    </Link>
                </div>

                {isLoadingMatches && (
                    <LoadingState label="Cargando tus partidos..." className="py-10" />
                )}

                {matchesError && (
                    <ErrorAlert message={matchesError} />
                )}

                {!isLoadingMatches && !matchesError && upcomingMatches.length === 0 && (
                    <EmptyState
                        icon="⚽"
                        title="Todavía no estás anotado en ningún partido."
                        description="Sumate a un partido abierto o armá el tuyo."
                        action={
                            <Link
                                to="/partidos"
                                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[#21263A] transition-colors hover:bg-[var(--color-brand-primary-dark)]"
                            >
                                Explorar partidos disponibles
                            </Link>
                        }
                    />
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {upcomingMatches.map((match) => (
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

            {/* Sección: Partidos finalizados */}
            {!isLoadingMatches && !matchesError && finishedMatches.length > 0 && (
                <section className="flex flex-col gap-4">
                    <div className="border-b border-[var(--color-border-subtle)] pb-3">
                        <h2 className="text-xl font-bold text-white">Partidos finalizados</h2>
                        <p className="text-xs text-slate-400">
                            Entrá a la sala para calificar a tus compañeros
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {finishedMatches.map((match) => (
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
            )}
        </PageContainer>
    );
};

export default HomePage;
