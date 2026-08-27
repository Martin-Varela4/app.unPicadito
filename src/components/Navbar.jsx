import React from "react";
import { useNavigate } from "react-router-dom"; // 👈 1. Importamos el navegador
import {
  Home,
  Search,
  Users,
  MessageCircle,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate(); // 👈 2. Inicializamos el hook

  // 👈 3. Agregamos la propiedad 'path' a cada elemento del menú
  const navItems = [
    { icon: Home, label: "Inicio", path: "/" }, 
    { icon: Search, label: "Buscar Partidos", path: "/buscar" },
    { icon: Users, label: "Comunidad", path: "/comunidad" },
    { icon: MessageCircle, label: "Mensajes", path: "/mensajes" },
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
          {navItems.map(({ icon: Icon, label, path }) => ( // 👈 Recibimos el 'path'
            <button 
              key={label} 
              className="navbar__link"
              onClick={() => navigate(path)} // 👈 4. Disparamos la redirección al hacer clic
            >
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
