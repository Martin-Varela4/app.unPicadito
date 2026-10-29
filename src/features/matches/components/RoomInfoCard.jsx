import SectionCard from '../../../components/ui/SectionCard';
import { LocationPickerMap } from './LocationPickerMap';

export const RoomInfoCard = ({ room }) => {
    const raw = room.raw || {};
    const ubicacion = raw.ubicacion || room.ubicacion || raw.cancha?.predio?.ubicacion;
    const nombreLugar = raw.cancha?.predio?.nombre || raw.nombreCancha || room.location || 'Cancha';
    const direccionLugar = raw.cancha?.predio?.direccion || raw.direccion || '';

    return (
        <SectionCard title="Información del Encuentro" className="space-y-4">
            <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-100">Día y Horario:</span>
                    <span>{room.date} - {room.time} hs</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-100">Predio / Cancha:</span>
                    <span>{nombreLugar}</span>
                </div>
                {direccionLugar && (
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-100">Dirección:</span>
                        <span className="text-slate-300">{direccionLugar}</span>
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-100">Privacidad:</span>
                    <span className="rounded-sm bg-slate-800 px-2 py-1 capitalize text-slate-200">
                        {room.privacy || 'Pública'}
                    </span>
                </div>
            </div>

            {ubicacion && (
                <div className="border-t border-[var(--color-border-subtle)] pt-3">
                    <LocationPickerMap
                        value={ubicacion}
                        label={nombreLugar}
                        direccion={direccionLugar}
                        readOnly
                        height="200px"
                    />
                </div>
            )}
        </SectionCard>
    );
};
