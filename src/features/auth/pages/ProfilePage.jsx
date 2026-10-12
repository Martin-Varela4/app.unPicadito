import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../../../components/ui/Button';

export default function ProfilePage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background-main)] p-4">
            <div className="w-full max-w-lg rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-5 shadow-md sm:p-8">
                <div className="mb-6 flex items-center gap-4 border-b border-[var(--color-border-subtle)] pb-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-green)] text-2xl font-bold uppercase text-white shadow-inner">
                        {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-100">
                            {user?.name || 'Usuario'}
                        </h1>
                        <p className="text-sm text-slate-400">{user?.email || 'Sin correo asociado'}</p>
                    </div>
                </div>

                <div className="mb-6 space-y-2 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] p-4 text-sm text-slate-200">
                    <p>
                        <span className="font-semibold text-slate-100">Estado de sesión:</span>{' '}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/40 text-green-200">
                            Activo
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold text-slate-100">Identificador:</span>{' '}
                        {user?.id || user?._id || 'N/A'}
                    </p>
                </div>

                <Button variant="danger" fullWidth onClick={handleLogout}>
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
}