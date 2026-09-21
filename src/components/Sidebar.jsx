import React from "react";
import {
  Home,
  Search,
  CalendarDays,
  Users,
  MessageCircle,
  Bell,
  User,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="home-sidebar">
      <div className="sidebar-menu">

        <a href="/home" className="sidebar-item active">
          <Home size={20} />
          <span>Inicio</span>
        </a>

        <a href="/buscar" className="sidebar-item">
          <Search size={20} />
          <span>Buscar partidos</span>
        </a>

        <a href="/mis-partidos" className="sidebar-item">
          <CalendarDays size={20} />
          <span>Mis partidos</span>
        </a>

        <a href="/conexiones" className="sidebar-item">
          <Users size={20} />
          <span>Conexiones</span>
        </a>

        <a href="/mensajes" className="sidebar-item">
          <MessageCircle size={20} />
          <span>Mensajes</span>
        </a>

        <a href="/notificaciones" className="sidebar-item">
          <Bell size={20} />
          <span>Notificaciones</span>
        </a>

        <a href="/perfil" className="sidebar-item">
          <User size={20} />
          <span>Mi perfil</span>
        </a>

        <a href="/configuracion" className="sidebar-item">
          <Settings size={20} />
          <span>Configuración</span>
        </a>

      </div>
    </aside>
  );
};

export default Sidebar;