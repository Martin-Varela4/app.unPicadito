import { create } from "zustand";
import { getAvailablePlayers } from "../services/playerService";

export const usePlayerStore = create((set, get) => ({
  players: [],
  pagination: {
    total: 0,
    pagina: 1,
    limite: 12,
    totalPaginas: 1,
  },
  loading: false,
  error: null,
  lastSearch: null,

  fetchPlayers: async (search = "", page = 1) => {
    const isNewSearch = get().lastSearch !== search;
    const targetPage = isNewSearch ? 1 : page;

    if (!isNewSearch && get().pagination.pagina === targetPage && get().players.length > 0) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await getAvailablePlayers(search, targetPage, 12);
      const playerList = Array.isArray(data) ? data : data.data || [];
      const pag = !Array.isArray(data) && data.paginacion ? data.paginacion : {
        total: playerList.length,
        pagina: targetPage,
        limite: 12,
        totalPaginas: 1,
      };

      set({
        players: playerList,
        pagination: pag,
        lastSearch: search,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message || "No se pudieron cargar los jugadores.", loading: false });
    }
  },

  setPage: (page) => {
    get().fetchPlayers(get().lastSearch || "", page);
  },
}));
