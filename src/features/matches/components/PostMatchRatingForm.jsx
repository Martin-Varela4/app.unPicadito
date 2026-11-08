import Alert from '../../../components/ui/Alert';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import StarRatingInput from '../../../components/ui/StarRatingInput';
import Textarea from '../../../components/ui/Textarea';
import { REVIEW_COMMENT_MAX_LENGTH } from '../constants/matchConstants';

export const PostMatchRatingForm = ({
    player,
    stars,
    onStarsChange,
    comment,
    onCommentChange,
    isSubmitting,
    submitError,
    successMessage,
    onCancel,
    onSubmit,
}) => {
    const fullName = player
        ? `${player.nombre || ''} ${player.apellido || ''}`.trim() || player.nombreUsuario || 'Jugador'
        : '';

    return (
        <div className="md:pl-2">
            <div className="max-w-xl">
                {successMessage && (
                    <Alert variant="success" message={successMessage} className="mb-4" />
                )}

                {!player ? (
                    <p className="text-sm text-slate-400">
                        Elegí un jugador de la lista para calificarlo.
                    </p>
                ) : (
                    <>
                        <div className="mb-6 flex items-center gap-3.5">
                            <Avatar
                                src={player.fotoPerfilUrl}
                                alt={`Foto de perfil de ${fullName}`}
                                className="h-14 w-14 shrink-0 rounded-full object-cover"
                            />
                            <div className="min-w-0">
                                <strong className="block truncate text-base font-semibold text-slate-100">
                                    {fullName}
                                </strong>
                                <span className="text-sm text-slate-400">
                                    {player.posicionPrincipal}
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-semibold text-slate-200">
                                Puntuación
                            </label>
                            <StarRatingInput
                                value={stars}
                                onChange={onStarsChange}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="mb-6">
                            <Textarea
                                id="comentario"
                                name="comentario"
                                label="Comentario (opcional)"
                                placeholder="Comentá brevemente cómo fue jugar con este jugador..."
                                rows={4}
                                maxLength={REVIEW_COMMENT_MAX_LENGTH}
                                value={comment}
                                onChange={(e) => onCommentChange?.(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <p className="mt-1 text-right text-xs text-slate-400">
                                {comment.length} / {REVIEW_COMMENT_MAX_LENGTH}
                            </p>
                        </div>

                        {submitError && (
                            <ErrorAlert message={submitError} className="mb-4" />
                        )}

                        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                            <Button
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                id="post-match-submit"
                                onClick={onSubmit}
                                isLoading={isSubmitting}
                                disabled={stars < 1}
                            >
                                Enviar valoración
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

