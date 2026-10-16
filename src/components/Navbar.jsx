import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getMyProfile } from "../features/profile/services/profile.service";
import { mapUserToProfile } from "../features/profile/services/profile.mapper";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import {
  Home,
  Search,
  Users,
  MessageSquare,
  Bell,
  ChevronDown,
  UserPen,
  LogOut,
  PlusCircle,
} from "lucide-react";
import Avatar from "./ui/Avatar";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    let isCurrent = true;

    if (!token) {
      return undefined;
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
  const visibleProfile = token ? profile : null;

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const baseNavLinkClass = "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]";

  const navItems = [
    { icon: Home, label: "Inicio", path: "/", end: true },
    { icon: Search, label: "Buscar Partidos", path: "/partidos", end: false },
    { icon: Users, label: "Jugadores", path: "/players", end: false },
    { icon: MessageSquare, label: "Mensajes", path: "/messages", end: false }
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[var(--color-border-subtle)] bg-[var(--color-background-main)] px-3 sm:px-4 md:h-[70px] md:px-6">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-2">
        {/* Logo que redirige a Inicio */}
        <Link to="/" className="flex items-center gap-2 select-none" aria-label="Ir al inicio">
          <div className="text-2xl">⚽</div>
          <div className="flex flex-col leading-none font-bold text-white">
            <span className="text-xs text-[var(--color-brand-light)] font-medium">Un</span>
            <span className="text-lg text-[var(--color-brand-primary)] tracking-wide">Picadito</span>
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
                  ? "text-[var(--color-brand-primary)] font-semibold"
                  : "text-slate-400 hover:text-white"
                }
              `}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Acciones de la derecha: Crear Sala + Notificaciones + Perfil */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Link
            id="navbar-create-room"
            to="/salas/nueva"
            className="flex min-h-11 items-center gap-1.5 rounded-md bg-[var(--color-brand-primary)] px-2.5 py-2 text-sm font-semibold text-[#21263A] shadow-sm transition-colors hover:bg-[var(--color-brand-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-3"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Crear sala</span>
          </Link>

          <button type="button" aria-label="Notificaciones" className="relative flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Menú Dropdown de Usuario */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              className="group flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg p-1.5 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] sm:gap-2"
              aria-label="Abrir menú de usuario"
            >
              <Avatar
                src={visibleProfile?.avatar}
                alt={`Foto de perfil de ${visibleProfile?.name || "usuario"}`}
                className="h-8 w-8 rounded-full border border-[var(--color-border-subtle)] object-cover"
              />
              <ChevronDown
                size={16}
                className={`text-slate-400 group-hover:text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-1.5rem)] rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] py-1.5 shadow-xl">
                <div className="px-4 py-1.5 text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {visibleProfile?.name || "Usuario"}
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white hover:bg-slate-800 transition-colors font-medium"
                >
                  <UserPen size={16} className="text-slate-400" />
                  Mi Perfil
                </Link>

                <hr className="border-[var(--color-border-subtle)] my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-slate-800 transition-colors font-medium cursor-pointer"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-background-main)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3">
          {navItems.map(({ icon: Icon, label, path, end }) => (
            <NavLink
              key={`mobile-${label}`}
              to={path}
              end={end}
              className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-primary)] ${
                isActive ? 'text-[var(--color-brand-primary)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}