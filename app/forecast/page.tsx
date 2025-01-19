"use client";

import React, { useState, useEffect } from "react";
import { useCityStore } from "@/app/store/cityStore";
import { getWeatherForecast } from "@/shared/api/weatherApi";
import { WeatherForecast, ForecastItem } from "@/shared/api/weatherApi";
import Header from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";
import Loader from "@/shared/ui/Loader";
import ErrorMessage from "@/shared/ui/ErrorMessage";
import styles from "@/app/styles/Forecast.module.scss";

export default function ForecastPage() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCity = useCityStore((state) => state.city);

  useEffect(() => {
    if (!selectedCity) return;

    const fetchForecast = async () => {
      setLoading(true);
      try {
        const data = await getWeatherForecast(selectedCity);
        setForecast(data);
      } catch (err) {
        setError(`Не удалось загрузить прогноз погоды. ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [selectedCity]);

  const groupedForecast:
    | { [date: string]: WeatherForecast["list"] }
    | undefined = forecast?.list?.reduce(
    (acc: { [date: string]: WeatherForecast["list"] }, current) => {
      const date = current.dt_txt.split(" ")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(current);
      return acc;
    },
    {} as { [date: string]: WeatherForecast["list"] },
  );

  return (
    <>
      <Header />
      <div className={`container ${styles.forecast}`}>
        <h1 className="mt-4 mb-4">
          Прогноз погоды для {selectedCity ? selectedCity : ""}
        </h1>
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {forecast && (
          <div className="mb-4">
            <div className={`forecast-items d-flex ${styles.forecastList}`}>
              {groupedForecast &&
                Object.keys(groupedForecast).map((date: string) => (
                  <div
                    key={date}
                    className={`forecast-item card ${styles.forecastItem}`}
                  >
                    {groupedForecast[date].map((day: ForecastItem) => (
                      <div key={day.dt}>
                        <p>
                          <b>Дата и Время: {day.dt_txt}</b>
                        </p>
                        <p>Температура: {day.main.temp}°C</p>
                        <p>Погода: {day.weather[0].description}</p>
                        <hr />
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
