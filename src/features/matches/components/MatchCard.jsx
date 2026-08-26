import Badge from '../../../components/Badge';
import ProgressBar from '../../../components/ProgressBar';
import Button from '../../../components/Button';

export default function MatchCard({ match }) {
    const isComplete = match.status === 'completo';

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
                <Badge label={match.modality} variant="modality" value={match.modality} />
                <Badge label={match.status} variant="status" value={match.status} />
            </div>

            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="text-base font-bold text-slate-900">{match.title}</h3>
                    <p className="text-sm text-slate-500">{match.venue} · {match.zone}</p>
                </div>
                <span className="text-base font-bold text-slate-900 whitespace-nowrap">
                    ${match.price?.toLocaleString()}
                </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500">
                <span>📅 {match.date} · 🕐 {match.time}</span>
                <Badge label={match.level} variant="level" value={match.level} />
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Jugadores</span>
                    <span className="text-slate-900 font-semibold">
                        {match.currentPlayers}/{match.maxPlayers}
                    </span>
                </div>
                <ProgressBar current={match.currentPlayers} max={match.maxPlayers} />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                    por {match.organizer}
                </span>
                <Button
                    variant={isComplete ? 'outline' : 'primary'}
                    disabled={isComplete}
                >
                    {isComplete ? 'Sin lugares' : 'Unirme'}
                </Button>
            </div>
        </div>
    );
}
