import { useState, useEffect } from "react";
import { usePlayerStore } from "../store/player.store";
import { useDebounce } from "../hooks/useDebounce";
import { validateSearch } from "../schemas/searchPlayer.schema";
import { SearchBar } from "../components/SearchBar";
import { PlayerList } from "../components/PlayerList";

export const PlayersPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [validationError, setValidationError] = useState(null);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Selectores optimizados de Zustand
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      {/* Encabezado Principal */}
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1a202c", marginBottom: "0.5rem" }}>
           Buscar Jugadores
        </h1>
        <p style={{ color: "#4a5568", fontSize: "1.1rem" }}>
          Busca y filtra los mejores perfiles disponibles para tu sala
        </p>
      </header>

      {/* Barra de Búsqueda y Validación */}
      <section style={{ marginBottom: "2rem", position: "relative" }}>
        <SearchBar value={searchInput} onChange={setSearchInput} />
        
        {validationError && (
          <div style={{ 
            color: "#e53e3e", 
            backgroundColor: "#fff5f5", 
            padding: "0.75rem", 
            borderRadius: "0.375rem", 
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            border: "1px solid #fed7d7"
          }}>
            ⚠️ {validationError}
          </div>
        )}
      </section>

      {/* Contenedor Principal de Resultados */}
      <main style={{ minHeight: "300px" }}>
        {/* 1. Estado de Carga Simulado (Skeleton / Spinner) */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#4a5568" }}>
            <div className="spinner" style={{
              border: "4px solid rgba(0,0,0,0.1)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              borderLeftColor: "#3182ce",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem auto"
            }}></div>
            <p style={{ fontWeight: "500" }}>Buscando jugadores en la cancha...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* 2. Estado de Error de Red */}
        {error && !loading && (
          <div style={{ 
            textAlign: "center", 
            padding: "2.5rem", 
            backgroundColor: "#fff5f5", 
            borderRadius: "0.5rem", 
            border: "1px solid #fed7d7",
            color: "#c53030" 
          }}>
            <h3 style={{ marginBottom: "0.5rem", fontWeight: "700" }}>Hubo un problema de conexión</h3>
            <p style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>{error}</p>
            <button 
              onClick={() => fetchPlayers(debouncedSearch)}
              style={{
                backgroundColor: "#e53e3e",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontWeight: "600"
              }}
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
                <p style={{ color: "#718096", fontSize: "0.9rem", marginBottom: "1rem" }}>
                  Se encontraron <strong>{players.length}</strong> jugadores disponibles
                </p>
                <PlayerList players={players} />
              </div>
            ) : (
              
              <div style={{ 
                textAlign: "center", 
                padding: "4rem 1rem", 
                backgroundColor: "#f7fafc", 
                borderRadius: "0.5rem", 
                border: "1px dashed #e2e8f0" 
              }}>
                <span style={{ fontSize: "3rem" }}>🏃‍♂️💨</span>
                <h3 style={{ color: "#4a5568", marginTop: "1rem", fontWeight: "600" }}>
                  {searchInput ? "No hay coincidencias" : "Sin jugadores en la base de datos"}
                </h3>
                <p style={{ color: "#718096", fontSize: "0.95rem", maxWidth: "400px", margin: "0.5rem auto 0 auto" }}>
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
