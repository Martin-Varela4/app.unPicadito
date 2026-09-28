import React, { useState } from "react";
import { Star, CheckCircle } from "lucide-react";

const jugadoresIniciales = [
    {
        id: 1,
        nombre: "Martín González",
        username: "@marting",
        posicion: "Delantero",
        avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
        id: 2,
        nombre: "Lucas Fernández",
        username: "@lucasf",
        posicion: "Mediocampista",
        avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
        id: 3,
        nombre: "Santiago López",
        username: "@santil",
        posicion: "Defensor",
        avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
        id: 4,
        nombre: "Nicolás Ramírez",
        username: "@nico.r",
        posicion: "Arquero",
        avatar: "https://i.pravatar.cc/150?img=14",
    },
    {
        id: 5,
        nombre: "Diego Martínez",
        username: "@diegom",
        posicion: "Delantero",
        avatar: "https://i.pravatar.cc/150?img=15",
    },
];

const PostMatchRating = () => {
    const [jugadores, setJugadores] = useState(jugadoresIniciales);
    const [jugadorSeleccionado, setJugadorSeleccionado] =
        useState(null);

    const [puntuacion, setPuntuacion] = useState(0);
    const [comentario, setComentario] = useState("");

    const seleccionarJugador = (jugador) => {
        setJugadorSeleccionado(jugador);
        setPuntuacion(0);
        setComentario("");
    };

    const seleccionarEstrella = (valor) => {
        setPuntuacion(valor);
    };

    const enviarValoracion = (e) => {
        e.preventDefault();
        if (!jugadorSeleccionado) {
            return;
        }
        if (puntuacion === 0) {
            alert("Seleccioná una puntuación.");
            return;
        }
        console.log("Valoración enviada:", {
            jugadorId: jugadorSeleccionado.id,
            puntuacion,
            comentario,
        });

        setJugadores((jugadoresActuales) =>
            jugadoresActuales.map((jugador) =>
                jugador.id === jugadorSeleccionado.id
                    ? {
                        ...jugador,
                        valorado: true,
                    }
                    : jugador
            )
        );
        setJugadorSeleccionado(null);
        setPuntuacion(0);
        setComentario("");
    };

    return (
        <section className="w-full overflow-hidden rounded-2x1 border-slate-200 bg-white shadow-sm">
           
            
            {/* CONTENIDO */}
            <div className="grid min-h-[450px] grid-cols-1 md:grid-cols-[320px_1fr]">
                {/* LISTA DE JUGADORES */}
                <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">
                        Jugadores del partido
                    </h3>

                    <div className="flex flex-col gap-2">
                        {jugadores.map((jugador) => (

                            <button
                                type="button"
                                key={jugador.id}
                                onClick={() =>
                                    seleccionarJugador(jugador)
                                }
                                className={`
                                    flex 2-full items-center gap-3
                                    rounded-x1 border p-2.5
                                    text-left transition
                                    ${
                                        jugadorSeleccionado?.id ===
                                        jugador.id
                                        ? "border-emerald-200 bg-emerald-50"
                                        : "border- transparent hover:bg-slate-50"
                                    }
                                `}
                            >
                                <img
                                    src={jugador.avatar}
                                    alt={jugador.nombre}
                                    className="h-11 w-11 rounded-full object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <strong className="block truncate text-sm font-semibold text-slate-900">
                                        {jugador.nombre}
                                    </strong>

                                    <span className="text-xs text-slate-500">
                                        {jugador.posicion}
                                    </span>

                                </div>
                                {jugador.valorado && (
                                    <CheckCircle
                                        size={20}
                                        className="shrink-0 text-emerald-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FORMULARIO */}
                <div className="p-6 md:p-8">
                    {!jugadorSeleccionado ? (
                        <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center text-slate-500">
                            <Star 
                            size={42}
                            className="mb-3 text-slate-300"
                            />
                            <h3 className="text-base font-semibold text-slate-900">
                                Seleccioná un jugador
                            </h3>
                            <p className="mt-1 max-w-sm text-sm">
                                Elegí a un jugador de la lista
                                para dejarle una valoración.
                            </p>
                        </div>
                    ) : (
                        <form
                            className="max-w-x1"
                            onSubmit={enviarValoracion}
                        >
                            <div className="mb-7 flex items-center gap-3.5">
                                <img
                                    src={jugadorSeleccionado.avatar}
                                    alt={jugadorSeleccionado.nombre}
                                    className="h-14 w-14 rounded-full object-cover"
                                />
                                <div>
                                    <strong className="block text-base font-semibold text-slate-900">
                                        {jugadorSeleccionado.nombre}
                                    </strong>
                                    <span className="text-sm text-slate-500">
                                        {jugadorSeleccionado.posicion}
                                    </span>
                                </div>
                            </div>

                            {/* ESTRELLAS */}
                            <div className="mb-7">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Puntuación
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(
                                        (estrella) => (
                                            <button
                                                type="button"
                                                key={estrella}
                                                onClick={() =>
                                                    seleccionarEstrella(
                                                        estrella
                                                    )
                                            }
                                            className={`
                                                rounded-md p-1
                                                transition
                                                hover:scale-110
                                                ${
                                                    estrella <=
                                                    puntuacion
                                                        ? "text-amber-400"
                                                        : "text-slate-300"
                                                }
                                            `}

                                            >
                                                <Star
                                                    size={34}
                                                    fill={
                                                        estrella <=
                                                        puntuacion
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />
                                            </button>

                                        )
                                    )}
                                </div>
                                <span className="mt-2 block text-xs text-slate-500">
                                    {puntuacion === 0 &&
                                        "Seleccioná una puntuación"}
                                    {puntuacion === 1 &&
                                        "Jugador mediocre"}
                                    {puntuacion === 2 &&
                                        "Podría mejorar"}
                                    {puntuacion === 3 &&
                                        "Buen jugador"}
                                    {puntuacion === 4 &&
                                        "Muy buen jugador"}
                                    {puntuacion === 5 &&
                                        "Crack!"}
                                </span>
                            </div>

                            {/* COMENTARIO */}
                            <div className="relative mb-6">
                                <label 
                                htmlFor="comentario"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Comentario
                                </label>
                                
                                <textarea
                                    id="comentario"
                                    value={comentario}
                                    onChange={(e) =>
                                        setComentario(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Comentá brevemente cómo fue jugar con este jugador..."
                                    rows={5}
                                    maxLength={300}
                                    className="
                                        w-full resize-y rounded-xl
                                        border border-slate-200
                                        bg-white p-3
                                        text-sm text-slate-700
                                        outline-none
                                        placeholder:text-slate-400
                                        focus:border-emerald-500
                                        focus:ring-2
                                        focus:ring-emerald-100
                                    "
                                />
                                <span>
                                    {comentario.length}/300
                                </span>
                            </div>

                            {/* BOTONES */}
                            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setJugadorSeleccionado(null);
                                        setPuntuacion(0);
                                        setComentario("");
                                    }}
                                     className="
                                        rounded-xl
                                        border border-slate-200
                                        bg-white
                                        px-5 py-2.5
                                        text-sm font-semibold
                                        text-slate-700
                                        transition
                                        hover:bg-slate-50
                                    "
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="
                                        rounded-xl
                                        bg-emerald-500
                                        px-5 py-2.5
                                        text-sm font-semibold
                                        text-white
                                        transition
                                        hover:bg-emerald-600
                                    "
                                >
                                    Enviar valoración
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PostMatchRating;