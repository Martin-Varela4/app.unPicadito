export const mapUserToProfile = (rawUser) => {
  const apellidoLimpio = 
    !rawUser.apellido || rawUser.apellido.trim().toLowerCase() === "sin apellido"
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