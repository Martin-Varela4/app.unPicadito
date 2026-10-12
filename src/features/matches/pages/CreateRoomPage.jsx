import Button from '../../../components/ui/Button';
import Switch from '../../../components/ui/Switch';
import { EditRoomFields } from '../components/EditRoom/EditRoomFields';
import { LocationPickerMap } from '../components/LocationPickerMap';
import { useCreateRoom } from '../hooks/useCreateRoom';

export default function CreateRoomPage() {
    const create = useCreateRoom();

    return (
        <main className="mx-auto mb-12 mt-4 w-[calc(100%-2rem)] max-w-2xl rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:mt-6 sm:p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-1">Crear sala</h1>
            <p className="text-sm text-slate-400 mb-6">Completá los datos y armá tu picadito.</p>

            {create.errorMessage && (
                <div role="alert" className="p-3 mb-4 rounded-lg bg-red-950/40 border border-red-500/40 text-sm text-red-200">
                    {create.errorMessage}
                </div>
            )}

            <form id="create-room-form" onSubmit={create.handleSubmit} className="space-y-5">
                <EditRoomFields
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

                <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-700 pt-4 sm:flex-row">
                    <Button type="button" variant="secondary" onClick={create.cancel}>
                        Cancelar
                    </Button>
                    <Button id="create-room-submit" type="submit" isLoading={create.isSubmitting}>
                        Crear Sala
                    </Button>
                </div>
            </form>
        </main>
    );
}