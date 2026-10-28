import { DEFAULT_EMPTY_LASTNAME } from "../../../constants/appConstants";

export const mapUserToProfile = (rawUser) => {
  if (!rawUser) return null;
  const apellidoLimpio =
    !rawUser.apellido || rawUser.apellido.trim().toLowerCase() === DEFAULT_EMPTY_LASTNAME.toLowerCase()
      ? ""
      : rawUser.apellido;

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

    reviews: (rawUser.resenasRecibidas || []).map(r => ({
      id: r.id,
      estrellas: r.estrellas,
      comentario: r.comentario,
      creadoEn: r.creadoEn,
      calificador: r.calificador ? {
        nombre: r.calificador.nombre,
        nombreUsuario: r.calificador.nombreUsuario,
        avatar: r.calificador.fotoPerfilUrl
      } : null
    })),
  };
};
