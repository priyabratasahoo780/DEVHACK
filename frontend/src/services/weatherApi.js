import api from './api';

export const getWeatherAdvisory = (location) => api.get(`/weather/${encodeURIComponent(location)}`);
export const getWeatherAdv = ({ lat, lon }) => api.get(`/weather/${lat},${lon}`);
export const getWeatherByCoords = (lat, lon, location) => 
  api.get(`/weather/coords?lat=${lat}&lon=${lon}&location=${encodeURIComponent(location || '')}`);
