import Alert from '../../../components/ui/Alert';
import Button from '../../../components/ui/Button';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import LoadingState from '../../../components/ui/LoadingState';
import SectionCard from '../../../components/ui/SectionCard';
import { usePostMatchRating } from '../hooks/usePostMatchRating';
import { PendingPlayersList } from './PendingPlayersList';
import { PostMatchRatingForm } from './PostMatchRatingForm';

export const PostMatchRating = ({ roomId }) => {
    const {
        pendientes,
        loading,
        loadError,
        reload,
        selectedPlayer,
        selectedId,
        selectPlayer,
        stars,
        setStars,
        comment,
        setComment,
        isSubmitting,
        submitError,
        successMessage,
        submit,
    } = usePostMatchRating(roomId);

    return (
        <SectionCard id="post-match-rating" title="Calificá a tus compañeros">
            {loading && (
                <LoadingState label="Cargando jugadores..." className="py-8" />
            )}

            {!loading && loadError && (
                <div className="flex flex-col items-start gap-3">
                    <ErrorAlert message={loadError} className="w-full" />
                    <Button variant="outline" onClick={reload}>
                        Reintentar
                    </Button>
                </div>
            )}

            {!loading && !loadError && pendientes.length === 0 && (
                <div className="space-y-3">
                    {successMessage && (
                        <Alert variant="success" message={successMessage} />
                    )}
                    <p className="text-sm text-slate-300">
                        No tenés jugadores pendientes de calificar en este partido.
                    </p>
                </div>
            )}

            {!loading && !loadError && pendientes.length > 0 && (
                <div className="grid min-h-[340px] grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
                    <PendingPlayersList
                        players={pendientes}
                        selectedId={selectedId}
                        disabled={isSubmitting}
                        onSelect={selectPlayer}
                    />
                    <PostMatchRatingForm
                        player={selectedPlayer}
                        stars={stars}
                        onStarsChange={setStars}
                        comment={comment}
                        onCommentChange={setComment}
                        isSubmitting={isSubmitting}
                        submitError={submitError}
                        successMessage={successMessage}
                        onCancel={() => selectPlayer(null)}
                        onSubmit={submit}
                    />
                </div>
            )}
        </SectionCard>
    );
};

