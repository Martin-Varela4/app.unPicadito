import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom"; // Usamos NavLink e hilos de navegación SPA
import { player } from '../features/profile/UserProfile';
import {
  Home,
  Search,
  Users,
  MessageCircle,
  Bell,
  ChevronDown,
  UserPen,
  LogOut
} from "lucide-react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  // Clases base reutilizables para mantener la consistencia visual con el Sidebar
  const baseNavLinkClass = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out";

  const navItems = [
    { icon: Home, label: "Inicio", path: "/login" },
    { icon: Search, label: "Buscar Partidos", path: "/partidos" },
    { icon: Users, label: "Comunidad", path: "/conexiones" },
    { icon: MessageCircle, label: "Mensajes", path: "/mensajes" },
  ];

  return (
    // Reemplaza .navbar (h-16 equivale a 64px, se alinea con el top-[70px] aproximado del layout)
    <nav className="fixed top-0 left-0 right-0 h-[70px] bg-white border-b border-gray-200 z-50 px-4 md:px-6">
      
      {/* Reemplaza .navbar__inner */}
      <div className="flex items-center justify-between h-full max-w-[1400px] mx-auto">
        
        {/* Reemplaza .navbar__brand */}
        <div className="flex items-center gap-2 select-none">
          <div className="text-2xl">⚽</div>
          <div className="flex flex-col leading-none font-bold text-gray-900">
            <span className="text-xs text-gray-500 font-medium">Un</span>
            <span className="text-lg text-emerald-600 tracking-wide">Picadito</span>
          </div>
        </div>

        {/* Reemplaza .navbar__links (Se ocultan en móvil para que el Sidebar tome el control en pantallas grandes) */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink 
              key={label} 
              to={path}
              className={({ isActive }) => `
                ${baseNavLinkClass} 
                ${isActive 
                  ? "bg-emerald-50 text-emerald-700 font-semibold" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-emerald-800"
                }
              `}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Reemplaza .navbar__actions */}
        <div className="flex items-center gap-4">
          
          {/* Icono de notificaciones con efecto hover */}
          <button className="p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-full transition-colors relative cursor-pointer">
            <Bell size={20} />
            {/* Indicador rojo de notificación (opcional) */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Contenedor relativo del usuario y su menú */}
          <div className="relative">
            
            {/* Botón de Perfil interactivo */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer group"
            >
              <img
                src={player.avatar}
                alt={`Foto de perfil de ${player.nombre}`}
                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
              />
              <ChevronDown 
                size={16} 
                className={`text-gray-500 group-hover:text-gray-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Menú Desplegable (Estilo idéntico a las tarjetas dinámicas de Tailwind) */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                
                {/* Cabecera pequeña de contexto dentro del menú */}
                <div className="px-4 py-1.5 text-xs text-gray-400 font-medium uppercase tracking-wider">
                  {player.name}
                </div>

                <Link
                  to="/profile/edit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  <UserPen size={16} className="text-gray-400" />
                  Editar Perfil
                </Link>

                <hr className="border-gray-100 my-1" />

                <button
                  onClick={() => {
                    setIsOpen(false);
                    console.log("Cerrar sesión");
                  }}
                  className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>

              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
