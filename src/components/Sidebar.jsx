import React from "react";
import { NavLink } from "react-router-dom"; // 🟢 Cambiado para navegación SPA y estados activos
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
  // Clase base para reutilizar y mantener el código limpio
  const baseItemClass = "flex items-center gap-3 px-3.5 py-3 rounded-md text-sm font-medium transition-all duration-200 ease-in-out";

  return (
    <aside className="w-[240px] shrink-0 min-h-[calc(100vh-70px)] p-6 px-4 bg-white border-r border-gray-200 box-border hidden md:block">
      {/* .sidebar-menu */}
      <nav className="flex flex-col gap-1.5">

        {/* 🟢 Tu Login/Home carga en la ruta /login */}
        <NavLink 
          to="/login" 
          className={({ isActive }) => `
            ${baseItemClass} 
            ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-emerald-800"}
          `}
        >
          <Home size={20} />
          <span>Inicio</span>
        </NavLink>

        {/* 🟢 Cambiado a /partidos según tus AppRoutes */}
        <NavLink 
          to="/partidos" 
          className={({ isActive }) => `
            ${baseItemClass} 
            ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-emerald-800"}
          `}
        >
          <Search size={20} />
          <span>Buscar partidos</span>
        </NavLink>

        <NavLink 
          to="/mis-partidos" 
          className={({ isActive }) => `
            ${baseItemClass} 
            ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-emerald-800"}
          `}
        >
          <CalendarDays size={20} />
          <span>Mis partidos</span>
        </NavLink>

        <NavLink 
          to="/conexiones" 
          className={({ isActive }) => `
            ${baseItemClass} 
            ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-emerald-800"}
          `}
        >
          <Users size={20} />
          <span>Conexiones</span>
        </NavLink>

        <NavLink 
          to="/mensajes" 
          className={({ isActive }) => `
            ${baseItemClass} 
            ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-emerald-800"}
          `}
        >
          <MessageCircle size={20} />
          <span>Mensajes</span>
        </NavLink>

        <NavLink 
          to="/notificaciones" 
          className={({ isActive }) => `
            ${baseItemClass} 
            ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-emerald-800"}
          `}
        >
          <Bell size={20} />
          <span>Notificaciones</span>
        </NavLink>

        {/* 🟢 Cambiado a /profile/view según tus AppRoutes */}
        <NavLink 
          to="/profile/view" 
          className={({ isActive }) => `
            ${baseItemClass} 
            ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-emerald-800"}
          `}
        >
          <User size={20} />
          <span>Mi perfil</span>
        </NavLink>

        <NavLink 
          to="/configuracion" 
          className={({ isActive }) => `
            ${baseItemClass} 
            ${isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-emerald-800"}
          `}
        >
          <Settings size={20} />
          <span>Configuración</span>
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;
