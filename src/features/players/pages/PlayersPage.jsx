import { useState, useEffect } from "react";
import { usePlayerStore } from "../store/player.store";
import { useDebounce } from "../hooks/useDebounce";
import { validateSearch } from "../schemas/searchPlayer.schema";
import { SearchBar } from "../components/SearchBar";
import { PlayerList } from "../components/PlayerList";
import Spinner from "../../../components/ui/Spinner";

export const PlayersPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [validationError, setValidationError] = useState(null);
  const debouncedSearch = useDebounce(searchInput, 400);

  const players = usePlayerStore((state) => state.players);
  const loading = usePlayerStore((state) => state.loading);
  const error = usePlayerStore((state) => state.error);
  const fetchPlayers = usePlayerStore((state) => state.fetchPlayers);

  useEffect(() => {
    const validateAndFetch = async () => {
      if (debouncedSearch.trim() === "") {
        setValidationError(null);
        fetchPlayers("");
        return;
      }

      const result = await validateSearch(debouncedSearch);
      if (!result.valid) {
        setValidationError(result.error);
        return;
      }

      setValidationError(null);
      fetchPlayers(debouncedSearch);
    };

    validateAndFetch();
  }, [debouncedSearch, fetchPlayers]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
           Buscar Jugadores
        </h1>
        <p className="text-sm text-slate-300 sm:text-base">
          Busca y filtra los mejores perfiles disponibles para tu sala
        </p>
      </header>

      <section className="relative mb-8">
        <SearchBar value={searchInput} onChange={setSearchInput} />
        
        {validationError && (
          <div role="alert" className="mt-2 rounded-md border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
            ⚠️ {validationError}
          </div>
        )}
      </section>

      <main className="min-h-[300px]">
        {loading && (
          <div className="flex flex-col items-center gap-4 py-12 text-slate-300">
            <Spinner label="Buscando jugadores en la cancha..." />
          </div>
        )}

        {error && !loading && (
          <div role="alert" className="rounded-md border border-red-500/40 bg-red-950/40 p-6 text-center text-red-200">
            <h3 className="mb-2 font-bold">Hubo un problema de conexión</h3>
            <p className="mb-4 text-sm">{error}</p>
            <button 
              onClick={() => fetchPlayers(debouncedSearch)}
              className="min-h-11 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              Reintentar conexión
            </button>
          </div>
        )}

        {/* 3. Resultados Exitosos u Opciones Vacías */}
        {!loading && !error && (
          <>
            {players.length > 0 ? (
              <div>
                {/* Pequeño contador de resultados para dar contexto */}
                <p className="mb-4 text-sm text-slate-400">
                  Se encontraron <strong>{players.length}</strong> jugadores disponibles
                </p>
                <PlayerList players={players} />
              </div>
            ) : (
              
              <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/50 px-4 py-16 text-center">
                <span className="text-5xl" aria-hidden="true">🏃‍♂️💨</span>
                <h3 className="mt-4 font-semibold text-slate-200">
                  {searchInput ? "No hay coincidencias" : "Sin jugadores en la base de datos"}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  {searchInput 
                    ? `No encontramos a nadie que coincida con "${searchInput}". Intenta con otro nombre o posición.`
                    : "Parece que aún no se han registrado usuarios en el sistema desde el panel del backend."}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
