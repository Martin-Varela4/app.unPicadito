// En src/features/matches/pages/CreateRoomPage.jsx
// ... (importaciones previas)
import { LocationSection } from '../components/CreateRoom/LocationSection';
import { DateTimeSection } from '../components/CreateRoom/DateTimeSection';
import { CapacitySection } from '../components/CreateRoom/CapacitySection';
import { PrivacySection } from '../components/CreateRoom/PrivacySection';

// ... dentro del return:
<FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmitClick)} className="space-y-6">
        <LocationSection />
        <DateTimeSection />
        <CapacitySection />
        <PrivacySection />

        <div className="flex justify-end pt-4">
            <button
                type="submit"
                disabled={submitStatus.type === 'loading'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
                {submitStatus.type === 'loading' ? 'Creando...' : 'Crear Sala'}
            </button>
        </div>
    </form>
</FormProvider>