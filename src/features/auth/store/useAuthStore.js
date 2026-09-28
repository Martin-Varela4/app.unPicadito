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
      _hasHydrated: false, 

      // Setter para la hidratación
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // --- Acciones ---
      login: ({ user, token, refreshToken = null }) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: Boolean(token), 
        }),

      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : updatedData,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      checkAuth: () => Boolean(get().token && get().isAuthenticated),
    }),
    {
      name: 'unpicadito_auth_session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);