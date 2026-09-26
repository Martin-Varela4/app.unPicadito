// src/features/players/components/PlayerList.jsx
import React from 'react';

export const PlayerList = ({ players }) => {
  const handleViewProfile = (playerId, username) => {
    // guía para el que tenga que implementar la navegación a la página de perfil del jugador
    console.log(`[Futura Implementación]: Redirigir a /players/${playerId}`);
    alert(`acá se abririía el perfil de @${username} (ID: ${playerId})`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
      {players.map((player) => (
        <div 
          key={player.id} 
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
            padding: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* Datos del Jugador */}
          <div>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#2d3748" }}>
              {player.nombre} {player.apellido}{" "}
              <span style={{ color: "#718096", fontSize: "0.9rem", fontWeight: "400" }}>
                (@{player.nombreUsuario})
              </span>
            </h3>
            <p style={{ margin: 0, color: "#4a5568" }}>
              <strong>Posición:</strong> {player.posicionPrincipal}
            </p>
          </div>

          {/* Botón de ejemplo */}
          <button
            onClick={() => handleViewProfile(player.id, player.nombreUsuario)}
            style={{
              backgroundColor: "#edf2f7",
              color: "#4a5568",
              border: "1px solid #cbd5e1",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "600",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#e2e8f0"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#edf2f7"}
          >
            Ver Perfil 
          </button>
        </div>
      ))}
    </div>
  );
};
