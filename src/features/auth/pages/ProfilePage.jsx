import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../../../components/Button';

export default function ProfilePage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-md border border-slate-200 p-8">
                <div className="flex items-center space-x-4 border-b border-slate-100 pb-6 mb-6">
                    <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-inner">
                        {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            {user?.name || 'Usuario'}
                        </h1>
                        <p className="text-sm text-slate-500">{user?.email || 'Sin correo asociado'}</p>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 space-y-2 text-sm text-slate-700">
                    <p>
                        <span className="font-semibold text-slate-900">Estado de sesión:</span>{' '}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activo
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold text-slate-900">Identificador:</span>{' '}
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