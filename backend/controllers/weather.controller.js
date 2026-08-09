import { getWeatherAdvisory, getWeatherByCoords } from '../services/weather.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export async function getWeather(req, res, next) {
  try {
    const { location } = req.params;
    const result = await getWeatherAdvisory(location);
    return successResponse(res, result, 'Weather advisory generated');
  } catch (error) {
    next(error);
  }
}

export async function getWeatherCoords(req, res, next) {
  try {
    const { lat, lon, location } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'lat and lon are required' });
    }
    const result = await getWeatherByCoords(parseFloat(lat), parseFloat(lon), location || '');
    return successResponse(res, result, 'Weather by coordinates generated');
  } catch (error) {
    next(error);
  }
}
