import React from "react";

export default function HourPicker({ value, onChange, disabled }) {
  // Genera opciones de 00:00 a 23:00
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="form-control" // Ajusta a tu clase de estilo (ej: tailwind "border rounded p-2")
      required
    >
      <option value="" disabled>Seleccioná una hora</option>
      {hours.map((h) => (
        <option key={h.value} value={h.value}>
          {h.label}
        </option>
      ))}
    </select>
  );
}