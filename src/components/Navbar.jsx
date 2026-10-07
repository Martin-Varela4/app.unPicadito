import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getMyProfile } from "../features/profile/services/profile.service";
import { mapUserToProfile } from "../features/profile/services/profile.mapper";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import {
  Home,
  Search,
  Users,
  Bell,
  ChevronDown,
  UserPen,
  LogOut,
  UserRound,
  PlusCircle,
} from "lucide-react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    let isCurrent = true;

    if (!token) {
      setProfile(null);
      return () => {
        isCurrent = false;
      };
    }

    getMyProfile()
      .then((rawUser) => {
        if (isCurrent) setProfile(mapUserToProfile(rawUser));
      })
      .catch(() => {
        if (isCurrent) setProfile(null);
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const baseNavLinkClass = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out";

  const navItems = [
    { icon: Home, label: "Inicio", path: "/", end: true },
    { icon: Search, label: "Buscar Partidos", path: "/partidos", end: false },
    { icon: Users, label: "Jugadores", path: "/players", end: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-[70px] bg-white border-b border-gray-200 z-50 px-4 md:px-6">
      <div className="flex items-center justify-between h-full max-w-[1400px] mx-auto">
        {/* Logo que redirige a Inicio */}
        <Link to="/" className="flex items-center gap-2 select-none" aria-label="Ir al inicio">
          <div className="text-2xl">⚽</div>
          <div className="flex flex-col leading-none font-bold text-gray-900">
            <span className="text-xs text-gray-500 font-medium">Un</span>
            <span className="text-lg text-emerald-600 tracking-wide">Picadito</span>
          </div>
        </Link>

        {/* Links principales de navegación */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ icon: Icon, label, path, end }) => (
            <NavLink
              key={label}
              to={path}
              end={end}
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

        {/* Acciones de la derecha: Crear Sala + Notificaciones + Perfil */}
        <div className="flex items-center gap-3">
          <Link
            id="navbar-create-room"
            to="/salas/nueva"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Crear sala</span>
          </Link>

          <button className="p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-full transition-colors relative cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Menú Dropdown de Usuario */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer group"
              aria-label="Abrir menú de usuario"
            >
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={`Foto de perfil de ${profile.name}`}
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-gray-50 text-gray-500">
                  <UserRound size={18} />
                </span>
              )}
              <ChevronDown
                size={16}
                className={`text-gray-500 group-hover:text-gray-700 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                <div className="px-4 py-1.5 text-xs text-gray-400 font-medium uppercase tracking-wider">
                  {profile?.name || "Usuario"}
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  <UserPen size={16} className="text-gray-400" />
                  Mi Perfil
                </Link>

                <hr className="border-gray-100 my-1" />

                <button
                  onClick={handleLogout}
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