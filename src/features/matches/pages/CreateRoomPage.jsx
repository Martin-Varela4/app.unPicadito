import Button from '../../../components/Button';
import Switch from '../../../components/Switch';
import { EditRoomFields } from '../components/EditRoom/EditRoomFields';
import { LocationPickerMap } from '../components/LocationPickerMap';
import { useCreateRoom } from '../hooks/useCreateRoom';

export default function CreateRoomPage() {
    const create = useCreateRoom();

    return (
        <main className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 mb-12">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Crear sala</h1>
            <p className="text-sm text-slate-500 mb-6">Completá los datos y armá tu picadito.</p>

            {create.errorMessage && (
                <div role="alert" className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Ubicación en el mapa
                    </label>
                    <LocationPickerMap
                        value={create.formData.ubicacion}
                        onChange={(coords) => create.handleChange('ubicacion', coords)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-slate-100">
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

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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