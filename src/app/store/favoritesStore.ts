import { create } from "zustand";

interface FavoritesState {
  favorites: string[];
  addFavorite: (city: string) => void;
  loadFavorites: () => void;
  removeFavorite: (city: string) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: [],
  addFavorite: (city) => {
    set((state) => {
      const updatedFavorites = [...state.favorites, city];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return { favorites: updatedFavorites };
    });
  },
  loadFavorites: () => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      set({ favorites: JSON.parse(storedFavorites) });
    }
  },
  removeFavorite: (city) => {
    set((state) => {
      const updatedFavorites = state.favorites.filter((fav) => fav !== city);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return { favorites: updatedFavorites };
    });
  },
  clearFavorites: () =>
    set(() => {
      localStorage.removeItem("favorites");
      return { favorites: [] };
    }),
}));
