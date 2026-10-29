import { useLocation, useNavigate } from 'react-router';
import AuthForm from '../components/AuthForm';
import { AUTH_MODES } from '../constants/authConstants';
import canchaFondo from '../../../assets/cancha-fondo.jpg';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.pathname === '/registro' ? AUTH_MODES.REGISTER : AUTH_MODES.LOGIN;

  const toggleMode = () => {
    const nextPath = mode === AUTH_MODES.LOGIN ? '/registro' : '/login';
    navigate(nextPath, { replace: true });
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.76), rgba(15, 23, 42, 0.82)), url("${canchaFondo}")`,
      }}
    >
      <div className="w-full max-w-md rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)]/95 p-5 shadow-2xl backdrop-blur-sm sm:p-8">
        <div className="text-center mb-6">
          <span className="text-3xl">⚽</span>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-2">
            unPicadito
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {mode === AUTH_MODES.LOGIN
              ? 'Ingresa a tu cuenta para armar el partido'
              : 'Únete para empezar a jugar'}
          </p>
        </div>

        <AuthForm key={mode} mode={mode} onToggleMode={toggleMode} />
      </div>
    </div>
  );
}
