import Switch from '../../../components/ui/Switch';
import { RoomFormFields } from '../components/RoomFormFields';
import { LocationPickerMap } from '../components/LocationPickerMap';
import { useCreateRoom } from '../hooks/useCreateRoom';
import PageContainer from '../../../components/ui/PageContainer';
import SectionCard from '../../../components/ui/SectionCard';
import FormActions from '../../../components/ui/FormActions';
import ErrorAlert from '../../../components/ui/ErrorAlert';

export default function CreateRoomPage() {
    const create = useCreateRoom();

    return (
        <PageContainer size="sm" title="Crear sala" subtitle="Completá los datos y armá tu picadito.">
            <SectionCard hasDivider={false}>
                {create.errorMessage && (
                    <ErrorAlert className="mb-4" message={create.errorMessage} />
                )}

                <form id="create-room-form" onSubmit={create.handleSubmit} className="space-y-5">
                    <RoomFormFields
                        values={create.formData}
                        errors={create.fieldErrors}
                        onChange={create.handleChange}
                    />

                    <div className="pt-2">
                        <label className="block text-sm font-medium text-slate-200 mb-1">
                            Ubicación en el mapa
                        </label>
                        <LocationPickerMap
                            value={create.formData.ubicacion}
                            onChange={(coords) => create.handleChange('ubicacion', coords)}
                        />
                    </div>
                                    
                    <div className="flex flex-col gap-4 border-t border-slate-700 pt-2 md:flex-row">
                        <Switch
                            label="Sala pública (cualquiera puede unirse)"
                            checked={create.formData.esPublica}
                            onChange={(e) => create.handleChange('esPublica', e.target.checked)}
                        />
                        <Switch
                            label="Permitir suplentes"
                            checked={create.formData.permiteSuplentes}
                            onChange={(e) => create.handleChange('permiteSuplentes', e.target.checked)}
                        />
                    </div>

                    <FormActions
                        onCancel={create.cancel}
                        cancelText="Cancelar"
                        submitText="Crear Sala"
                        isLoading={create.isSubmitting}
                        id="create-room-submit"
                    />
                </form>
            </SectionCard>
        </PageContainer>
    );
}
