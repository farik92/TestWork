"use client";

import React, { useState, useEffect } from "react";
import { useFavoritesStore } from "@/app/store/favoritesStore";
import { WeatherData } from "@/app/store/weatherStore";
import { getWeatherByCity } from "@/shared/api/weatherApi";
import Loader from "@/shared/ui/Loader";
import ErrorMessage from "@/shared/ui/ErrorMessage";
import Header from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";
import styles from "@/app/styles/Favorites.module.scss";

export default function FavoritesPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  useEffect(() => {
    if (favorites.length === 0) {
      setWeatherData([]);
      return;
    }

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await Promise.all(
          favorites.map((city) => getWeatherByCity(city)),
        );
        setWeatherData(data);
      } catch (err) {
        setError(
          `Не удалось загрузить данные о погоде для избранных городов. ${err}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [favorites]);

  return (
    <>
      <Header />
      <div className={`container ${styles.favorites}`}>
        <h1 className="mt-4">Избранные города</h1>
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && favorites.length === 0 && (
          <p>Нет избранных городов.</p>
        )}
        {!loading && !error && favorites.length > 0 && (
          <div className="mt-4">
            <div className="row">
              {weatherData &&
                weatherData.map((weather) => (
                  <div key={weather.name} className="col-md-4 mb-4">
                    <div className={`card ${styles.weatherCard}`}>
                      <div className="card-body">
                        <h5 className="card-title">{weather.name}</h5>
                        <p className="card-text">
                          Температура: {weather.main.temp}°C
                        </p>
                        <p className="card-text">
                          Погода: {weather.weather[0].description}
                        </p>
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFavorite(weather.name)}
                        >
                          Удалить из избранного
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <button className="btn btn-danger mb-3" onClick={clearFavorites}>
              Удалить все
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
