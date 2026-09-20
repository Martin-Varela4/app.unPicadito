import React from "react";
import {
  Home as HomeIcon,
  Search,
  Users,
  MessageCircle,
  Bell,
  ChevronDown,
  CalendarDays,
  MapPin,
  Trophy,
  UserRound,
  Shield,
  Settings,
  Plus,
  CircleUserRound,
  Goal,
  Footprints,
  Clock,
  UserPlus,
  Activity,
  Heart,
  MessageSquare,
  Eye,
} from "lucide-react";

const Home = () => {
  /*
   * ============================================
   * DATOS DEL USUARIO
   * ============================================
   */

  const usuario = {
    nombre: "Juan Carlos Pérez Gómez",
    username: "@juanperez10",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    conexiones: 156,
    partidos: 84,
    victorias: 52,
    goles: 18,
    posicion: "Delantero",
  };

  /*
   * ============================================
   * PARTIDOS ACTUALES
   * ============================================
   */

  const partidos = [
    {
      id: 1,
      titulo: "Partido nocturno",
      fecha: "Hoy",
      hora: "20:00",
      modalidad: "7 vs 7",
      superficie: "Sintético",
      lugar: "Complejo Los Andes",
      ciudad: "Córdoba, Argentina",
      jugadoresActuales: 8,
      jugadoresMaximos: 14,
      imagen:
        "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
      destacado: true,
    },
    {
      id: 2,
      titulo: "Fútbol del sábado",
      fecha: "Mañana",
      hora: "17:00",
      modalidad: "5 vs 5",
      superficie: "Césped",
      lugar: "Club Universitario",
      ciudad: "Córdoba, Argentina",
      jugadoresActuales: 6,
      jugadoresMaximos: 10,
      imagen:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
      destacado: false,
    },
    {
      id: 3,
      titulo: "Mañana de fútbol",
      fecha: "Dom 18 May",
      hora: "10:00",
      modalidad: "6 vs 6",
      superficie: "Sintético",
      lugar: "Predio Norte",
      ciudad: "Córdoba, Argentina",
      jugadoresActuales: 5,
      jugadoresMaximos: 12,
      imagen:
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&q=80",
      destacado: false,
    },
  ];

  /*
   * ============================================
   * ACTIVIDAD RECIENTE
   * ============================================
   */

  const actividades = [
    {
      id: 1,
      nombre: "Ana Fernández",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      texto: "se unió al partido",
      detalle: "Fútbol del sábado",
      tiempo: "Hace 2 horas",
      icono: <CalendarDays size={18} />,
    },
    {
      id: 2,
      nombre: "Diego Ruiz",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      texto: "aceptó tu solicitud",
      detalle: "Ahora son conexiones",
      tiempo: "Hace 4 horas",
      icono: <Users size={18} />,
    },
    {
      id: 3,
      nombre: "Pablo Díaz",
      avatar:
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&h=100&fit=crop",
      texto: "Ganaste el partido con tu equipo",
      detalle: "Los Imparables",
      tiempo: "Ayer",
      icono: <Trophy size={18} />,
    },
  ];

  /*
   * ============================================
   * CONEXIONES SUGERIDAS
   * ============================================
   */

  const conexionesSugeridas = [
    {
      id: 1,
      nombre: "Luis Ramírez",
      conexiones: 12,
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      nombre: "Martín López",
      conexiones: 8,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      nombre: "Pablo Díaz",
      conexiones: 15,
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    },
  ];

  /*
   * ============================================
   * FUNCIONES
   * ============================================
   */

  const handleVerPartido = (partido) => {
    console.log("Ver partido:", partido);
  };

  const handleConectar = (usuario) => {
    console.log("Enviar solicitud a:", usuario);
  };

  const handleCrearPartido = () => {
    console.log("Crear partido");
  };

  return (
    <div className="home-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="home-navbar">
        <div className="home-navbar__inner">

          {/* Logo */}
          <div className="home-navbar__brand">
            <div className="home-navbar__logo">
              ⚽
            </div>

            <div className="home-navbar__brand-text">
              <span>FUTBOL</span>
              <span>CONecta</span>
            </div>
          </div>

          {/* Navegación */}
          <div className="home-navbar__links">

            <button className="home-navbar__link home-navbar__link--active">
              <HomeIcon size={19} />
              <span>Inicio</span>
            </button>

            <button className="home-navbar__link">
              <Search size={19} />
              <span>Buscar Partidos</span>
            </button>

            <button className="home-navbar__link">
              <Users size={19} />
              <span>Comunidad</span>
            </button>

            <button className="home-navbar__link">
              <MessageCircle size={19} />
              <span>Mensajes</span>
            </button>

          </div>

          {/* Acciones */}
          <div className="home-navbar__actions">

            <button className="home-navbar__notification">
              <Bell size={21} />
              <span className="home-navbar__notification-dot"></span>
            </button>

            <div className="home-navbar__user">

              <img
                src={usuario.avatar}
                alt={usuario.nombre}
                className="home-navbar__avatar"
              />

              <ChevronDown
                size={18}
                className="home-navbar__chevron"
              />

            </div>

          </div>

        </div>
      </nav>


      {/* =====================================================
          CONTENEDOR PRINCIPAL
      ===================================================== */}

      <div className="home-layout">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="home-sidebar">

          {/* Usuario */}
          <div className="home-sidebar__profile">

            <div className="home-sidebar__avatar-wrapper">

              <img
                src={usuario.avatar}
                alt={usuario.nombre}
                className="home-sidebar__avatar"
              />

              <span className="home-sidebar__status"></span>

            </div>

            <div className="home-sidebar__profile-info">

              <h3>
                Juan Carlos
                <br />
                Pérez Gómez
              </h3>

              <button className="home-sidebar__profile-link">
                Ver perfil
              </button>

            </div>

          </div>


          {/* Menú */}
          <nav className="home-sidebar__menu">

            <button className="home-sidebar__item home-sidebar__item--active">
              <HomeIcon size={20} />
              <span>Inicio</span>
            </button>

            <button className="home-sidebar__item">
              <CalendarDays size={20} />
              <span>Mis Partidos</span>
            </button>

            <button className="home-sidebar__item">
              <Shield size={20} />
              <span>Mis Equipos</span>
            </button>

            <button className="home-sidebar__item">
              <Users size={20} />
              <span>Mis Conexiones</span>
            </button>

            <button className="home-sidebar__item">
              <MessageCircle size={20} />
              <span>Mensajes</span>
            </button>

            <button className="home-sidebar__item">
              <Bell size={20} />
              <span>Notificaciones</span>
            </button>

            <button className="home-sidebar__item">
              <Settings size={20} />
              <span>Configuración</span>
            </button>

          </nav>


          {/* Crear partido */}
          <button
            className="home-sidebar__create-button"
            onClick={handleCrearPartido}
          >
            <Plus size={20} />
            Crear Partido
          </button>

        </aside>


        {/* =================================================
            CONTENIDO
        ================================================= */}

        <main className="home-content">

          {/* ===============================================
              BIENVENIDA
          =============================================== */}

          <section className="home-welcome">

            <h1>
              ¡Hola, Juan Carlos! 👋
            </h1>

            <p>
              Preparáte para jugar y conectar con otros futboleros.
            </p>

          </section>


          {/* ===============================================
              ESTADÍSTICAS
          =============================================== */}

          <section className="home-stats">

            {/* Partidos */}
            <div className="home-stat-card">

              <div className="home-stat-card__icon">
                <Goal size={28} />
              </div>

              <strong>{usuario.partidos}</strong>

              <span>Partidos jugados</span>

            </div>


            {/* Victorias */}
            <div className="home-stat-card">

              <div className="home-stat-card__icon">
                <Trophy size={28} />
              </div>

              <strong>{usuario.victorias}</strong>

              <span>Victorias</span>

            </div>


            {/* Conexiones */}
            <div className="home-stat-card">

              <div className="home-stat-card__icon">
                <Users size={28} />
              </div>

              <strong>{usuario.conexiones}</strong>

              <span>Conexiones</span>

            </div>


            {/* Posición */}
            <div className="home-stat-card">

              <div className="home-stat-card__icon">
                <Footprints size={28} />
              </div>

              <strong className="home-stat-card__position">
                {usuario.posicion}
              </strong>

              <span>Posición favorita</span>

            </div>

          </section>


          {/* =================================================
              PARTIDOS ACTUALES
          ================================================= */}

          <section className="home-section">

            <div className="home-section__header">

              <h2>
                Partidos actuales
              </h2>

              <button className="home-link-button">
                Ver todos
              </button>

            </div>


            {/* =================================================
                DIV DE PARTIDOS ACTUALES
            ================================================= */}

            <div className="current-matches">

              {partidos.map((partido) => (

                <div
                  className="current-match"
                  key={partido.id}
                >

                  {/* Imagen */}
                  <div className="current-match__image-wrapper">

                    <img
                      src={partido.imagen}
                      alt={partido.titulo}
                      className="current-match__image"
                    />

                    <span className="current-match__badge">
                      {partido.fecha}
                    </span>

                  </div>


                  {/* Información */}
                  <div className="current-match__info">

                    <h3>
                      {partido.titulo}
                    </h3>

                    <div className="current-match__type">

                      <span>
                        {partido.modalidad}
                      </span>

                      <span>•</span>

                      <span>
                        {partido.superficie}
                      </span>

                    </div>


                    {/* Ubicación */}
                    <div className="current-match__location">

                      <MapPin size={17} />

                      <div>

                        <strong>
                          {partido.lugar}
                        </strong>

                        <span>
                          {partido.ciudad}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Hora */}
                  <div className="current-match__time">

                    <Clock size={18} />

                    <strong>
                      {partido.hora}
                    </strong>

                    <span>
                      {partido.fecha}
                    </span>

                  </div>


                  {/* Jugadores */}
                  <div className="current-match__players">

                    <strong>
                      {partido.jugadoresActuales} /{" "}
                      {partido.jugadoresMaximos}
                    </strong>

                    <span>
                      Jugadores
                    </span>

                    <div className="current-match__progress">

                      <div
                        className="current-match__progress-bar"
                        style={{
                          width: `${
                            (partido.jugadoresActuales /
                              partido.jugadoresMaximos) *
                            100
                          }%`,
                        }}
                      ></div>

                    </div>

                  </div>


                  {/* Acción */}
                  <button
                    className="home-primary-button current-match__button"
                    onClick={() => handleVerPartido(partido)}
                  >
                    Ver y unirme
                  </button>

                </div>

              ))}

            </div>

          </section>


          {/* =================================================
              ACTIVIDAD + CONEXIONES
          ================================================= */}

          <div className="home-two-columns">


            {/* ===============================================
                ACTIVIDAD RECIENTE
            =============================================== */}

            <section className="home-section">

              <div className="home-section__header">

                <h2>
                  Actividad reciente
                </h2>

                <Activity size={20} />

              </div>


              <div className="home-activity-list">

                {actividades.map((actividad) => (

                  <div
                    className="home-activity"
                    key={actividad.id}
                  >

                    <div className="home-activity__avatar-wrapper">

                      <img
                        src={actividad.avatar}
                        alt={actividad.nombre}
                        className="home-activity__avatar"
                      />

                    </div>


                    <div className="home-activity__content">

                      <p>
                        <strong>
                          {actividad.nombre}
                        </strong>{" "}
                        {actividad.texto}
                      </p>

                      <span>
                        {actividad.detalle}
                      </span>

                      <small>
                        {actividad.tiempo}
                      </small>

                    </div>


                    <div className="home-activity__icon">
                      {actividad.icono}
                    </div>

                  </div>

                ))}

              </div>


              <button className="home-link-button home-activity__more">
                Ver toda la actividad
              </button>

            </section>


            {/* ===============================================
                CONEXIONES SUGERIDAS
            =============================================== */}

            <section className="home-section">

              <div className="home-section__header">

                <h2>
                  Conexiones sugeridas
                </h2>

                <button className="home-link-button">
                  Ver todas
                </button>

              </div>


              <div className="home-suggestions">

                {conexionesSugeridas.map((conexion) => (

                  <div
                    className="home-suggestion"
                    key={conexion.id}
                  >

                    <img
                      src={conexion.avatar}
                      alt={conexion.nombre}
                      className="home-suggestion__avatar"
                    />


                    <div className="home-suggestion__info">

                      <strong>
                        {conexion.nombre}
                      </strong>

                      <span>
                        {conexion.conexiones} conexiones en común
                      </span>

                    </div>


                    <button
                      className="home-suggestion__button"
                      onClick={() => handleConectar(conexion)}
                    >
                      <UserPlus size={15} />
                      Conectar
                    </button>

                  </div>

                ))}

              </div>

            </section>

          </div>


          {/* =================================================
              PUBLICACIÓN DE LA COMUNIDAD
          ================================================= */}

          <section className="home-section home-community">

            <div className="home-section__header">

              <h2>
                Publicaciones de la comunidad
              </h2>

              <button className="home-link-button">
                Ver comunidad
              </button>

            </div>


            <div className="home-post">

              <div className="home-post__content">

                {/* Autor */}
                <div className="home-post__author">

                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="Carlos Gómez"
                    className="home-post__avatar"
                  />

                  <div>

                    <strong>
                      Carlos Gómez
                    </strong>

                    <span>
                      Hace 3 horas
                    </span>

                  </div>

                </div>


                {/* Texto */}
                <p className="home-post__text">
                  Buscamos 2 jugadores para partido de esta noche
                  en Los Andes, 20:00 hs.
                </p>


                {/* Etiqueta */}
                <span className="home-post__tag">
                  Partido
                </span>


                {/* Acciones */}
                <div className="home-post__actions">

                  <button>
                    <MessageSquare size={17} />
                    5
                  </button>

                  <button>
                    <Heart size={17} />
                    12
                  </button>

                  <button>
                    <Eye size={17} />
                    28
                  </button>

                </div>

              </div>


              <img
                src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80"
                alt="Partido de fútbol"
                className="home-post__image"
              />

            </div>

          </section>

        </main>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">

        <div className="home-footer__logo">
          ⚽
        </div>

        <strong>
          UN <span>PICADITO</span>
        </strong>

        <p>
          © 2026 Futbol Conecta. Todos los derechos reservados.
        </p>

      </footer>

    </div>
  );
};

export default Home;