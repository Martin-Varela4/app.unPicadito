import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INITIAL_AUTH_STATE } from '../constants/authConstants';
import { AUTH_STORAGE_KEY } from '../../../constants/appConstants';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      ...INITIAL_AUTH_STATE,
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

      logout: () => set(INITIAL_AUTH_STATE),

      checkAuth: () => Boolean(get().token && get().isAuthenticated),
    }),
    {
      name: AUTH_STORAGE_KEY,
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
