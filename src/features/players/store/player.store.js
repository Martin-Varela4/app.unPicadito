import { create } from "zustand";
import { getAvailablePlayers } from "../services/player.service"


export const usePlayerStore = create((set, get) => ({
    players: [],
    loading: false,
    error: null,
    lastSearch: "",

    fetchPlayers: async (search = "") => {
    if (get().lastSearch === search && get().players.length > 0) return;

    set({ loading: true, error: null });
    try {
      const data = await getAvailablePlayers(search);
      set({ players: data, lastSearch: search, loading: false });
    } catch (err) {
      set({ error: "No se pudieron cargar los jugadores.", loading: false });
    }
  },
}));
