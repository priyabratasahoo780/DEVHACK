import { useState, useEffect } from 'react';
import { getWeatherAdvisory } from '../services/weatherApi';

export function useWeather(location) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (loc) => {
    const target = loc || location;
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getWeatherAdvisory(target);
      // interceptor strips response.data → result = { success, data, message }
      setWeather(result.data || result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchWeather(location);
  }, [location]);

  return { weather, loading, error, fetchWeather };
}
