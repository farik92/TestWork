import { create } from "zustand";

export interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

interface WeatherState {
  weather: WeatherData | null;
  setWeather: (weather: WeatherData) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  setWeather: (weather) => set({ weather }),
}));
