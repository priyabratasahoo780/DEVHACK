import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import { API_ENDPOINTS } from '../utils/constants.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

function generateMockWeatherData(lat, lon) {
  // Generate realistic-looking weather if no API key is present
  const baseTemp = 25 + Math.random() * 10;

  const current = {
    main: {
      temp: baseTemp,
      feels_like: baseTemp + 2,
      humidity: Math.floor(40 + Math.random() * 40),
      pressure: 1010 + Math.floor(Math.random() * 10)
    },
    weather: [{
      description: Math.random() > 0.5 ? 'clear sky' : 'scattered clouds',
      icon: Math.random() > 0.5 ? '01d' : '03d'
    }],
    wind: { speed: 2 + Math.random() * 5 },
    visibility: 10000,
    sys: { sunrise: 1712100000, sunset: 1712140000 }
  };

  const list = [];
  const startDt = new Date();

  for (let i = 0; i < 40; i++) {
    const dt = new Date(startDt.getTime() + (i * 3 * 60 * 60 * 1000));
    list.push({
      dt_txt: dt.toISOString().replace('T', ' ').substring(0, 19),
      main: {
        temp: baseTemp + (Math.sin(i / 8 * Math.PI) * 4),
        humidity: current.main.humidity
      },
      weather: [{
        description: current.weather[0].description,
        icon: current.weather[0].icon
      }],
      wind: current.wind
    });
  }

  return { current, forecast: { list } };
}

async function fetchWeatherData(lat, lon, locationName) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === 'your_openweather_api_key_here' || apiKey === 'none') {
    logger.warn('No OpenWeather API key found. Using simulated weather data.');
    return generateMockWeatherData(lat, lon);
  }

  let current = null;
  let forecast = null;

  let queryStr = `lat=${lat}&lon=${lon}`;
  if (locationName && lat === 23.0225 && lon === 72.5714 && locationName.toLowerCase() !== 'ahmedabad') {
    queryStr = `q=${encodeURIComponent(locationName)}`;
  }

  try {
    const url = `${API_ENDPOINTS.weather}/weather?${queryStr}&appid=${apiKey}&units=metric&lang=hi`;
    const res = await fetch(url);
    if (res.ok) {
      current = await res.json();
    } else {
      throw new Error(`OpenWeather returned ${res.status}`);
    }
  } catch (err) {
    logger.warn(`Weather current API error: ${err.message}`);
  }

  try {
    const url = `${API_ENDPOINTS.weatherForecast}?${queryStr}&appid=${apiKey}&units=metric&cnt=40&lang=hi`;
    const res = await fetch(url);
    if (res.ok) {
      forecast = await res.json();
    } else {
      throw new Error(`OpenWeather forecast returned ${res.status}`);
    }
  } catch (err) {
    logger.warn(`Weather forecast API error: ${err.message}`);
  }

  // Fallback to mock if API request fails
  if (!current || !forecast) {
    return generateMockWeatherData(lat, lon);
  }

  return { current, forecast };
}

function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function buildForecastDays(forecastData) {
  if (!forecastData?.list) return [];

  const dailyMap = {};
  forecastData.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        temps: [],
        descriptions: [],
        icons: [],
        humidity: [],
        wind: []
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].descriptions.push(item.weather[0].description);
    dailyMap[date].icons.push(item.weather[0].icon);
    dailyMap[date].humidity.push(item.main.humidity);
    dailyMap[date].wind.push(item.wind.speed);
  });

  return Object.values(dailyMap).slice(0, 5).map(day => {
    const midIndex = Math.floor(day.icons.length / 2);
    return {
      date: day.date,
      dayName: new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' }),
      tempMax: Math.round(Math.max(...day.temps)),
      tempMin: Math.round(Math.min(...day.temps)),
      description: day.descriptions[midIndex] || day.descriptions[0],
      icon: getWeatherIcon(day.icons[midIndex] || day.icons[0]),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      wind: Math.round(day.wind.reduce((a, b) => a + b, 0) / day.wind.length * 10) / 10
    };
  });
}

export async function getWeatherByCoords(lat, lon, locationName) {
  const { current, forecast } = await fetchWeatherData(lat, lon, locationName);
  const forecastDays = buildForecastDays(forecast);
  const loc = locationName || `${lat},${lon}`;

  const weatherSummary = current
    ? `Temperature: ${current.main.temp.toFixed(1)}°C, Feels Like: ${current.main.feels_like.toFixed(1)}°C, Humidity: ${current.main.humidity}%, Weather: ${current.weather[0].description}, Wind: ${current.wind.speed.toFixed(1)} m/s`
    : 'Weather data unavailable';

  const forecastSummary = forecastDays.length > 0
    ? forecastDays.map(d => `${d.dayName}: ${d.tempMin}-${d.tempMax}°C, ${d.description}`).join('\n')
    : 'Forecast not available';

  const prompt = `You are a weather-based farming advisor for Indian farmers. Give advice in English.

LOCATION: ${loc}
CURRENT WEATHER: ${weatherSummary}
5-DAY FORECAST:
${forecastSummary}

TASK:
1. Aaj ke mausam ka farming pe kya asar hoga
2. Agle 5 din mein kya dhyan rakhna hai
3. Irrigation schedule suggest karo

OUTPUT STYLE: Simple, practical English. Keep under 300 words.`;

  try {
    const response = await model.generateContent(prompt);

    return {
      location: loc,
      current: current ? {
        temp: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        description: current.weather[0].description,
        icon: getWeatherIcon(current.weather[0].icon),
        wind: Math.round(current.wind.speed * 3.6),
        pressure: current.main.pressure,
        visibility: current.visibility ? Math.round(current.visibility / 1000) : null
      } : null,
      forecast: forecastDays,
      advisory: response.response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      location: loc,
      current: current ? {
        temp: Math.round(current.main.temp),
        humidity: current.main.humidity,
        description: current.weather[0].description,
        icon: getWeatherIcon(current.weather[0].icon),
        wind: Math.round(current.wind.speed * 3.6)
      } : null,
      forecast: forecastDays,
      advisory: `## Farming Advisory for ${loc}\n\n- The current weather conditions are stable and suitable for standard farming activities.\n- Early morning irrigation between 6:00 AM and 8:00 AM is recommended to minimize water evaporation.\n- Monitor crop health visually as usual and stay updated with the latest alerts.`,
      timestamp: new Date().toISOString()
    };
  }
}

export async function getWeatherAdvisory(location) {
  // keeping retro compatibility for now
  return getWeatherByCoords(23.0225, 72.5714, location);
}
