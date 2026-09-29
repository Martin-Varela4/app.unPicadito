import Badge from "../../../components/Badge";
import ProgressBar from "../../../components/ProgressBar";
import Button from "../../../components/Button";

export default function MatchCard({ match, leaveMatch, isLeaving, leaveError, onMatchLeft }) {
  const isComplete = match.estado === "COMPLETA";

  const isWithin24Hours = () => {
    if (!match.fechaHoraPartido) return false;
    const matchDateTime = new Date(match.fechaHoraPartido);
    const now = new Date();
    const diffHours = (matchDateTime - now) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const isBlocked = isWithin24Hours();

  const handleLeave = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas cancelar tu participación en esta sala?",
      )
    ) {
      try {
        await leaveMatch(match.id);
        if (onMatchLeft) {
          onMatchLeft(match.id);
        }
      } catch (err) {}
    }
  };

  // Formatear fechas para mostrar en pantalla
  const fechaStr = match.fechaHoraPartido 
    ? new Date(match.fechaHoraPartido).toLocaleDateString('es-AR') 
    : '—';
    
  const horaStr = match.fechaHoraPartido 
    ? new Date(match.fechaHoraPartido).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) 
    : '—';

  const currentPlayers = match.participantes?.length || 0;
  const organizerName = match.creador?.nombre || "Organizador";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Usamos el estado real que viene de la base de datos */}
        <Badge label={match.estado} variant="status" value={match.estado} />
        {match.esPublica ? (
            <Badge label="Pública" variant="modality" value="public" />
        ) : (
            <Badge label="Privada" variant="modality" value="private" />
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">{match.nombre}</h3>
          <p className="text-sm text-slate-500">
            {match.nombreCancha} · {match.direccion || "Sin dirección"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          📅 {fechaStr} · 🕐 {horaStr}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-medium">Jugadores</span>
          <span className="text-slate-900 font-semibold">
            {currentPlayers}/{match.cuposTotales}
          </span>
        </div>
        <ProgressBar current={currentPlayers} max={match.cuposTotales} />
      </div>
      {leaveError && <p className="text-red-500 text-xs">{leaveError}</p>}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <span className="text-xs text-slate-400">por {organizerName}</span>
        <Button
          variant={isComplete ? "outline" : "primary"}
          disabled={isComplete}
        >
          {isComplete ? "Sin lugares" : "Unirme"}
        </Button>
        <Button
          variant="danger"
          onClick={handleLeave}
          disabled={isLeaving || isBlocked}
          title={
            isBlocked
              ? "No puedes cancelar con menos de 24hs de anticipación"
              : ""
          }
        >
          {isBlocked
            ? "Fuera de término"
            : isLeaving
              ? "Cancelando..."
              : "Cancelar"}
        </Button>
      </div>
    </div>
  );
}