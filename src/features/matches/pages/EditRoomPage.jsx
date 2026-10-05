import { ConfirmModal } from '../../../components/ConfirmModal';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
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
        <main className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200 mt-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Editar Partido</h1>
            {edit.isTimeLocked && (
                <p className="my-4 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 rounded text-sm">
                    Faltan menos de 24 horas. Fecha, hora y ubicación están bloqueadas.
                </p>
            )}
            {edit.errorMessage && <p role="alert" className="my-4 text-red-700">{edit.errorMessage}</p>}
            <form onSubmit={edit.handleSubmit} className="space-y-4">
                <EditRoomFields
                    values={edit.formData}
                    errors={edit.fieldErrors}
                    isTimeLocked={edit.isTimeLocked}
                    onChange={edit.handleChange}
                />
                <div className="flex justify-end gap-3 pt-4">
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
