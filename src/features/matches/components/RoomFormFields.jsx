import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import HourPicker from '../../../components/HourPicker';

export const RoomFormFields = ({ values, errors = {}, isTimeLocked = false, onChange }) => {
    const handleChange = (event) => onChange(event.target.name, event.target.value);
    const lockedClass = isTimeLocked ? 'bg-slate-800 text-slate-400 border-slate-700' : '';

    return (
        <div className="space-y-4">
            <Input
                name="nombre"
                label="Nombre del Partido"
                placeholder="Ej: Partido de fútbol 5"
                value={values.nombre}
                onChange={handleChange}
                error={errors.nombre}
            />
            
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                    name="nombreCancha"
                    label="Complejo / Cancha (Opcional)"
                    value={values.nombreCancha || ''}
                    onChange={handleChange}
                    disabled={isTimeLocked}
                    className={lockedClass}
                    error={errors.nombreCancha}
                />
                <Input
                    name="direccion"
                    label="Dirección (Opcional)"
                    value={values.direccion || ''}
                    onChange={handleChange}
                    disabled={isTimeLocked || !values.nombreCancha} 
                    className={`${lockedClass} ${!values.nombreCancha ? 'opacity-60 cursor-not-allowed' : ''}`}
                    error={errors.direccion}
                    placeholder={values.nombreCancha ? "Ej: Av. Siempre Viva 123" : "Seleccioná una cancha primero"}
                />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                    name="fecha"
                    type="date"
                    label="Fecha"
                    value={values.fecha}
                    onChange={handleChange}
                    disabled={isTimeLocked}
                    className={lockedClass}
                    error={errors.fecha}
                />
                
                <HourPicker
                    name="hora"
                    value={values.hora || ''}
                    onChange={handleChange}
                    disabled={isTimeLocked}
                    className={lockedClass}
                    error={errors.hora}
                />
            </div>

            <Input
                name="cuposTotales"
                type="number"
                label="Cupos Totales de Jugadores"
                value={values.cuposTotales}
                onChange={handleChange}
                error={errors.cuposTotales}
            />
            
            <Textarea
                name="descripcion"
                label="Descripción / Indicaciones (Opcional)"
                placeholder="Ej: Traer pechera o camiseta clara..."
                value={values.descripcion || ''}
                onChange={handleChange}
                error={errors.descripcion}
                rows={3}
            />
        </div>
    );
};

export const EditRoomFields = RoomFormFields;
