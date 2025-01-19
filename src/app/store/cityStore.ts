import { create } from "zustand";

interface CityState {
  city: string | null;
  setCity: (city: string) => void;
}

export const useCityStore = create<CityState>((set) => ({
  city: null,
  setCity: (city) => set({ city: city }),
}));
