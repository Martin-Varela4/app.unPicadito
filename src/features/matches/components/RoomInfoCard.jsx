import { LocationPickerMap } from './LocationPickerMap';

export const RoomInfoCard = ({ room }) => {
    const ubicacion = room.raw?.ubicacion;

    return (
        <div className="space-y-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-6">
            <h2 className="border-b border-[var(--color-border-subtle)] pb-2 text-lg font-semibold text-slate-100">Información del Encuentro</h2>

            <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-100">Día y Horario:</span>
                    <span>{room.date} - {room.time} hs</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-100">Predio / Cancha:</span>
                    <span>{room.location}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-100">Privacidad:</span>
                    <span className="rounded-sm bg-slate-800 px-2 py-1 capitalize text-slate-200">
                        {room.privacy || 'Pública'}
                    </span>
                </div>
            </div>

            {ubicacion && (
                <div className="border-t border-[var(--color-border-subtle)] pt-3">
                    <LocationPickerMap value={ubicacion} readOnly height="180px" />
                </div>
            )}
        </div>
    );
};