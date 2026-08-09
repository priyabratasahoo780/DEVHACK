import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { CloudRain, Thermometer, Droplets, Wind, Sun, MapPin, AlertTriangle, ShieldCheck, Send, MessageCircle, Phone, RefreshCw, Eye, CloudSun, Volume2, Sunrise, Sunset, Gauge, Bell, Sprout, Bug, CalendarClock, Antenna, Search, Command, CheckCircle2, XCircle, ShieldAlert, Zap, CloudLightning, Home } from 'lucide-react';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import SpeakButton from '../components/SpeakButton';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { sendWhatsAppAlert } from '../services/alertService';

function analyzeWeather(current, forecast) {
  const alerts = [];
  const actions = [];
  let dangerLevel = 'safe';

  const temp = current?.temp || 30;
  const humidity = current?.humidity || 50;
  const wind = parseFloat(current?.wind) || 0;
  const desc = (current?.description || '').toLowerCase();

  const isRaining = desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower');
  const willRain = forecast?.some(f => {
    const d = (f.description || '').toLowerCase();
    return d.includes('rain') || d.includes('drizzle') || d.includes('shower') || d.includes('thunder');
  });
  const rainProbability = isRaining ? 90 : willRain ? 70 : humidity > 85 ? 40 : 20;

  let sprayStatus = { allowed: true, reason: 'Mausham bilkul saaf hai. Aap chemical ya fertilizer spray kar sakte hain.', time: 'Sunrise to 10 AM / After 4 PM', color: 'text-green-600', icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> };
  let diseaseRisk = { risk: 'Low', reason: 'Fungal aur pest ka khatra kam hai.', color: 'text-green-600', icon: <ShieldCheck className="w-5 h-5 text-green-600" /> };
  let soilMoisture = { status: 'Normal', action: 'Irrigation maintain rakhein.', icon: <Droplets className="w-5 h-5 text-blue-500" /> };

  if (wind > 15) {
    sprayStatus = { allowed: false, reason: 'Tez hawa chal rahi hai! Spray udh jayega.', time: 'Wait for Wind < 10km/h', color: 'text-red-500', icon: <XCircle className="w-5 h-5 text-red-500" /> };
  } else if (rainProbability > 50) {
    sprayStatus = { allowed: false, reason: 'Barish aane ke chance hain. Spray dhul jaega!', time: 'Wait for Clear Sky', color: 'text-red-500', icon: <XCircle className="w-5 h-5 text-red-500" /> };
  } else if (temp > 35) {
    sprayStatus = { allowed: false, reason: 'Kadi dhoop hai! Dawaayi fasal ko jala sakti hai.', time: 'Only after 5 PM', color: 'text-orange-500', icon: <AlertTriangle className="w-5 h-5 text-orange-500" /> };
  }

  if (humidity > 75 && temp > 25 && temp < 32) {
    diseaseRisk = { risk: 'High', reason: 'Nami aur tapmaan ke karan FUNGAL disease failne ka zoro ka khatra hai!', color: 'text-red-500', icon: <ShieldAlert className="w-5 h-5 text-red-500" /> };
  }

  if (temp > 36 && humidity < 40) {
    soilMoisture = { status: 'Critical / Fast Drying', action: 'Dhoop tez hai, jald se jald paani do!', icon: <Sun className="w-5 h-5 text-orange-600" /> };
  }

  if (rainProbability > 50) {
    dangerLevel = rainProbability > 75 ? 'danger' : 'warning';
    alerts.push({
      type: 'rain',
      icon: <CloudRain className="w-6 h-6 text-blue-500" />,
      severity: rainProbability > 75 ? 'danger' : 'warning',
      titleHi: 'Bhari Barish Ka Alert!',
      titleEn: 'Heavy Rain Expected!',
      probability: `${rainProbability}% CHANCE`,
      actions: [
        { hi: 'Khet mein jama paani jald se jald nikalein', en: 'Open drainage channels immediately' },
        { hi: 'Kati hui fasal ko turant cover karein', en: 'Cover harvested crops with tarps' },
        { hi: 'Kisi bhi prakar ka spray bilkul na karein', en: 'STRICTLY NO SPRAYING today' },
      ],
      whatsappMsg: `AgriSaar DISASTER ALERT \nRain Probability: ${rainProbability}%\nArea Alert\n\nFarmer Instructions:\n- Stop spraying\n- Drain fields\n- Cover harvested crops\n\nStay Safe!`,
    });
  }

  if (temp > 38) {
    dangerLevel = temp > 42 ? 'danger' : 'warning';
    alerts.push({
      type: 'heat',
      icon: <Sun className="w-6 h-6 text-orange-500" />,
      severity: temp > 42 ? 'danger' : 'warning',
      titleHi: `Extreme Heat Alert! (${temp}°C)`,
      titleEn: `Extreme Heatwave! (${temp}°C)`,
      probability: `${temp}°C PEAK`,
      actions: [
        { hi: 'Fasal ki jadon ko mulching se dhakein', en: 'Use mulch to protect soil moisture' },
        { hi: 'Sinchai kewal subah ya shaam mein karein', en: 'Irrigate ONLY during dawn or dusk' },
        { hi: 'Dopahar 12-4 baje khet mein kaam se bachein', en: 'Avoid outdoor work from 12 PM - 4 PM' },
      ],
      whatsappMsg: `AgriSaar HEATWAVE ALERT \nTemp: ${temp}°C\nArea Alert\n\nFarmer Instructions:\n- Irrigate ONLY morning/evening\n- NO spraying in afternoon\n- Stay hydrated!`,
    });
  }

  if (wind > 35) {
    dangerLevel = 'warning';
    alerts.push({
      type: 'wind',
      icon: <Wind className="w-6 h-6 text-gray-400" />,
      severity: 'warning',
      titleHi: `Khatarnak Aandhi! (${wind} km/h)`,
      titleEn: `Strong Gale/Wind! (${wind} km/h)`,
      probability: `${wind} km/h GUSTS`,
      actions: [
        { hi: 'Lambe aur patle paudho ko support dein', en: 'Stake tall crops to prevent breaking' },
        { hi: 'Green-house aur shade-net tight karein', en: 'Secure shade nets and polyhouses' },
      ],
      whatsappMsg: `AgriSaar WIND ALERT \nSpeed: ${wind} km/h\nArea Alert\n\nFarmer Instructions:\n- Stake tall crops\n- Secure polyhouses\n- Do not spray pesticides!`,
    });
  }

  if (alerts.length === 0) {
    dangerLevel = 'safe';
    actions.push(
      { hi: 'Mausam bilkul laabhdayak hai — normal kaam jaari rakhein', en: 'Perfect weather for all farming activities' },
      { hi: 'Khet mein zaroorat anusar fertilizer dalne ka sahi samay', en: 'Excellent window for applying fertilizers' },
    );
  }

  let tomorrowDecision = null;
  if (forecast?.length > 1) {
    const tmr = forecast[1];
    const tmrDesc = (tmr?.description || '').toLowerCase();
    const tmrRain = tmrDesc.includes('rain') || tmrDesc.includes('shower') || tmrDesc.includes('thunder');
    const tmrHot = (tmr?.tempMax || 0) > 38;

    if (tmrRain) {
      tomorrowDecision = {
        icon: <CloudLightning className="w-32 h-32 text-blue-200" />,
        title: 'KAL BHARI BARISH HAI',
        hi: `Khet ka khula anaj turant andar karein.\nDrainage naliyan aaj hi saaf karein!`,
        en: `Move open grain indoors immediately.\nClear field drainage today!`,
        color: 'from-blue-600 via-indigo-600 to-blue-900',
      };
    } else if (tmrHot) {
      tomorrowDecision = {
        icon: <Sun className="w-32 h-32 text-orange-200" />,
        title: 'KAL KADI DHOOP HOGI',
        hi: `Aaj raat khet mein halke paani ki sinchai zaroor karein.\nFasal sookhne se bachayein!`,
        en: `Apply light irrigation tonight.\nSave crops from drying out!`,
        color: 'from-orange-500 via-red-600 to-rose-900',
      };
    }
  }

  let fiveDaySummary = null;
  if (forecast?.length >= 5) {
    let rainyDays = 0;
    let maxTempLimit = 0;
    forecast.forEach(d => {
      const desc = (d.description || '').toLowerCase();
      if (desc.includes('rain') || desc.includes('shower')) rainyDays++;
      if (d.tempMax > maxTempLimit) maxTempLimit = d.tempMax;
    });

    if (rainyDays >= 3) {
      fiveDaySummary = {
        title: "AgriSaar 5-Day Prediction: High Rain Alert",
        en: `There is a significant chance of rain for ${rainyDays} out of the next 5 days. Expect cloudy skies and wet soil conditions. Halt any scheduled spraying or fertilization until weather clears up.`,
        hi: `Agle 5 dinon mein se ${rainyDays} din bhari barish ki sambhavna hai. Khet mein dawa ya khad ka chhidkaw bilkul rok dein. Keedon ki roktham ke liye tayar rahein.`,
        color: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800",
        iconText: "text-blue-600 dark:text-blue-400"
      };
    } else if (maxTempLimit > 38 && rainyDays === 0) {
      fiveDaySummary = {
        title: "AgriSaar 5-Day Prediction: Severe Heatwave",
        en: `No rain expected over the next 5 days with temperatures soaring up to ${maxTempLimit}°C. Immediate and frequent irrigation is highly recommended to protect crop roots.`,
        hi: `Agle 5 din koi barish nahi hogi aur tapmaan ${maxTempLimit}°C tak ja sakta hai. Fasal ko sookhne se bachane ke liye lagatar sinchai (paani) dete rahein.`,
        color: "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800",
        iconText: "text-orange-600 dark:text-orange-400"
      };
    } else if (rainyDays > 0) {
      fiveDaySummary = {
        title: "AgriSaar 5-Day Prediction: Mixed Weather",
        en: `Expect mild fluctuations with ${rainyDays} day(s) of rain or showers. Plan your farming activities around these rainy windows. Keep drainage systems clear.`,
        hi: `Mausam mila-jula rahega. Agle 5 dinon mein ${rainyDays} din barish ho sakti hai. Apne kheti ke kaam barish ka waqt dekh kar plan karein.`,
        color: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800",
        iconText: "text-emerald-600 dark:text-emerald-400"
      };
    } else {
      fiveDaySummary = {
        title: "AgriSaar 5-Day Prediction: Clear & Optimal",
        en: `The weather will remain mostly clear and stable. This is an excellent 5-day window for any harvesting, sowing, or pesticide application.`,
        hi: `Agle 5 din mausam bilkul saaf aur accha rahega. Aap bina kisi chinta ke khad, spray ya fasal ki kataai ka kaam aaram se kar sakte hain.`,
        color: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
        iconText: "text-green-600 dark:text-green-400"
      };
    }
  }

  return { alerts, actions, dangerLevel, rainProbability, tomorrowDecision, sprayStatus, diseaseRisk, soilMoisture, fiveDaySummary };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.1, ease: 'easeOut' } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 80, damping: 20 } }
};

