import React from "react";
import {
  Home,
  Search,
  Users,
  MessageCircle,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function NavBar() {
  const navItems = [
    { icon: Home, label: "Inicio" },
    { icon: Search, label: "Buscar Partidos" },
    { icon: Users, label: "Comunidad" },
    { icon: MessageCircle, label: "Mensajes" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <div className="navbar__logo">⚽</div>
          <div className="navbar__brand-text">
            <p>Un</p>
            <p className="navbar__brand-accent">Picadito</p>
          </div>
        </div>

        <div className="navbar__links">
          {navItems.map(({ icon: Icon, label }) => (
            <button key={label} className="navbar__link">
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        <div className="navbar__actions">
          <Bell size={20} className="navbar__bell" />
          <div className="navbar__user">
            <img
              src="https://randomuser.me/api/portraits/men/85.jpg"
              alt="Foto de perfil del usuario"
              className="navbar__avatar"
            />
            <ChevronDown size={16} className="navbar__chevron" />
          </div>
        </div>
      </div>
    </nav>
  );
}