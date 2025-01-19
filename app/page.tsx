"use client";

import React, { useState, useMemo } from "react";
import { useCityStore } from "@/app/store/cityStore";
import { useFavoritesStore } from "@/app/store/favoritesStore";
import { useWeatherStore } from "@/app/store/weatherStore";
import { CitySuggestion, City } from "@/shared/api/weatherApi";
import { getWeatherByCity, fetchSuggestions } from "@/shared/api/weatherApi";
import { debounce } from "@/app/hook/debounce";
import Header from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";
import Loader from "@/shared/ui/Loader";
import ErrorMessage from "@/shared/ui/ErrorMessage";
import styles from "@/app/styles/Home.module.scss";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityWeather, setCityWeather] = useState<City | null>(null);

  const setWeather = useWeatherStore((state) => state.setWeather);
  const setCity = useCityStore((state) => state.setCity);
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const isFavorite = cityWeather && favorites.includes(cityWeather.name);

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce(async (city: string) => {
        try {
          setLoading(true);
          const suggestions = await fetchSuggestions(city);
          setSuggestions(suggestions);
        } catch (err) {
          setError(`Не удалось загрузить предложения городов. ${err}`);
        } finally {
          setLoading(false);
        }
      }, 500),
    [setLoading, setSuggestions, setError],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedFetchSuggestions(e.target.value);
  };

  const handleSelectCity = async (city: string) => {
    setQuery(city);
    setSuggestions([]);
    try {
      setLoading(true);
      const weather = await getWeatherByCity(city);
      setCity(city);
      setCityWeather(weather);
      setWeather(weather);
    } catch (err) {
      setError(`Не удалось загрузить данные о погоде. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (cityWeather) {
      if (isFavorite) {
        removeFavorite(cityWeather.name);
      } else {
        addFavorite(cityWeather.name);
      }
    }
  };

  return (
    <>
      <Header />
      <div className={`container ${styles.home}`}>
        <h1 className="mt-4">Погода в вашем городе</h1>
        <div className="mt-3 mb-5">
          <input
            type="text"
            className="form-control"
            placeholder="Введите название города"
            value={query}
            onChange={handleInputChange}
          />
          {loading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {suggestions && suggestions.length > 0 && (
            <ul className={`list-group mt-2 ${styles.listGroup}`}>
              {suggestions.map((city) => (
                <li
                  key={`${city.id}`}
                  className={`list-group-item list-group-item-action ${styles.listGroupItem}`}
                  onClick={() => handleSelectCity(city.name)}
                >
                  {city.country}, {city.name} {city.temp}°C
                </li>
              ))}
            </ul>
          )}
        </div>
        {cityWeather && (
          <div className={`card`}>
            <div className="card-body">
              <h5 className="card-title">{cityWeather.name}</h5>
              <p className="card-text">
                Температура: {cityWeather.main.temp}°C
              </p>
              <p className="card-text">
                Погода: {cityWeather.weather[0].description}
              </p>
              <div className="btn-group mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() => router.push("/forecast")}
                >
                  Посмотреть прогноз на несколько дней
                </button>
                <button
                  className={`btn ${isFavorite ? "btn-danger" : "btn-secondary"}`}
                  onClick={handleFavoriteToggle}
                >
                  {isFavorite
                    ? "Удалить из избранного"
                    : "Добавить в избранное"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
