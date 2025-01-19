import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

export interface City {
  id: string;
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
  };
  weather: [
    {
      description: string;
    },
  ];
}

export type CitySuggestion = {
  id: string;
  name: string;
  country: string;
  temp: number;
};

export interface WeatherForecast {
  cod: string;
  message: number;
  cnt: number;
  list: Array<ForecastItem>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export const getWeatherByCity = async (city: string) => {
  const response = await axios.get(`${BASE_URL}weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
      lang: "ru",
    },
  });
  return response.data;
};

export const getWeatherForecast = async (
  city: string,
): Promise<WeatherForecast> => {
  const response = await axios.get(`${BASE_URL}forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
      lang: "ru",
    },
  });
  return response.data;
};

export const fetchSuggestions = async (
  city: string,
): Promise<CitySuggestion[]> => {
  if (city.length < 3) return [];
  const response = await axios.get(`${BASE_URL}find`, {
    params: {
      q: city,
      type: "like",
      sort: "population",
      appid: API_KEY,
      units: "metric",
      lang: "ru",
    },
  });
  return response.data.list.map((item: City) => ({
    id: item.id,
    name: item.name,
    country: item.sys.country,
    temp: item.main.temp,
  }));
};
