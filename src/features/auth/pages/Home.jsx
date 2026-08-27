import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import Navbar from "../../../components/Navbar"; // 👈 Tu componente reutilizable importado
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
  Plus,
  Goal,
  Footprints,
  Clock,
  UserPlus,
  Activity,
  Heart,
  MessageSquare,
  Eye,
  Settings,
} from "lucide-react";

const Home = () => {
    const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre: "Cargando...",
    username: "@...",
    avatar: "https://placeholder.com",
    conexiones: 0,
    partidos: 0,
    victorias: 0,
    goles: 0,
    posicion: "---",
  });
  const [partidos, setPartidos] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [conexionesSugeridas, setConexionesSugeridas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosHome = async () => {
      try {
        setLoading(true);
        const [resUsuario, resPartidos, resActividades, resSugerencias] = await Promise.all([
          api.get('/auth/profile'),
          api.get('/partidos'),
          api.get('/actividades'),
          api.get('/conexiones/sugeridas')
        ]);
        setUsuario(resUsuario.data);
        setPartidos(resPartidos.data);
        setActividades(resActividades.data);
        setConexionesSugeridas(resSugerencias.data);
      } catch (error) {
        console.error("Error al cargar la información del Home:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatosHome();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-100">
        <p className="text-lg font-semibold text-slate-600 animate-pulse">Cargando tu panel...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Navbar /> 

      <div className="home-layout">
        {/* SIDEBAR */}
        <aside className="home-sidebar">
          <div className="home-sidebar__profile">
            <div className="home-sidebar__avatar-wrapper">
              <img src={usuario.avatar} alt={usuario.nombre} className="home-sidebar__avatar" />
              <span className="home-sidebar__status"></span>
            </div>
            <div className="home-sidebar__profile-info">
              <h3>{usuario.nombre}</h3>
              <button className="home-sidebar__profile-link"
              onClick={()=> navigate("/profile")}
              >
                Ver perfil
                </button>
            </div>
          </div>

          <nav className="home-sidebar__menu">
            <button className="home-sidebar__item home-sidebar__item--active">
              <HomeIcon size={20} /> <span>Inicio</span>
            </button>
            <button className="home-sidebar__item"><CalendarDays size={20} /> <span>Mis Partidos</span></button>
            <button className="home-sidebar__item"><Users size={20} /> <span>Mis Conexiones</span></button>
            <button className="home-sidebar__item"><MessageCircle size={20} /> <span>Mensajes</span></button>
            <button className="home-sidebar__item"><Settings size={20} /> <span>Configuración</span></button>
          </nav>

          <button className="home-sidebar__create-button" onClick={() => console.log("Crear partido")}>
            <Plus size={20} /> Crear Partido
          </button>
        </aside>

        {/* /home */}
        <main className="home-content">
          <section className="home-welcome">
            <h1>Bienvenido {usuario.nombre.split(" ")[0]}</h1>
            <p>Elije tu partido, extranjero...</p>
          </section>

          {/* ESTADÍSTICAS */}
          <section className="home-stats">
            <div className="home-stat-card">
              <div className="home-stat-card__icon"><Goal size={28} /></div>
              <strong>{usuario.partidos}</strong> <span>Partidos jugados</span>
            </div>
            <div className="home-stat-card">
              <div className="home-stat-card__icon"><Trophy size={28} /></div>
              <strong>{usuario.victorias}</strong> <span>Victorias</span>
            </div>
            <div className="home-stat-card">
              <div className="home-stat-card__icon"><Users size={28} /></div>
              <strong>{usuario.conexiones}</strong> <span>Conexiones</span>
            </div>
            <div className="home-stat-card">
              <div className="home-stat-card__icon"><Footprints size={28} /></div>
              <strong className="home-stat-card__position">{usuario.posicion}</strong> <span>Posición</span>
            </div>
          </section>

          {/* sección de partidos partidos*/}
          <section className="home-section">
            <div className="home-section__header">
              <h2>Partidos actuales</h2>
              <button className="home-link-button">Ver todos</button>
            </div>

            <div className="current-matches">
              {partidos.length === 0 ? (
                <p className="text-sm text-slate-500">No hay partidos disponibles.</p>
              ) : (
                partidos.map((partido) => (
                  <div className="current-match" key={partido.id}>
                    <div className="current-match__image-wrapper">
                      <img src={partido.imagen} alt={partido.titulo} className="current-match__image" />
                      <span className="current-match__badge">{partido.fecha}</span>
                    </div>
                    <div className="current-match__info">
                      <h3>{partido.titulo}</h3>
                      <div className="current-match__type">
                        <span>{partido.modalidad}</span><span>•</span><span>{partido.superficie}</span>
                      </div>
                      <div className="current-match__location">
                        <MapPin size={17} />
                        <div><strong>{partido.lugar}</strong><span>{partido.ciudad}</span></div>
                      </div>
                    </div>
                    <div className="current-match__time">
                      <Clock size={18} /> <strong>{partido.hora}</strong><span>{partido.fecha}</span>
                    </div>
                    <div className="current-match__players">
                      <strong>{partido.jugadoresActuales} / {partido.jugadoresMaximos}</strong>
                      <div className="current-match__progress">
                        <div className="current-match__progress-bar" style={{ width: `${(partido.jugadoresActuales / partido.jugadoresMaximos) * 100}%` }}></div>
                      </div>
                    </div>
                    <button className="home-primary-button current-match__button" onClick={() => console.log("Ver:", partido)}>
                      Ver y unirme
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* actividades y sugerencias */}
          <div className="home-two-columns">
            <section className="home-section">
              <div className="home-section__header"><h2>Actividad reciente</h2><Activity size={20} /></div>
              <div className="home-activity-list">
                {actividades.map((actividad) => (
                  <div className="home-activity" key={actividad.id}>
                    <img src={actividad.avatar} alt={actividad.nombre} className="home-activity__avatar" />
                    <div className="home-activity__content">
                      <p><strong>{actividad.nombre}</strong> {actividad.texto}</p>
                      <span>{actividad.detalle}</span><small>{actividad.tiempo}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="home-section">
              <div className="home-section__header"><h2>Conexiones sugeridas</h2></div>
              <div className="home-suggestions">
                {conexionesSugeridas.map((conexion) => (
                  <div className="home-suggestion" key={conexion.id}>
                    <img src={conexion.avatar} alt={conexion.nombre} className="home-suggestion__avatar" />
                    <div className="home-suggestion__info">
                      <strong>{conexion.nombre}</strong><span>{conexion.conexiones} en común</span>
                    </div>
                    <button className="home-suggestion__button" onClick={() => console.log("Conectar:", conexion)}>
                      <UserPlus size={15} /> Conectar
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
