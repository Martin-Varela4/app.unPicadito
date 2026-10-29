import SectionCard from '../../../components/ui/SectionCard';

export const RoomSlotsSummary = ({ maxPlayers, confirmedCount, availableSlots }) => {
    return (
        <SectionCard title="Estado de Cupos" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-950/40 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-sky-300">{maxPlayers}</p>
                    <p className="text-xs text-slate-400 mt-1">Máximo</p>
                </div>
                <div className="bg-green-950/40 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-green-300">{confirmedCount}</p>
                    <p className="text-xs text-slate-400 mt-1">Confirmados</p>
                </div>
                <div className="rounded-md bg-amber-950/40 p-3">
                    <p className="text-2xl font-bold text-amber-300">{availableSlots}</p>
                    <p className="text-xs text-slate-400 mt-1">Vacantes</p>
                </div>
            </div>
        </SectionCard>
    );
};
