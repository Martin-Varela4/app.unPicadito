export const SearchBar = ({ value, onChange }) => {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      width: "100%", 
      margin: "0 auto" 
    }}>
      <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>

        <span style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none"
        }}>
          🔍
        </span>

        <input
          type="search" // Cambiado de 'text' a 'search' para agregar la "X" nativa de borrado
          placeholder="Buscar por nombre o usuario..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off" // Evita que el navegador encime el historial encima de tu lista
          style={{
            width: "100%",
            padding: "0.75rem 1rem 0.75rem 2.5rem", // Espacio izquierdo para que no se pise con la lupa
            fontSize: "1rem",
            boxSizing: "border-box",
            borderRadius: "0.375rem",
            border: "1px solid #cbd5e1"
          }}
        />
      </div>
    </div>
  );
};
