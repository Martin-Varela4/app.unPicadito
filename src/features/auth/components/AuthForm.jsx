import { useState, useEffect } from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useAuth } from '../hooks/useAuth';

export default function AuthForm({ mode = 'login', onToggleMode }) {
  const isLogin = mode === 'login';

  const initialFormState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const { authenticate, isLoading, validationErrors, apiError, clearErrors } = useAuth();

  // Limpiar campos y errores cuando cambia de Login a Registro o viceversa
  useEffect(() => {
    setFormData(initialFormState);
    clearErrors();
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authenticate(mode, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Alerta de Error de Backend */}
      {apiError && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{apiError}</span>
        </div>
      )}

      {/* Campo: Nombre de usuario (Solo Registro) */}
      {!isLogin && (
        <Input
          label="Nombre de Usuario"
          name="username"
          placeholder="Ej: picadito_crack"
          value={formData.username}
          onChange={handleChange}
          error={validationErrors.username}
          required
        />
      )}

      {/* Campo: Email (Ambos modos) */}
      <Input
        label="Correo Electrónico"
        name="email"
        type="email"
        placeholder="ejemplo@correo.com"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        required
      />

      {/* Campo: Contraseña (Ambos modos) */}
      <Input
        label="Contraseña"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        required
      />

      {/* Campo: Confirmar Contraseña (Solo Registro) */}
      {!isLogin && (
        <Input
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={validationErrors.confirmPassword}
          required
        />
      )}

      {/* Botón con estado de carga */}
      <Button type="submit" isLoading={isLoading} fullWidth className="mt-2">
        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </Button>

      {/* Selector de modo */}
      <div className="text-center text-sm text-slate-600 mt-2">
        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
        <button
          type="button"
          onClick={onToggleMode}
          className="font-semibold text-blue-600 hover:text-blue-700 underline focus:outline-none"
        >
          {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
        </button>
      </div>
    </form>
  );
}