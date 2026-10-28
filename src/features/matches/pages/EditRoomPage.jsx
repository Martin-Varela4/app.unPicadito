import { useParams } from 'react-router-dom';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { RoomFormFields } from '../components/RoomFormFields';
import { useEditRoom } from '../hooks/useEditRoom';
import PageContainer from '../../../components/ui/PageContainer';
import SectionCard from '../../../components/ui/SectionCard';
import FormActions from '../../../components/ui/FormActions';
import LoadingState from '../../../components/ui/LoadingState';
import ErrorAlert from '../../../components/ui/ErrorAlert';

export const EditRoomPage = () => {
    const { id } = useParams();
    const edit = useEditRoom(id);

    if (edit.isLoading) {
        return <LoadingState label="Cargando partido..." className="py-20" />;
    }
    if (!edit.room) {
        return (
            <PageContainer size="sm">
                <ErrorAlert message={edit.errorMessage || 'No se encontró la sala solicitada.'} />
            </PageContainer>
        );
    }

    return (
        <PageContainer size="sm" title="Editar Partido">
            <SectionCard hasDivider={false}>
                {edit.isTimeLocked && (
                    <div className="mb-4 rounded border-l-4 border-amber-500 bg-amber-950/40 p-4 text-sm text-amber-200">
                        Faltan menos de 24 horas. Fecha, hora y ubicación están bloqueadas.
                    </div>
                )}
                {edit.errorMessage && <ErrorAlert className="mb-4" message={edit.errorMessage} />}
                <form onSubmit={edit.handleSubmit} className="space-y-4">
                    <RoomFormFields
                        values={edit.formData}
                        errors={edit.fieldErrors}
                        isTimeLocked={edit.isTimeLocked}
                        onChange={edit.handleChange}
                    />
                    <FormActions
                        onCancel={edit.cancel}
                        cancelText="Cancelar"
                        submitText="Guardar Cambios"
                        isLoading={edit.isSubmitting}
                    />
                </form>
                <ConfirmModal
                    isOpen={edit.isModalOpen}
                    onClose={edit.closeModal}
                    onConfirm={edit.confirmSubmit}
                    isLoading={edit.isSubmitting}
                    title="Confirmar cambios en la sala"
                    message="¿Deseas guardar los cambios aplicados?"
                />
            </SectionCard>
        </PageContainer>
    );
};
