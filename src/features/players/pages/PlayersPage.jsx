import { useState, useEffect } from "react";
import { usePlayerStore } from "../store/usePlayerStore";
import { useDebounce } from "../../../hooks/useDebounce";
import { DEBOUNCE_DELAY_MS } from "../../../constants/appConstants";
import { validateSearch } from "../schemas/searchPlayerSchema";
import SearchInput from "../../../components/ui/SearchInput";
import { PlayerList } from "../components/PlayerList";
import PageContainer from "../../../components/ui/PageContainer";
import LoadingState from "../../../components/ui/LoadingState";
import EmptyState from "../../../components/ui/EmptyState";
import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";

export const PlayersPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [validationError, setValidationError] = useState(null);
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_DELAY_MS);

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
    <PageContainer
      size="lg"
      title="Buscar Jugadores"
      subtitle="Busca y filtra los mejores perfiles disponibles para tu sala"
    >
      <section className="relative mb-8">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput("")}
          placeholder="Buscar por nombre o posición..."
        />
        
        {validationError && (
          <Alert className="mt-2" message={validationError} />
        )}
      </section>

      <main className="min-h-[300px]">
        {loading && (
          <LoadingState label="Buscando jugadores en la cancha..." />
        )}

        {error && !loading && (
          <Alert variant="error" className="flex-col text-center p-6" icon={null}>
            <h3 className="mb-2 font-bold">Hubo un problema de conexión</h3>
            <p className="mb-4 text-sm">{error}</p>
            <Button 
              variant="danger"
              onClick={() => fetchPlayers(debouncedSearch)}
            >
              Reintentar conexión
            </Button>
          </Alert>
        )}

        {!loading && !error && (
          <>
            {players.length > 0 ? (
              <div>
                <p className="mb-4 text-sm text-slate-400">
                  Se encontraron <strong>{players.length}</strong> jugadores disponibles
                </p>
                <PlayerList players={players} />
              </div>
            ) : (
              <EmptyState
                icon="🏃‍♂️💨"
                title={searchInput ? "No hay coincidencias" : "Sin jugadores en la base de datos"}
                description={
                  searchInput
                    ? `No encontramos a nadie que coincida con "${searchInput}". Intenta con otro nombre o posición.`
                    : "Parece que aún no se han registrado usuarios en el sistema desde el panel del backend."
                }
              />
            )}
          </>
        )}
      </main>
    </PageContainer>
  );
};
