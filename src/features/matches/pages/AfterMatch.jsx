import { Star } from "lucide-react";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";

const PostMatchRating = () => {
    const jugadorEjemplo = {
        nombre: "Mateo Fernández",
        posicion: "Delantero",
        iniciales: "MF",
    };
    const puntuacion = 5;

    return (
        <section className="w-full overflow-hidden rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)]">
            {/* CONTENIDO */}
            <div className="grid min-h-[450px] grid-cols-1 md:grid-cols-[320px_1fr]">
                {/* LISTA DE JUGADORES */}
                <div className="border-b border-slate-700 p-6 md:border-b-0 md:border-r">
                    <h3 className="mb-4 text-base font-semibold text-slate-100">
                        Jugadores del partido
                    </h3>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 border border-[var(--color-brand-primary)]/30 bg-slate-800 p-2.5">
                            <div className="flex w-full items-center gap-3 text-left">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">
                                    {jugadorEjemplo.iniciales}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <strong className="block truncate text-sm font-semibold">
                                        {jugadorEjemplo.nombre}
                                    </strong>

                                    <span className="text-xs text-slate-400">
                                        {jugadorEjemplo.posicion}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORMULARIO */}
                <div className="p-6 md:p-8">
                    <div className="max-w-xl">
                            <div className="mb-7 flex items-center gap-3.5">
                                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">
                                    {jugadorEjemplo.iniciales}
                                </span>
                                <div>
                                    <strong className="block text-base font-semibold text-slate-100">
                                        {jugadorEjemplo.nombre}
                                    </strong>
                                    <span className="text-sm text-slate-400">
                                        {jugadorEjemplo.posicion}
                                    </span>
                                </div>
                            </div>

                            {/* ESTRELLAS */}
                            <div className="mb-7">
                                <label className="mb-2 block text-sm font-semibold text-slate-200">
                                    Puntuación
                                </label>
                                <div className="flex items-center gap-2 text-amber-300" aria-label="Puntuación fija de 5 sobre 5">
                                    <Star size={18} fill="currentColor" />
                                    <span>{puntuacion}/5</span>
                                </div>
                            </div>

                            {/* COMENTARIOS */}
                            <div className="mb-6">
                                <Textarea
                                    id="comentario"
                                    label="Comentario"
                                    placeholder="Comentá brevemente cómo fue jugar con este jugador..."
                                    rows={4}
                                    readOnly
                                    tabIndex={-1}
                                />
                            </div>

                            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                                <Button
                                    variant="outline"
                                    aria-disabled="true"
                                    tabIndex={-1}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    aria-disabled="true"
                                    tabIndex={-1}
                                >
                                    Enviar valoración
                                </Button>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PostMatchRating;