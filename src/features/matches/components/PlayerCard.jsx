import { useEffect, useId, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import RatingBadge from '../../../components/ui/RatingBadge';

export const PlayerCard = ({
    player,
    type = 'confirmed',
    isOrganizer = false,
    canManage = false,
    onExpel,
    onTransfer,
}) => {
    const isConfirmed = type === 'confirmed';
    const bgColor = isConfirmed ? 'bg-green-950/40 border-green-700/50' : 'bg-amber-950/30 border-amber-700/50';
    const borderColor = isConfirmed ? 'border-green-700/50' : 'border-amber-700/50';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);
    const actionsId = `player-actions-${useId()}`;

    const displayName = player.firstName
        ? `${player.firstName} ${player.lastName || ''}`.trim()
        : player.username || 'Jugador';

    useEffect(() => {
        if (!isMenuOpen) return undefined;

        const handlePointerDown = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
                menuButtonRef.current?.focus();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMenuOpen]);

    return (
        <div className={`relative flex items-center justify-between gap-2 rounded-sm border p-2.5 transition-colors ${bgColor}`}>
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                <Avatar
                    src={player.profilePictureUrl}
                    alt={`Foto de perfil de ${displayName}`}
                    className={`w-10 h-10 rounded-full object-cover border shrink-0 ${borderColor}`}
                />
                <div className="overflow-hidden min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                        {displayName}
                    </p>
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-400">
                        <RatingBadge value={player.reputation} />
                        {player.mainPosition && (
                            <span className="truncate">• {player.mainPosition}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pl-2">
                {isOrganizer && (
                    <Badge className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-900/40 text-[var(--color-brand-primary)]">
                        Org
                    </Badge>
                )}

                {canManage && (
                    <div ref={menuRef}>
                        <Button
                            type="button"
                            variant="ghost"
                            ref={menuButtonRef}
                            onClick={() => setIsMenuOpen((open) => !open)}
                            aria-label={`Acciones para ${displayName}`}
                            aria-expanded={isMenuOpen}
                            aria-controls={actionsId}
                            className="flex min-h-10 min-w-10 items-center justify-center rounded-sm p-1 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                        >
                            <MoreHorizontal size={20} aria-hidden="true" />
                        </Button>
                        {isMenuOpen && (
                            <div
                                id={actionsId}
                                className="absolute right-2 top-full z-20 mt-1 w-48 max-w-[calc(100vw-2rem)] rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-1 shadow-xl"
                                aria-label={`Acciones para ${displayName}`}
                            >
                                <Button
                                    type="button"
                                    variant="ghost"
                                    fullWidth
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onTransfer?.(player);
                                    }}
                                    className="justify-start px-3 py-2 text-left text-sm text-slate-100 hover:bg-emerald-900/40 min-h-10"
                                >
                                    Hacer organizador
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    fullWidth
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onExpel?.(player);
                                    }}
                                    className="justify-start px-3 py-2 text-left text-sm text-red-200 hover:bg-red-900/40 hover:text-red-100 min-h-10"
                                >
                                    Expulsar de la sala
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};