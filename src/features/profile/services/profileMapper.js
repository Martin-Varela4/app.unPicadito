import { DEFAULT_EMPTY_LASTNAME } from "../../../constants/appConstants";

export const mapUserToProfile = (rawUser) => {
  if (!rawUser) return null;
  const apellidoLimpio =
    !rawUser.apellido || rawUser.apellido.trim().toLowerCase() === DEFAULT_EMPTY_LASTNAME.toLowerCase()
      ? ""
      : rawUser.apellido;

  const reviews = [...(rawUser.resenasRecibidas || [])]
    .sort((a, b) => new Date(b.creadoEn || 0) - new Date(a.creadoEn || 0))
    .map((r) => ({
      id: r.id,
      estrellas: r.estrellas,
      comentario: r.comentario,
      creadoEn: r.creadoEn,
      calificador: r.calificador ? {
        id: r.calificador.id,
        nombre: r.calificador.nombre,
        apellido: r.calificador.apellido,
        nombreUsuario: r.calificador.nombreUsuario,
        avatar: r.calificador.fotoPerfilUrl,
      } : null,
    }));

  return {
    id: rawUser.id,
    name: `${rawUser.nombre || ''} ${apellidoLimpio}`.trim(),
    username: rawUser.nombreUsuario,
    avatar: rawUser.fotoPerfilUrl ?? null,
    position: rawUser.posicionPrincipal,
    reputacion: rawUser.reputacion,

    about: rawUser.about ?? null,
    age: rawUser.age ?? null,
    location: rawUser.location ?? null,

    reviews,
  };
};
