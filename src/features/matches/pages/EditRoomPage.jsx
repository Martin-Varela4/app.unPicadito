import { ConfirmModal } from '../../../components/ConfirmModal';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { useParams } from 'react-router-dom';
import { EditRoomFields } from '../components/EditRoom/EditRoomFields';
import { useEditRoom } from '../hooks/useEditRoom';

export const EditRoomPage = () => {
    const { id } = useParams();
    const edit = useEditRoom(id);

    if (edit.isLoading) {
        return <div className="flex justify-center items-center py-20"><Spinner /></div>;
    }
    if (!edit.room) {
        return <p role="alert" className="text-center py-10 text-red-600">{edit.errorMessage}</p>;
    }

    return (
        <main className="mx-auto mt-4 w-[calc(100%-2rem)] max-w-2xl rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:mt-6 sm:p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-1">Editar Partido</h1>
            {edit.isTimeLocked && (
                <p className="my-4 rounded border-l-4 border-amber-500 bg-amber-950/40 p-4 text-sm text-amber-200">
                    Faltan menos de 24 horas. Fecha, hora y ubicación están bloqueadas.
                </p>
            )}
            {edit.errorMessage && <p role="alert" className="my-4 text-red-200">{edit.errorMessage}</p>}
            <form onSubmit={edit.handleSubmit} className="space-y-4">
                <EditRoomFields
                    values={edit.formData}
                    errors={edit.fieldErrors}
                    isTimeLocked={edit.isTimeLocked}
                    onChange={edit.handleChange}
                />
                <div className="flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row">
                    <Button type="button" variant="secondary" onClick={edit.cancel}>Cancelar</Button>
                    <Button type="submit" isLoading={edit.isSubmitting}>Guardar Cambios</Button>
                </div>
            </form>
            <ConfirmModal
                isOpen={edit.isModalOpen}
                onClose={edit.closeModal}
                onConfirm={edit.confirmSubmit}
                isLoading={edit.isSubmitting}
                title="Confirmar cambios en la sala"
                message="¿Deseas guardar los cambios aplicados?"
            />
        </main>
    );
};