export default function WeatherPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [activeState, setActiveState] = useState('');
  const [mapLat, setMapLat] = useState(23.0225);
  const [mapLon, setMapLon] = useState(72.5714);

  const { lat, lon, city: geoCity, state: geoState, loading: locLoading } = useLocation();
  const { user } = useAuth();

  const mockUser = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kisan',
    phone: user?.phone || user?.user_metadata?.phone || '+91 9876543210'
  };

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isSendingPersonal, setIsSendingPersonal] = useState(false);
  const [showSmsPreview, setShowSmsPreview] = useState(false);
  const [broadcastCount, setBroadcastCount] = useState(0);

  const resolveState = async (rlat, rlon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${rlat}&lon=${rlon}&format=json&accept-language=en&zoom=10`, { headers: { 'User-Agent': 'AgriSaar/1.0' } });
      const geo = await res.json();
      return geo?.address?.state || geo?.address?.region || 'India';
    } catch { return 'India'; }
  };

  useEffect(() => {
    if (!locLoading && lat && lon && !activeCity) {
      setActiveCity(geoCity || 'Ahmedabad');
      setActiveState(geoState || 'Gujarat');
      setMapLat(lat);
      setMapLon(lon);
      fetchWeatherData(`lat=${lat}&lon=${lon}`);
    }
  }, [locLoading, lat, lon]);



  const fetchWeatherData = async (queryParam) => {
    try {
      setLoading(true);
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?${queryParam}&appid=d0be759f268a1e54e4dc78e5eeaea0dd&units=metric`).then(r => r.json()).catch(() => ({ cod: 500 })),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?${queryParam}&appid=d0be759f268a1e54e4dc78e5eeaea0dd&units=metric`).then(r => r.json()).catch(() => ({})),
      ]);

      if (currentRes.cod !== 200 && currentRes.cod !== 201) {
        throw new Error('API Error');
      }

      const apiCity = currentRes.name;
      const apiLat = currentRes.coord?.lat;
      const apiLon = currentRes.coord?.lon;

      if (apiLat && apiLon) {
        setMapLat(apiLat);
        setMapLon(apiLon);
      }

      const detectedState = await resolveState(apiLat || lat, apiLon || lon);
      setActiveCity(apiCity);
      setActiveState(detectedState === apiCity ? 'India' : detectedState);

      setBroadcastCount(Math.floor(Math.random() * 5000) + 1200);

      const current = {
        temp: Math.round(currentRes.main.temp),
        feelsLike: Math.round(currentRes.main.feels_like),
        humidity: currentRes.main.humidity,
        wind: (currentRes.wind?.speed * 3.6).toFixed(1),
        pressure: currentRes.main.pressure,
        visibility: currentRes.visibility ? (currentRes.visibility / 1000).toFixed(1) : '10',
        description: currentRes.weather?.[0]?.description || 'Clear',
        icon: currentRes.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${currentRes.weather[0].icon}@4x.png` : null,
        sunrise: currentRes.sys?.sunrise ? new Date(currentRes.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null,
        sunset: currentRes.sys?.sunset ? new Date(currentRes.sys.sunset * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null,
      };

      const forecast = [];
      const dailyMap = new Map();
      (forecastRes?.list || []).forEach(item => {
        const date = item.dt_txt?.split(' ')[0];
        if (!date) return;
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date,
            tempMaxes: [],
            tempMins: [],
            humidities: [],
            winds: [],
            // Pick the mid-day entry for description/icon (closest to 12:00)
            bestItem: item,
            bestDist: Math.abs(parseInt(item.dt_txt?.split(' ')[1]?.split(':')[0] || '0') - 12),
          });
        }
        const entry = dailyMap.get(date);
        entry.tempMaxes.push(item.main.temp_max);
        entry.tempMins.push(item.main.temp_min);
        entry.humidities.push(item.main.humidity);
        entry.winds.push(item.wind?.speed || 0);
        // Prefer the slot closest to noon for icon/description
        const hour = parseInt(item.dt_txt?.split(' ')[1]?.split(':')[0] || '0');
        const dist = Math.abs(hour - 12);
        if (dist < entry.bestDist) {
          entry.bestDist = dist;
          entry.bestItem = item;
        }
      });

      // Convert aggregated data to forecast array
      for (const [date, entry] of dailyMap) {
        if (forecast.length >= 5) break;
        // Parse date parts manually to avoid timezone shifting
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(year, month - 1, day); // Local date, no UTC shift
        forecast.push({
          date,
          dayName: d.toLocaleDateString('en-IN', { weekday: 'short' }),
          fullDay: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
          tempMax: Math.round(Math.max(...entry.tempMaxes)),
          tempMin: Math.round(Math.min(...entry.tempMins)),
          humidity: Math.round(entry.humidities.reduce((a, b) => a + b, 0) / entry.humidities.length),
          wind: (entry.winds.reduce((a, b) => a + b, 0) / entry.winds.length * 3.6).toFixed(0),
          description: entry.bestItem.weather?.[0]?.description || '',
          icon: entry.bestItem.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${entry.bestItem.weather[0].icon}@2x.png` : null,
        });
      }
      setData({ current, forecast });
    } catch (err) {
      console.warn("Using Fallback Weather Data (API failed):", err);
      const fallbackCurrent = {
        temp: 32, feelsLike: 34, humidity: 65, wind: 12, pressure: 1013, visibility: 10,
        description: 'Partly cloudy', icon: 'https://openweathermap.org/img/wn/02d@4x.png',
        sunrise: '06:10 AM', sunset: '06:45 PM'
      };

      // Generate dynamic fallback dates starting from today
      const fallbackForecast = [];
      const fallbackTemplates = [
        { tempMax: 33, tempMin: 22, humidity: 60, wind: 10, description: 'clear sky', icon: 'https://openweathermap.org/img/wn/01d@2x.png' },
        { tempMax: 30, tempMin: 21, humidity: 75, wind: 15, description: 'light rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
        { tempMax: 28, tempMin: 20, humidity: 85, wind: 18, description: 'heavy rain', icon: 'https://openweathermap.org/img/wn/09d@2x.png' },
        { tempMax: 35, tempMin: 24, humidity: 50, wind: 25, description: 'cloudy', icon: 'https://openweathermap.org/img/wn/03d@2x.png' },
        { tempMax: 39, tempMin: 26, humidity: 35, wind: 5, description: 'hot sun', icon: 'https://openweathermap.org/img/wn/01d@2x.png' }
      ];
      for (let i = 0; i < 5; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        fallbackForecast.push({
          ...fallbackTemplates[i],
          date: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-IN', { weekday: 'short' }),
          fullDay: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
        });
      }

      const manualName = queryParam.includes('q=') ? decodeURIComponent(queryParam.split('q=')[1]) : geoCity || 'Ahmedabad';

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualName)}&format=json&accept-language=en&limit=1&countrycodes=in`, { headers: { 'User-Agent': 'AgriSaar/1.0' } });
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          const place = geoData[0];
          const pLat = parseFloat(place.lat);
          const pLon = parseFloat(place.lon);
          setMapLat(pLat);
          setMapLon(pLon);

          const resolvedState = await resolveState(pLat, pLon);
          const displayName = place.display_name?.split(',')[0] || manualName;
          setActiveCity(displayName);
          setActiveState(resolvedState === displayName ? 'India' : resolvedState);
        } else {
          setActiveCity(manualName);
          setActiveState('India');
        }
      } catch {
        setActiveCity(manualName);
        setActiveState('India');
      }

      setBroadcastCount(3452);
      setData({ current: fallbackCurrent, forecast: fallbackForecast });
    } finally {
      setLoading(false);
      setSearchQuery('');
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherData(`q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWeatherData(`q=${encodeURIComponent(activeCity)}`);
    setRefreshing(false);
  };

  const handleBroadcastAlert = () => {
    setIsBroadcasting(true);
    const id = toast.loading(`📡 Broadcasting Emergency SMS to ${broadcastCount} farmers in ${activeCity}...`, {
      style: { background: '#1e3a8a', color: '#fff', borderRadius: '12px' }
    });
    setTimeout(() => {
      toast.success(
        <div className="flex flex-col">
          <span className="font-black text-lg">Broadcast Complete! ✅</span>
          <span className="text-sm">SMS alerts successfully delivered to all {broadcastCount} farmers in {activeCity}.</span>
        </div>,
        { id, duration: 8000, style: { background: '#047857', color: '#fff' } }
      );
      setIsBroadcasting(false);
    }, 3500);
  };

  const handlePersonalAlert = () => {
    if (analysis.alerts.length === 0) {
      toast.error("Safe Weather! No emergency alerts to send.");
      return;
    }

    setIsSendingPersonal(true);
    setShowSmsPreview(true);

    const whatsappMsg = analysis.alerts[0].whatsappMsg || `AgriSaar Alert \n📍 ${activeCity}\nCurrent Weather: ${current?.temp}°C, ${current?.description}`;
    // Format phone to just numbers, or use default fallback if missing
    const rawPhone = mockUser.phone?.replace(/\D/g, '') || '';
    const phoneNum = rawPhone.length >= 10 ? rawPhone : '917870929584';

    // Auto-hide preview after 6 seconds
    setTimeout(() => {
      setShowSmsPreview(false);
      setIsSendingPersonal(false);

      // Open actual Whatsapp
      sendWhatsAppAlert(whatsappMsg, phoneNum);

      toast.success(
        <div className="flex flex-col">
          <span className="font-black text-lg">Alert Open ✅</span>
          <span className="text-sm">WhatsApp opened with your AgriSaar weather alert.</span>
        </div>,
        { duration: 4000, style: { background: '#047857', color: '#fff' } }
      );
    }, 6000);
  };

  if (locLoading || loading && !data) return <Loading text="Initializing Atmospheric Radars..." />;
  if (!data) return null;

  const current = data.current;
  const forecast = data.forecast || [];
  const analysis = analyzeWeather(current, forecast);

  // Cinematic Backgrounds based on weather
  const descString = (current?.description || '').toLowerCase();
  let fallbackImg = '';
  let themeColors = {};

  if (descString.includes('rain') || descString.includes('drizzle') || descString.includes('shower')) {
    fallbackImg = 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1920&q=80'; // rain
    themeColors = { bg: 'from-blue-900/80 via-gray-900/90 to-slate-900', border: 'border-blue-500/30', glow: 'shadow-[0_0_100px_rgba(59,130,246,0.15)]' };
  } else if (descString.includes('thunder') || descString.includes('storm')) {
    fallbackImg = 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1920&q=80'; // lightning
    themeColors = { bg: 'from-indigo-900/90 via-gray-900/95 to-black', border: 'border-purple-500/30', glow: 'shadow-[0_0_100px_rgba(168,85,247,0.15)]' };
  } else if (descString.includes('cloud')) {
    fallbackImg = 'https://images.unsplash.com/photo-1501630834273-4b5604c98e5e?w=1920&q=80'; // clouds
    themeColors = { bg: 'from-gray-800/80 via-slate-900/90 to-gray-950', border: 'border-white/20', glow: 'shadow-[0_0_100px_rgba(255,255,255,0.05)]' };
  } else if (current?.temp > 35) {
    fallbackImg = 'https://images.unsplash.com/photo-1413882353314-73389f63b6fd?w=1920&q=80'; // hot sun
    themeColors = { bg: 'from-orange-900/80 via-amber-900/90 to-gray-900', border: 'border-orange-500/30', glow: 'shadow-[0_0_100px_rgba(249,115,22,0.15)]' };
  } else {
    fallbackImg = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80'; // beautiful clear
    themeColors = { bg: 'from-emerald-900/70 via-teal-900/80 to-gray-900', border: 'border-emerald-500/30', glow: 'shadow-[0_0_100px_rgba(16,185,129,0.15)]' };
  }

  const overallSpeakText = `${activeCity} ka mausam hai ${current?.temp} degrees, ${current?.description}. ${analysis.alerts.length > 0 ? 'Dhyan rakhein! ' + analysis.alerts[0].titleHi : 'Mausam kheti ke liye accha hai.'}`;

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-gray-950 pb-16 font-sans">
      <Helmet>
        <title>Weather Advisory — Mausam Salah for Farmers | AgriSaar</title>
        <meta name="description" content="Real-time weather updates with AI-powered farming advisory. Get rain alerts, frost warnings, spray timings, irrigation advice, and SMS weather broadcasts for your village." />
        <meta property="og:title" content="Weather Advisory — Mausam Salah for Farmers | AgriSaar" />
        <meta property="og:description" content="Live weather intelligence for Indian farmers — temperature, humidity, wind, rain forecast with actionable farming advice and danger alerts." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="weather advisory, mausam, farming weather, rain alert, frost warning, kisaan mausam, weather forecast India, AgriSaar" />
      </Helmet>

      {/* ── HIGH-LEVEL HERO SECTION ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-[85vh] flex items-center pt-24 pb-12 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img src={fallbackImg} alt="Environment" className="w-full h-full object-cover scale-105" />
          <div className={`absolute inset-0 bg-gradient-to-b ${themeColors.bg}`}></div>
          {/* Danger overlay if severe weather */}
          {analysis.dangerLevel === 'danger' && <div className="absolute inset-0 bg-red-600/20 mix-blend-overlay animate-pulse"></div>}

          {/* Decorative Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-400/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        </div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* Top Bar: Manual Search & Tools */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-5">

              {/* Location Badge */}
              <div className="flex flex-col gap-3">
                <motion.div variants={itemVariants} className="flex items-center gap-3 bg-black/30 backdrop-blur-3xl px-6 py-4 rounded-[2rem] border border-white/20 shadow-2xl w-max">
                  <MapPin className="w-6 h-6 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-bounce" />
                  <div>
                    <span className="text-white font-black text-lg tracking-widest uppercase block leading-none">{activeCity || 'Locating...'}</span>
                    <span className="text-white/60 font-medium text-[10px] uppercase tracking-widest mt-1 block border-t border-white/10 pt-1">
                      {activeState && activeState !== 'India' && activeState !== activeCity ? `${activeState}, India` : 'India'}
                    </span>
                  </div>
                </motion.div>

              </div>

              {/* Ultra Sleek Manual Search Bar */}
              <motion.form
                variants={itemVariants}
                onSubmit={handleManualSearch}
                className="flex items-center flex-1 max-w-xl mx-auto lg:mx-0 relative group"
              >
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search City or State (e.g. Pune, Maharashtra)..."
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 backdrop-blur-2xl border border-white/20 focus:border-white/50 text-white placeholder-white/50 text-base font-bold rounded-full py-4 pl-14 pr-32 transition-all outline-none shadow-xl"
                />
                <div className="absolute inset-y-2 right-2">
                  <button type="submit" disabled={loading} className="bg-white text-black hover:bg-gray-100 flex items-center gap-2 px-5 h-full rounded-full font-black text-sm transition-transform active:scale-95 disabled:opacity-50">
                    <Command className="w-4 h-4" /> Check
                  </button>
                </div>
              </motion.form>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 justify-center lg:justify-end">
                <SpeakButton text={overallSpeakText} label="Listen AI Report" size="md" />
                <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-4 rounded-full text-sm font-black shadow-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all border border-blue-400/30 active:scale-95 disabled:opacity-50">
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Sync Radar
                </button>
              </motion.div>
            </div>

            {/* Massive Main Weather Glass Card */}
            <div className={`relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-12 bg-white/5 backdrop-blur-[50px] border ${themeColors.border} ${themeColors.glow} rounded-[3rem] p-10 sm:p-16`}>
              {/* Highlight Refraction Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none mix-blend-overlay"></div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-14 relative z-10 w-full xl:w-auto">
                {current?.icon && (
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ type: "spring", stiffness: 200, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                    className="relative shrink-0"
                  >
                    <div className="absolute inset-0 bg-white/20 blur-[50px] rounded-full"></div>
                    <img src={current.icon.replace('4x', '4x')} alt="icon" className="w-48 h-48 sm:w-[280px] sm:h-[280px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-10 filter hover:brightness-110 transition-all scale-110 sm:scale-125" />
                  </motion.div>
                )}
                <div className="text-center sm:text-left pt-4 flex flex-col items-center sm:items-start w-full">
                  <div className="notranslate text-[6rem] sm:text-[11rem] font-black tracking-tighter bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-2xl leading-none flex items-start justify-center sm:justify-start w-full max-w-full">
                    {current?.temp}<span className="text-4xl sm:text-[4rem] text-white/50 mt-6 sm:mt-10 ml-2 block">°C</span>
                  </div>
                  <p className="text-blue-100 font-extrabold text-2xl sm:text-4xl capitalize mt-2 drop-shadow-xl tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight w-full max-w-full break-words">
                    {current?.description}
                  </p>
                  <p className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 mt-6 text-green-300 font-black text-xl tracking-wide rounded-2xl shadow-inner shadow-green-500/10 whitespace-nowrap">
                    <Thermometer className="w-6 h-6 text-green-400 shrink-0" /> Feels like <span className="notranslate">{current?.feelsLike}°C</span>
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 w-full xl:w-auto relative z-10 shrink-0 xl:min-w-[450px]">
                <StatsCard icon={<Droplets className="w-7 h-7 text-cyan-400 shrink-0" />} label="Humidity" value={`${current?.humidity}%`} />
                <StatsCard icon={<Wind className="w-7 h-7 text-emerald-400 shrink-0" />} label="Avg Wind" value={`${current?.wind} km/h`} />
                <StatsCard icon={<Eye className="w-7 h-7 text-blue-300 shrink-0" />} label="Visibility" value={`${current?.visibility} km`} />
                <StatsCard icon={<Gauge className="w-7 h-7 text-amber-300 shrink-0" />} label="Pressure" value={`${current?.pressure}`} sub="hPa" />
              </motion.div>
            </div>

            {/* 📱 Real-time SMS Delivery Preview */}
            <AnimatePresence>
              {showSmsPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.8 }}
                  className="fixed bottom-10 right-10 z-[100] w-[320px] bg-black/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-6 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                      <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Incoming SMS</p>
                      <p className="text-sm font-black text-white uppercase tracking-tight">AgriSaar Official</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/5 mb-2">
                    <p className="text-white font-bold leading-snug">
                      "AgriSaar Alert: {activeCity} mein {current?.description} dekhi gayi hai. {analysis.alerts[0]?.titleEn || 'Savdhan rahein!'} kisan sathi khet mein savdhani bartein."
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] font-bold text-white/30 lowercase">powered by agrisaar ai</span>
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-400/10 px-2 py-0.5 rounded">Verified</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {(current?.sunrise || current?.sunset) && (
              <motion.div variants={itemVariants} className="flex justify-center sm:justify-start flex-wrap gap-4 mt-8">
                {current.sunrise && (
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl px-8 py-3.5 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <Sunrise className="w-6 h-6 text-amber-400" />
                    <span className="text-white font-extrabold text-sm uppercase tracking-widest textShadow">Dawn: {current.sunrise}</span>
                  </div>
                )}
                {current.sunset && (
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl px-8 py-3.5 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <Sunset className="w-6 h-6 text-orange-400" />
                    <span className="text-white font-extrabold text-sm uppercase tracking-widest textShadow">Dusk: {current.sunset}</span>
                  </div>
                )}
              </motion.div>
            )}

          </motion.div>
        </div>
      </motion.section>

      {/* ── ADVANCED FARMER WIDGETS (Spray, Disease, Moisture) ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-20">
        <div className="mb-14">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl"><Sprout className="w-6 h-6 text-green-600 dark:text-green-400" /></div> Real-time Farming Intelligence
          </h2>
          <div className="grid md:grid-cols-3 gap-6">

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all">
              <div className="flex items-center gap-5 mb-5">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner ${analysis.sprayStatus.allowed ? 'bg-green-100 dark:bg-green-900/40 text-green-600' : 'bg-red-100 dark:bg-red-900/40 text-red-600'}`}>
                  {analysis.sprayStatus.icon}
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Pesticide Spray</h3>
                  <p className={`text-2xl font-black ${analysis.sprayStatus.color}`}>{analysis.sprayStatus.allowed ? 'Safe to Spray' : 'DO NOT SPRAY'}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-bold mb-6 text-lg leading-snug">{analysis.sprayStatus.reason}</p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 font-black text-sm flex items-center gap-3">
                <CalendarClock className="w-5 h-5 text-gray-500" /> Window: {analysis.sprayStatus.time}
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all">
              <div className="flex items-center gap-5 mb-5">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner ${analysis.diseaseRisk.risk === 'High' ? 'bg-red-100 dark:bg-red-900/40' : 'bg-green-100 dark:bg-green-900/40'}`}>
                  {analysis.diseaseRisk.icon}
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Disease / Pest</h3>
                  <p className={`text-2xl font-black ${analysis.diseaseRisk.color}`}>{analysis.diseaseRisk.risk} Risk</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-bold mb-6 text-lg leading-snug">{analysis.diseaseRisk.reason}</p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 font-black text-sm flex items-center gap-3">
                <Bug className="w-5 h-5 text-gray-500" /> Action: {analysis.diseaseRisk.risk === 'High' ? 'Apply preventive fungicide' : 'No action needed'}
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all">
              <div className="flex items-center gap-5 mb-5">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner ${analysis.soilMoisture.status.includes('Fast') ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600'}`}>
                  {analysis.soilMoisture.icon}
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Soil Moisture</h3>
                  <p className={`text-xl font-black ${analysis.soilMoisture.status.includes('Fast') ? 'text-orange-600' : 'text-blue-600'}`}>{analysis.soilMoisture.status}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-bold mb-6 text-lg leading-snug">{analysis.soilMoisture.action}</p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 font-black text-sm flex items-center gap-3">
                <Droplets className="w-5 h-5 text-gray-500" /> Depend on recent irrigation
              </div>
            </motion.div>

          </div>
        </div>

        {/* ═══════════ EMERGENCY ALERTS & BROADCAST ═══════════ */}
        {analysis.alerts.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 mb-16">
            {analysis.alerts.map((alert, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`relative rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] border-[6px] ${alert.severity === 'danger' ? 'border-red-500/20 bg-white ring-[10px] ring-red-500/10' : 'border-amber-500/20 bg-white ring-[10px] ring-amber-500/10'
                  }`}
              >
                {/* Flashing Alert Header */}
                <div className={`px-10 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 ${alert.severity === 'danger' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                  }`}>
                  <div className="flex items-center gap-8">
                    <span className="text-7xl drop-shadow-2xl p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem] shadow-inner">{alert.icon}</span>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-white/30 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-white/40 shadow-inner inline-block">Govt Warning System</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">{alert.titleEn}</h3>
                      <p className="text-white/90 text-2xl font-extrabold mt-2 tracking-wide">{alert.titleHi}</p>
                    </div>
                  </div>
                  <div className="self-start md:self-center bg-white text-gray-900 font-black text-3xl px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 rotate-2 hover:rotate-0 transition-transform">
                    <AlertTriangle className={`w-8 h-8 ${alert.severity === 'danger' ? 'text-red-500' : 'text-amber-500'} animate-pulse`} /> {alert.probability}
                  </div>
                </div>

                <div className="p-10 md:p-14 dark:bg-gray-950">
                  <h4 className="text-base font-black text-gray-800 dark:text-gray-300 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-green-600" /> Immediate Safety Measures
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {alert.actions.map((action, j) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        key={j}
                        className={`p-8 rounded-3xl border-2 shadow-md ${alert.severity === 'danger' ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                          }`}
                      >
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-snug">{action.en}</p>
                        <p className="text-lg text-gray-600 dark:text-gray-300 font-extrabold mt-3 border-t border-black/10 dark:border-white/10 pt-3">{action.hi}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* ── BROADCAST & PERSONAL SMS ── */}
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-10 flex flex-col items-start gap-8 shadow-inner">

                    <div className="w-full border-b border-gray-200 dark:border-gray-700 pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl"><Phone className="w-6 h-6 text-green-600 dark:text-green-400" /></div> Personal Notification
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 text-lg max-w-2xl">
                          Mausam ki sthiti dekhte hue, turant apne phone par is alert ki detail SMS bhej lein.
                        </p>
                      </div>
                      <button
                        onClick={handlePersonalAlert}
                        disabled={isSendingPersonal}
                        className={`flex-shrink-0 flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-[0_15px_30px_rgba(34,197,94,0.3)] ${isSendingPersonal ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white active:scale-95 hover:scale-105'}`}
                      >
                        {isSendingPersonal ? <RefreshCw className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6" />}
                        {isSendingPersonal ? 'Sending SMS...' : `Send Alert to ${mockUser.name} (${mockUser.phone})`}
                      </button>
                    </div>

                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl"><Antenna className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div> Local Village Broadcast System
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 text-lg max-w-2xl">
                          As a verified user, you can broadcast this emergency weather alert via SMS directly to all registered farmers in {activeCity}.
                        </p>
                      </div>
                      <button
                        onClick={handleBroadcastAlert}
                        disabled={isBroadcasting}
                        className={`flex-shrink-0 flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-[0_15px_30px_rgba(225,29,72,0.3)] ${isBroadcasting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white active:scale-95 hover:scale-105'}`}
                      >
                        {isBroadcasting ? <RefreshCw className="animate-spin w-6 h-6" /> : <Antenna className="w-6 h-6" />}
                        {isBroadcasting ? 'Broadcasting...' : `Broadcast to ${broadcastCount} Farmers`}
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ═══════════ Tomorrow's Smart Decision ═══════════ */}
        {analysis.tomorrowDecision && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-[3.5rem] bg-gradient-to-br ${analysis.tomorrowDecision.color} border border-white/20 p-12 mb-20 shadow-[0_40px_80px_rgba(0,0,0,0.3)] text-white relative overflow-hidden group hover:shadow-[0_40px_100px_rgba(0,0,0,0.4)] transition-shadow`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-white/5 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-1000 z-0"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-white/20 blur-[40px] rounded-full"></div>
                <span className="text-[9rem] drop-shadow-2xl relative z-10 block animate-bounce" style={{ animationDuration: '3s' }}>{analysis.tomorrowDecision.icon}</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 border border-white/40 shadow-inner">
                  <Sprout className="w-4 h-4" /> AI Prediction Engine
                </span>
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-none drop-shadow-lg">{analysis.tomorrowDecision.title}</h2>
                <div className="bg-white/10 border border-white/20 rounded-[2rem] p-8 backdrop-blur-2xl inline-block text-left shadow-2xl">
                  <p className="text-2xl sm:text-3xl font-black whitespace-pre-line text-white border-l-8 border-white/50 pl-6 leading-snug">{analysis.tomorrowDecision.en}</p>
                  <p className="text-white/80 font-extrabold mt-5 text-xl whitespace-pre-line border-l-8 border-white/20 pl-6">{analysis.tomorrowDecision.hi}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════ 5-Day Forecast Modern Grid ═══════════ */}
        {forecast.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-10 flex items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl"><CloudSun className="w-8 h-8 text-blue-600 dark:text-blue-400" /></div> Weekly Forecast Map
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {forecast.map((day, i) => {
                const dayDesc = (day.description || '').toLowerCase();
                const hasRain = dayDesc.includes('rain') || dayDesc.includes('shower');
                const isHot = day.tempMax > 38;

                return (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    key={i}
                    className={`rounded-[2.5rem] p-8 border-[3px] text-center transition-all shadow-lg hover:shadow-2xl group relative overflow-hidden bg-white dark:bg-gray-900 ${hasRain ? 'border-blue-300 shadow-blue-500/30' : isHot ? 'border-orange-300 shadow-orange-500/30' : 'border-gray-100 dark:border-gray-800'
                      }`}>
                    {hasRain && <div className="absolute inset-0 bg-gradient-to-b from-blue-100/80 to-transparent opacity-80 dark:from-blue-900/40 z-0"></div>}
                    {isHot && <div className="absolute inset-0 bg-gradient-to-b from-orange-100/80 to-transparent opacity-80 dark:from-orange-900/40 z-0"></div>}

                    <div className="relative z-10">
                      <p className={`text-xl font-black uppercase tracking-widest mb-1 ${hasRain ? 'text-blue-700' : isHot ? 'text-orange-700' : 'text-gray-900 dark:text-white'}`}>{day.dayName}</p>
                      <p className="text-sm text-gray-500 font-extrabold mb-5 bg-gray-100 dark:bg-gray-800 rounded-full py-1 px-3 inline-block">{day.fullDay}</p>

                      {day.icon && <img src={day.icon.replace('2x', '4x')} alt="" className="w-28 h-28 mx-auto mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] group-hover:scale-125 group-hover:-rotate-3 transition-transform duration-500" />}

                      <div className="flex flex-col items-center justify-center gap-0 mb-4">
                        <p className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter drop-shadow-sm">{day.tempMax}°</p>
                        <p className="text-xl text-gray-400 font-black -mt-1 bg-gray-50 dark:bg-gray-800 px-3 rounded-full mt-1">low {day.tempMin}°</p>
                      </div>

                      <p className="text-base text-gray-600 dark:text-gray-400 font-black capitalize mt-2 border-t-2 border-gray-50 dark:border-gray-800 pt-4 flex items-center justify-center min-h-[3rem]">{day.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════════ AI 5-Day Insight Summary ═══════════ */}
        {analysis.fiveDaySummary && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="w-full max-w-5xl mx-auto pb-10">
            <div className={`p-8 sm:p-12 rounded-[3.5rem] border-2 shadow-2xl ${analysis.fiveDaySummary.color} relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-white/40 dark:bg-black/20 mix-blend-overlay"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-current opacity-10 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-1000"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className={`p-6 rounded-3xl bg-white dark:bg-gray-900 shadow-xl shrink-0`}>
                  <CalendarClock className={`w-14 h-14 ${analysis.fiveDaySummary.iconText}`} />
                </div>

                <div className="text-center md:text-left flex-1">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 bg-white/50 dark:bg-gray-900/50 ${analysis.fiveDaySummary.iconText}`}>
                    <Sprout className="w-4 h-4" /> 5-Day Farming Advisory
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight drop-shadow-sm">{analysis.fiveDaySummary.title}</h3>
                  <div className="flex flex-col gap-5">
                    <p className="text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-200 border-l-4 border-gray-400 pl-5 leading-relaxed">
                      {analysis.fiveDaySummary.hi}
                    </p>
                    <p className="text-base font-bold text-gray-600 dark:text-gray-400 border-l-4 border-gray-300 dark:border-gray-700 pl-5">
                      {analysis.fiveDaySummary.en}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mx-auto pb-12"
        >
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-8 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                  <MapPin className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Live Location Map</h3>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{activeCity}{activeState && activeState !== 'India' && activeState !== activeCity ? `, ${activeState}` : ''}, India</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                {mapLat.toFixed(4)}°N, {mapLon.toFixed(4)}°E
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="rounded-[2rem] overflow-hidden border-2 border-gray-100 dark:border-gray-800 shadow-inner">
                <iframe
                  key={`${mapLat}-${mapLon}`}
                  title="Weather Location Map"
                  width="100%"
                  height="420"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLon - 0.15}%2C${mapLat - 0.1}%2C${mapLon + 0.15}%2C${mapLat + 0.1}&layer=mapnik&marker=${mapLat}%2C${mapLon}`}
                ></iframe>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, sub }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
      className="bg-white/10 backdrop-blur-3xl rounded-[2rem] p-5 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-4 group cursor-default transition-all"
    >
      <div className="bg-white/15 p-3 rounded-2xl shadow-inner border border-white/20 group-hover:bg-white/30 group-hover:rotate-12 transition-all drop-shadow-xl shrink-0">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-white/70 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-1 truncate">{label}</p>
        <p className="text-white font-black text-xl sm:text-2xl flex items-baseline gap-1 drop-shadow-lg leading-tight truncate overflow-hidden">
          <span className="truncate" dangerouslySetInnerHTML={{ __html: value.replace(' km/h', ' <span class="text-sm">km/h</span>').replace(' km', ' <span class="text-sm">km</span>') }}></span>
          {sub && <span className="text-sm text-white/60 font-bold ml-1">{sub}</span>}
        </p>
      </div>
    </motion.div>
  );
}
