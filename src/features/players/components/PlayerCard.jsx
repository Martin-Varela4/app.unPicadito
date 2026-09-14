export const PlayerCard = ({ nombre, posicion, nivel }) => {
  return (
    <div className="player-card">
      <h3>{nombre}</h3>
      <p>Posición: {posicion}</p>
      <p>Nivel: {nivel}</p>
    </div>
  );
};