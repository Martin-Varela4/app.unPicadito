import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

export const PlayerList = ({ players }) => {
  const navigate = useNavigate();

  const handleViewProfile = (playerId) => {
    navigate(`/users/${playerId}`);
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      {players.map((player) => (
        <div 
          key={player.id} 
          className="flex flex-col gap-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          {/* Datos del Jugador */}
          <div className="min-w-0">
            <h3 className="mb-2 break-words font-semibold text-slate-100">
              {player.nombre} {player.apellido}{" "}
              <span className="text-sm font-normal text-slate-400">
                (@{player.nombreUsuario})
              </span>
            </h3>
            <p className="text-sm text-slate-300">
              <strong>Posición:</strong> {player.posicionPrincipal}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => handleViewProfile(player.id)}
            className="shrink-0"
          >
            Ver Perfil 
          </Button>
        </div>
      ))}
    </div>
  );
};
