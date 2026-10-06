import { useState } from 'react';
import { CapacitySection } from '../components/CreateRoom/CapacitySection';
import { DateTimeSection } from '../components/CreateRoom/DateTimeSection';
import { LocationSection } from '../components/CreateRoom/LocationSection';
import { PrivacySection } from '../components/CreateRoom/PrivacySection';

const initialValues = {
    locationId: '',
    date: '',
    time: '',
    maxPlayers: '10',
    privacy: 'PUBLIC',
    entryRequirement: 'NONE',
};

export default function CreateRoomPage() {
    const [values, setValues] = useState(initialValues);
    const [message, setMessage] = useState('');

    const handleChange = (name, value) => {
        setValues((current) => ({ ...current, [name]: value }));
        setMessage('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage('La creación de salas todavía no está conectada al servicio de la API.');
    };

    return (
        <main className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Crear sala</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <LocationSection values={values} errors={{}} onChange={handleChange} />
                <DateTimeSection values={values} errors={{}} onChange={handleChange} />
                <CapacitySection values={values} errors={{}} onChange={handleChange} />
                <PrivacySection values={values} errors={{}} onChange={handleChange} />
                {message && <p role="alert" className="text-sm text-amber-700">{message}</p>}
                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                        Crear Sala
                    </button>
                </div>
            </form>
        </main>
    );
}
