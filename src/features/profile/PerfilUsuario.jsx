import React from "react";
import {
  Home,
  Search,
  Users,
  MessageCircle,
  Bell,
  ChevronDown,
  Pencil,
  Star,
  StarHalf,
  Circle,
  Trophy,
  Target,
  Calendar,
  MapPin,
} from "lucide-react";


import Navbar from "../../components/Navbar";

// Datos de ejemplo, luego los agregamos desde el array de usuarios 
// con la funcion .map
const player = {
  name: "Antonio De la Casita",
  username: "@MediaEstrella",
  rating: 4.8,
  connectionsCount: 156,
  avatar:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
  coverImage:
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&h=500&fit=crop",
  stats: [
    { icon: Circle, label: "Partidos jugados", value: 300 },
    { icon: Trophy, label: "Victorias", value: 150 },
    { icon: Target, label: "Goles marcados", value: 180 },
    { icon: null, label: "Posición favorita", value: "Centro Delantero" },
  ],
  about:
    "Me gusta el fuchibol.",
  age: 50,
  location: "Paraguay, Italia",
  playingSince: "Juego desde los 7 años",
  connections: [
    { name: "Carlos Gómez", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Ana Fernández", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Martín López", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
    { name: "Diego Ruiz", avatar: "https://randomuser.me/api/portraits/men/56.jpg" },
    { name: "Luis Ramírez", avatar: "https://randomuser.me/api/portraits/men/61.jpg" },
    { name: "Pablo Díaz", avatar: "https://randomuser.me/api/portraits/men/71.jpg" },
  ],
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const totalStars = 5;

  return (
    <div className="star-rating">
      {Array.from({ length: totalStars }).map((_, i) => {
        if (i < full) {
          return <Star key={i} size={22} className="star star--full" />;
        }
        if (i === full && hasHalf) {
          return <StarHalf key={i} size={22} className="star star--full" />;
        }
        return <Star key={i} size={22} className="star star--empty" />;
      })}
      <span className="star-rating__value">{rating.toFixed(1)} / 5</span>
    </div>
  );
}


//header: su propio componente

function ProfileHeader({ player, onEditClick }) {
  return (
    <div className="profile-header">
      <div className="profile-header__cover">
        <img src={player.coverImage} alt="Cancha de fútbol" />
      </div>

      <div className="profile-header__card-wrapper">
        <div className="profile-header__card">
          <div className="profile-header__avatar-wrapper">
            <img
              src={player.avatar}
              alt={`Foto de perfil de ${player.name}`}
              className="profile-header__avatar"
            />
            <span className="profile-header__status-dot" />
          </div>

          <h1 className="profile-header__name">{player.name}</h1>
          <p className="profile-header__username">{player.username}</p>

          <div className="profile-header__rating">
            <StarRating rating={player.rating} />
          </div>

          <div className="profile-header__connections">
            <Users size={20} />
            <span className="profile-header__connections-count">
              {player.connectionsCount}
            </span>
            <span>Conexiones</span>
          </div>

          <button className="btn-primary" onClick={onEditClick}>
            <Pencil size={18} />
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}


//statbar: su propio componente

function StatsBar({ stats }) {
  return (
    <div className="section-wrapper">
      <div className="stats-bar">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="stats-bar__item">
            {Icon ? (
              <Icon size={28} className="stats-bar__icon" />
            ) : (
              <span className="stats-bar__emoji">👟</span>
            )}
            <p className="stats-bar__value">{value}</p>
            <p className="stats-bar__label">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

//conectionsection: su propio componente
function ConnectionsSection({ connections, count }) {
  return (
    <div className="section-wrapper">
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Mis conexiones ({count})</h2>
          <button className="link-button">Ver todas</button>
        </div>

        <div className="connections-grid">
          {connections.map((c) => (
            <div key={c.name} className="connections-grid__item">
              <div className="connections-grid__avatar-wrapper">
                <img src={c.avatar} alt={c.name} />
                <span className="connections-grid__status-dot" />
              </div>
              <p className="connections-grid__name">{c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

//aboutsection: su propio componente
function AboutSection({ player }) {
  return (
    <div className="section-wrapper">
      <div className="card">
        <h2 className="card__title">Sobre mí</h2>
        <p className="about-text">{player.about}</p>

        <div className="about-meta">
          <div className="about-meta__item">
            <Calendar size={18} />
            {player.age} años
          </div>
          <div className="about-meta__item">
            <MapPin size={18} />
            {player.location}
          </div>
          <div className="about-meta__item">
            <span>👟</span>
            {player.playingSince}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function PerfilUsuario({ onEditClick }) {
  return (
    <div className="perfil-usuario-page">
      <Navbar />
      <ProfileHeader player={player} onEditClick={onEditClick}/>
      <StatsBar stats={player.stats} />
      <ConnectionsSection
        connections={player.connections}
        count={player.connectionsCount}
      />
      <AboutSection player={player} />
    </div>
  );
}
