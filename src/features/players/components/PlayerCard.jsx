export const PlayerCard = ({ nombre, posicion, nivel }) => {
  return (
    <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4">
      <h3 className="font-semibold text-slate-100">{nombre}</h3>
      <p className="mt-1 text-sm text-slate-300">Posición: {posicion}</p>
      <p className="text-sm text-slate-300">Nivel: {nivel}</p>
    </div>
  );
};