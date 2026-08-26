import { useState } from 'react';
import AuthForm from '../components/AuthForm';

export default function AuthPage() {
  const [mode, setMode] = useState('login');

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200/60">
        <div className="text-center mb-6">
          <span className="text-3xl">⚽</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
            unPicadito
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'login'
              ? 'Ingresa a tu cuenta para armar el partido'
              : 'Únete para empezar a jugar'}
          </p>
        </div>

        <AuthForm mode={mode} onToggleMode={toggleMode} />
      </div>
    </div>
  );
}