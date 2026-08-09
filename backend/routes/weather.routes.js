import { Router } from 'express';
import { getWeather, getWeatherCoords } from '../controllers/weather.controller.js';

const router = Router();

router.get('/coords', getWeatherCoords);
router.get('/:location', getWeather);

export default router;
