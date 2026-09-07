import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      // --- Acciones ---

      /**
       * Inicia sesión guardando usuario y tokens
       */
      login: ({ user, token, refreshToken = null }) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        }),

      /**
       * Actualiza datos puntuales del usuario (ej. editar perfil, cambiar avatar)
       * sin invalidar el token ni la sesión
       */
      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : updatedData,
        })),

      /**
       * Cierra sesión y limpia completamente el estado y el storage
       */
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      /**
       * Helper para verificar si hay sesión activa (lectura imperativa)
       */
      checkAuth: () => Boolean(get().token && get().isAuthenticated),
    }),
    {
      name: 'unpicadito_auth_session', // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage),
      // Opcional: Solo persistir campos necesarios si se requiere
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);