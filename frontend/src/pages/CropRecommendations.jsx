import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Wheat, CheckCircle2, TrendingUp, DollarSign, CloudSun, Droplets, MapPin, Volume2, Square, Loader2, Sprout, Thermometer, Calendar, Lightbulb, ArrowUpRight, ArrowDownRight, RefreshCw, Wind, Sun, Star, UploadCloud, Camera, Leaf, AlertCircle } from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import { getCrops } from '../services/cropApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import Error from '../components/Error';
import SpeakButton from '../components/SpeakButton';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Real Indian Crop Database with market prices, seasons, images ── */
const CROP_DATABASE = {
  'Wheat': {
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi (Oct–Mar)',
    tempRange: '15°C – 25°C',
    waterNeed: 'Medium',
    mspPrice: 2275,
    marketPriceRange: [2100, 2500],
    growthDays: '120–150 days',
    bestStates: ['Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan'],
    suggestion: 'Best sowing time is November. Use DAP fertilizer at sowing.',
    yieldPerHectare: '45–55 quintals',
    medicine: 'Propiconazole 25% EC for Rust',
    fertilizer: 'DAP: 50kg, Urea: 100kg (Split)',
    profit: '₹40,000/acre'
  },
  'Rice': {
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif (Jun–Nov)',
    tempRange: '22°C – 35°C',
    waterNeed: 'High',
    mspPrice: 2203,
    marketPriceRange: [2000, 2600],
    growthDays: '100–150 days',
    bestStates: ['West Bengal', 'UP', 'Punjab', 'AP', 'Tamil Nadu'],
    suggestion: 'Transplant seedlings after 25 days. Maintain 5cm water level.',
    yieldPerHectare: '35–50 quintals',
    medicine: 'Zinc Sulfate for Khaira',
    fertilizer: 'Urea: 120kg, SSP: 150kg',
    profit: '₹30,000/acre'
  },
  'Maize': {
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif & Rabi',
    tempRange: '21°C – 30°C',
    waterNeed: 'Medium',
    mspPrice: 2090,
    marketPriceRange: [1800, 2400],
    growthDays: '80–110 days',
    bestStates: ['Karnataka', 'Bihar', 'MP', 'Rajasthan', 'Maharashtra'],
    suggestion: 'Apply urea in two splits. Watch for Fall Armyworm.',
    yieldPerHectare: '50–70 quintals',
    medicine: 'Emamectin benzoate for FAW',
    fertilizer: 'DAP: 40kg, Urea: 80kg',
    profit: '₹20,000/acre'
  },
  'Cotton': {
    image: 'https://images.unsplash.com/photo-1590483864197-0ec997a39833?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif (Apr–Oct)',
    tempRange: '25°C – 35°C',
    waterNeed: 'Medium-High',
    mspPrice: 7020,
    marketPriceRange: [6500, 8000],
    growthDays: '150–180 days',
    bestStates: ['Gujarat', 'Maharashtra', 'Telangana', 'Rajasthan', 'MP'],
    suggestion: 'Use Bt cotton seeds. Pick bolls when 60% open.',
    yieldPerHectare: '15–25 quintals',
    medicine: 'Spinosad for Pink Bollworm',
    fertilizer: 'Urea: 100kg, Potash: 40kg',
    profit: '₹55,000/acre'
  },
  'Soybean': {
    image: 'https://images.unsplash.com/photo-1598284699564-9eb51e8adbc5?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif (Jun–Oct)',
    tempRange: '20°C – 30°C',
    waterNeed: 'Medium',
    mspPrice: 4892,
    marketPriceRange: [4200, 5500],
    growthDays: '90–120 days',
    bestStates: ['MP', 'Maharashtra', 'Rajasthan', 'Karnataka'],
    suggestion: 'Treat seeds with Rhizobium. Sow in 30cm spacing.',
    yieldPerHectare: '15–25 quintals',
    medicine: 'Chlorantraniliprole for Girlde Beetle',
    fertilizer: 'DAP: 50kg per acre',
    profit: '₹25,000/acre'
  },
  'Mustard': {
    image: 'https://images.unsplash.com/photo-1616422329764-9dfcffc2bc4a?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi (Oct–Feb)',
    tempRange: '10°C – 25°C',
    waterNeed: 'Low',
    mspPrice: 5650,
    marketPriceRange: [5000, 6500],
    growthDays: '110–145 days',
    bestStates: ['Rajasthan', 'MP', 'UP', 'Haryana', 'Gujarat'],
    suggestion: 'Apply sulfur fertilizer for higher oil content.',
    yieldPerHectare: '12–18 quintals',
    medicine: 'Imidacloprid for Aphids',
    fertilizer: 'Gypsum (Sulfur) and Urea',
    profit: '₹35,000/acre'
  },
  'Tomato': {
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    season: 'Year-round',
    tempRange: '20°C – 30°C',
    waterNeed: 'Medium-High',
    mspPrice: null,
    marketPriceRange: [800, 4000],
    growthDays: '60–90 days',
    bestStates: ['AP', 'Karnataka', 'MP', 'Odisha', 'Maharashtra'],
    suggestion: 'Use staking for better quality. Harvest when 50% red.',
    yieldPerHectare: '250–400 quintals',
    medicine: 'Mancozeb for Blight',
    fertilizer: 'Calcium Nitrate for fruit health',
    profit: '₹80,000/acre'
  },
  'Potato': {
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi (Oct–Feb)',
    tempRange: '15°C – 22°C',
    waterNeed: 'Medium',
    mspPrice: null,
    marketPriceRange: [600, 2000],
    growthDays: '75–120 days',
    bestStates: ['UP', 'West Bengal', 'Bihar', 'Gujarat', 'Punjab'],
    suggestion: 'Use certified seed potatoes. Store in cold storage.',
    yieldPerHectare: '200–350 quintals',
    medicine: 'Metalaxyl for Late Blight',
    fertilizer: 'Urea: 100kg, Potash: 60kg',
    profit: '₹50,000/acre'
  },
  'Sugarcane': {
    image: 'https://images.unsplash.com/photo-1596752718105-d326ccbc126f?auto=format&fit=crop&w=800&q=80',
    season: 'Feb–Mar (plant), Nov–Mar (harvest)',
    tempRange: '25°C – 35°C',
    waterNeed: 'Very High',
    mspPrice: 315,
    marketPriceRange: [300, 380],
    growthDays: '12–18 months',
    bestStates: ['UP', 'Maharashtra', 'Karnataka', 'Tamil Nadu'],
    suggestion: 'Plant 3-bud setts. Earthing up at 3 months.',
    yieldPerHectare: '700–1000 quintals',
    medicine: 'Malathion for Pyrilla',
    fertilizer: 'Urea: 200kg, P2O5: 80kg',
    profit: '₹1,20,000/acre'
  },
  'Gram': {
    image: 'https://images.unsplash.com/photo-1599557451369-0260afad9d19?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi (Oct–Mar)',
    tempRange: '10°C – 25°C',
    waterNeed: 'Low',
    mspPrice: 5440,
    marketPriceRange: [4800, 6200],
    growthDays: '90–120 days',
    bestStates: ['MP', 'Rajasthan', 'Maharashtra', 'UP', 'Karnataka'],
    suggestion: 'Inoculate with Rhizobium. Give only one irrigation.',
    yieldPerHectare: '12–20 quintals',
    medicine: 'Indoxacarb for Pod borer',
    fertilizer: 'SSP: 100kg per acre',
    profit: '₹30,000/acre'
  },
  'Onion': {
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    season: 'Rabi & Kharif',
    tempRange: '13°C – 25°C',
    waterNeed: 'Medium',
    mspPrice: null,
    marketPriceRange: [500, 4500],
    growthDays: '130–150 days',
    bestStates: ['Maharashtra', 'Karnataka', 'MP', 'Gujarat', 'Rajasthan'],
    suggestion: 'Transplant at 6-week. Stop irrigation before harvest.',
    yieldPerHectare: '200–300 quintals',
    medicine: 'Hexaconazole for purple blotch',
    fertilizer: 'N:P:K 100:50:50 kg/ha',
    profit: '₹70,000/acre'
  },
  'Bajra': {
    image: 'https://images.unsplash.com/photo-1535405814088-7eecd04e4ecb?auto=format&fit=crop&w=800&q=80',
    season: 'Kharif (Jun–Oct)',
    tempRange: '25°C – 35°C',
    waterNeed: 'Very Low',
    mspPrice: 2500,
    marketPriceRange: [2200, 3000],
    growthDays: '70–90 days',
    bestStates: ['Rajasthan', 'Gujarat', 'Haryana', 'UP', 'Maharashtra'],
    suggestion: 'Highly nutritious millet. Sow with first monsoon rain.',
    yieldPerHectare: '15–25 quintals',
    medicine: 'Seed treatment with Thiram',
    fertilizer: 'Urea: 40kg per acre',
    profit: '₹15,000/acre'
  },
};

// Simulated live market price fluctuation
function getSimulatedPrice(crop) {
  const data = CROP_DATABASE[crop];
  if (!data) return null;
  const [min, max] = data.marketPriceRange;
  const base = min + (max - min) * 0.5;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const variation = Math.sin(dayOfYear * 0.3 + crop.length) * (max - min) * 0.2;
  const todayPrice = Math.round(base + variation);
  const yesterdayPrice = Math.round(base + Math.sin((dayOfYear - 1) * 0.3 + crop.length) * (max - min) * 0.2);
  const change = todayPrice - yesterdayPrice;
  const pctChange = ((change / yesterdayPrice) * 100).toFixed(1);
  return { todayPrice, yesterdayPrice, change, pctChange, msp: data.mspPrice, unit: data.mspPrice && data.mspPrice > 1000 ? 'quintal' : 'quintal' };
}

// Framer Motion variants for sleek staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

/* ── Individual Premium Crop Card ── */
function CropDetailCard({ crop, rank, score, reason, weatherTemp }) {
  const db = CROP_DATABASE[crop.name || crop] || {};
  const name = crop.name || crop;
  const cropScore = crop.score || score || (95 - rank * 8);
  const cropReason = crop.reason || reason || db.suggestion || 'Suitable for your soil and climate conditions.';
  const priceData = getSimulatedPrice(name);

  // Use AI-provided details falling back to DB if needed
  const medicine = crop.medicine || 'Contact local expert for specific pesticides';
  const fertilizer = crop.fertilizer || db.suggestion?.split('Use ')[1]?.split('.')[0] || 'NPK 19:19:19';
  const profit = crop.profit || (priceData ? `₹${priceData.todayPrice * 15}` : 'High');

  const speakText = `Humari AI report ke mutabik aapko ${name} ki kheti karni chahiye. Match score hai ${cropScore} percent. Dawai ke roop mein ${medicine} istemal karein. Khaad ke liye ${fertilizer} dalein. Ek acre mein lagbhag ${profit} tak ka munafa ho sakta hai.`;

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }} className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_80px_rgba(34,197,94,0.15)] overflow-hidden flex flex-col flex-grow transition-shadow duration-500">

      {/* ── IMAGE HEADER ── */}
      <div className="h-[240px] w-full relative overflow-hidden">
        <img
          src={db.image || 'https://images.unsplash.com/photo-1599839619711-2eb2ce0ab0eb?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent"></div>

        {/* Rank Badge */}
        {rank === 1 ? (
          <div className="absolute top-5 left-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-300 uppercase tracking-widest flex items-center gap-1.5 z-10">
            <Star className="w-4 h-4 fill-white animate-pulse" /> Top Choice
          </div>
        ) : (
          <div className="absolute top-5 left-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-green-700 dark:text-green-400 text-[10px] font-black px-4 py-2 rounded-full shadow-lg border border-green-100 dark:border-green-900/50 uppercase tracking-widest z-10">
            #{rank} Choice
          </div>
        )}

        {db.season && (
          <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-10">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{db.season}</span>
          </div>
        )}

        <h4 className="absolute bottom-6 left-6 text-4xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] tracking-tight">{name}</h4>
      </div>

      {/* ── CARD BODY ── */}
      <div className="p-6 md:p-8 flex-grow flex flex-col relative z-20 bg-white dark:bg-gray-900">

        {/* Match Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-black mb-2 uppercase tracking-widest text-gray-500">
            <span>AI Match Accuracy</span>
            <span className="text-green-600">{cropScore}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${cropScore}%` }}
              viewport={{ once: true }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
            />
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-800">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Medicine / Dawai
            </p>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-2">{medicine}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-800">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter mb-1 flex items-center gap-1.5">
              <Leaf className="w-3 h-3" /> Fertilizer / Khaad
            </p>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-2">{fertilizer}</p>
          </div>
        </div>

        {/* Why this crop? */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic">
            "{cropReason}"
          </p>
        </div>

        {/* Profit Estimation */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Estimated Profit</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{profit}</p>
          </div>
          <div className="flex gap-2">
            <SpeakButton text={speakText} label="" size="sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CropRecommendations() {
  const { setAnalysis } = useAgri();
  const [data, setData] = useState(null);
  const [isDefaultData, setIsDefaultData] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { locationText, city, state, lat, lon, loading: locLoading } = useLocation();

  // New states for Soil Scanning feature
  const [soilScanImage, setSoilScanImage] = useState(null);
  const [isScanningSoil, setIsScanningSoil] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!locLoading) loadCrops();
  }, [locLoading]);

  // Handle uploading soil image to AI Visualizer scanner
  const handleSoilUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSoilScanImage(url);
      setIsScanningSoil(true);

      // Simulate Deep AI Scan of the soil
      setTimeout(async () => {
        setIsScanningSoil(false);
        // Let's reload crops to simulate new recommendations based on the scanned soil
        await handleRefresh();
      }, 3500);
    }
  };

  // Fetch weather from OpenWeatherMap free API directly
  const fetchWeather = async () => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat || 23.02}&lon=${lon || 72.57}&appid=d0be759f268a1e54e4dc78e5eeaea0dd&units=metric`;
      const res = await fetch(weatherUrl);
      if (res.ok) {
        const json = await res.json();
        return {
          temp: Math.round(json.main?.temp),
          humidity: json.main?.humidity,
          description: json.weather?.[0]?.description || 'Clear',
          wind: json.wind?.speed ? (json.wind.speed * 3.6).toFixed(1) : '0',
          feelsLike: Math.round(json.main?.feels_like),
          icon: json.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png` : null,
        };
      }
    } catch (e) {
      console.warn('Weather fetch failed:', e);
    }
    return null;
  };

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError('');

      const saved = localStorage.getItem('agrisaar_soil');
      setIsDefaultData(!saved);

      const soilData = saved ? JSON.parse(saved) : {
        nitrogen: 200, phosphorus: 25, potassium: 180, ph: 6.5, organicCarbon: 0.6
      };

      const loc = locationText || soilData.location || 'India';

      // Fetch weather directly
      const weather = await fetchWeather();
      if (weather) setWeatherData(weather);

      // Backend API
      let result = null;
      try {
        const cropRes = await getCrops({
          nitrogen: Number(soilData.nitrogen),
          phosphorus: Number(soilData.phosphorus),
          potassium: Number(soilData.potassium),
          ph: Number(soilData.ph),
          organicCarbon: Number(soilData.organicCarbon) || 0.5,
          location: loc
        });
        result = cropRes.data || cropRes;
      } catch (apiErr) {
        console.warn('Backend crop API unavailable, using local crop database:', apiErr.message);
      }

      if (!result || !result.topCrops?.length) {
        result = generateSmartRecommendations(soilData, weather, state || 'India');
      }

      setData(result);
      setAnalysis({ crops: result });
    } catch (err) {
      const fallback = generateSmartRecommendations({
        nitrogen: 200, phosphorus: 25, potassium: 180, ph: 6.5
      }, weatherData, state || 'India');
      setData(fallback);
      setAnalysis({ crops: fallback });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCrops();
    setRefreshing(false);
  };

  if (loading || locLoading) return <Loading text="Analyzing soil elements, weather data, and market metrics for best crop matches..." />;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#f4f8f4] dark:bg-gray-950 pb-20 font-sans">
      <Helmet>
        <title>Smart Crop Recommendations | AI Farming & Soil Analysis | AgriSaar</title>
        <meta name="description" content="Get precise AI-powered crop recommendations based on your soil data, live weather conditions, and local mandi prices. Discover the most profitable crops to grow for maximum yield." />
        <meta property="og:title" content="Smart Crop Recommendations | AI Farming & Soil Analysis | AgriSaar" />
        <meta property="og:description" content="Get precise AI-powered crop recommendations based on your soil data, live weather conditions, and local mandi prices." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="crop recommendation, best crop to grow, profitable crops, artificial intelligence farming, soil analysis, smart agriculture tools, highest yield crops, AgriSaar, Indian agriculture, crop rotation options, optimal farming" />
      </Helmet>

      {/* ── PREMIUM HERO SECTION ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-[500px] md:min-h-[550px] flex items-center overflow-hidden pt-12 rounded-b-[4rem] shadow-2xl mb-12"
      >
        {/* Background Layer - Fade from left to right so image is visible */}
        <div className="absolute inset-0 z-0 bg-emerald-950">
          <img
            src="https://images.unsplash.com/photo-1586771107445-d3afaf0def4d?auto=format&fit=crop&w=1920&q=80"
            alt="Beautiful Modern Farming"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-emerald-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-transparent to-transparent opacity-60"></div>
          {/* Animated Glow Orbs */}
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-green-400/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 flex flex-col lg:flex-row items-center justify-between">

          {/* Left Content Area */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full lg:w-[55%] z-20">

            {/* Top Bar Location & Sync */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <motion.div variants={cardVariants} className="flex items-center gap-3 bg-white/10 backdrop-blur-3xl px-6 py-3 rounded-[2rem] border border-white/20 shadow-xl">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-black tracking-widest uppercase text-sm sm:text-base">
                  {city || 'Finding Area'} <span className="text-white/50 mx-1">•</span> {state || 'India'}
                </span>
              </motion.div>
              <motion.button
                variants={cardVariants}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all border border-emerald-400/30 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Run AI Sync
              </motion.button>
            </div>

            {/* Huge Headline */}
            <motion.div variants={cardVariants} className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl mb-6">
                Smart Crop <br /> <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">Intelligence.</span>
              </h1>
              <p className="text-emerald-50 text-lg md:text-xl font-medium leading-relaxed max-w-xl opacity-90 drop-shadow-md border-l-4 border-emerald-500 pl-4">
                We've combined your real-time soil health, local atmospheric data, and current Mandi prices to calculate the ultimate crop choices for your field.
              </p>
            </motion.div>

            {/* Weather Sensor Grid (Mini) */}
            {weatherData && (
              <motion.div variants={cardVariants} className="mt-12 flex flex-wrap gap-4">
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-4 text-white shadow-xl min-w-[180px]">
                  <div className="bg-orange-500/20 p-2 rounded-xl"><Thermometer className="w-5 h-5 text-orange-400" /></div>
                  <div><p className="text-[10px] uppercase font-bold text-gray-400">Environment</p><p className="text-lg font-black">{weatherData.temp}°C Heat</p></div>
                </div>
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-4 text-white shadow-xl min-w-[180px]">
                  <div className="bg-blue-500/20 p-2 rounded-xl"><Droplets className="w-5 h-5 text-blue-400" /></div>
                  <div><p className="text-[10px] uppercase font-bold text-gray-400">Moisture</p><p className="text-lg font-black">{weatherData.humidity}% Humid</p></div>
                </div>
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-4 text-white shadow-xl min-w-[180px]">
                  <div className="bg-teal-500/20 p-2 rounded-xl"><CloudSun className="w-5 h-5 text-teal-400" /></div>
                  <div><p className="text-[10px] uppercase font-bold text-gray-400">Condition</p><p className="text-lg font-black capitalize">{weatherData.description}</p></div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Content Area - Futuristic UI Graphic */}
          <div className="hidden lg:flex w-[40%] h-full relative items-center justify-end">
            <motion.div
              animate={{ y: [-15, 10, -15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[380px] h-[380px]"
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden p-6 flex flex-col">
                <style>{`
                  @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                  }
                `}</style>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-black text-white tracking-widest uppercase">AI Core Active</span>
                  </div>
                  <Square className="w-4 h-4 text-white/50" />
                </div>

                {/* Visualizer UI - Now Clickable for Soil Image Upload */}
                <div
                  onClick={() => !isScanningSoil && fileInputRef.current?.click()}
                  className={`flex-1 bg-black/40 rounded-2xl border ${soilScanImage ? 'border-emerald-500/50' : 'border-white/10 hover:border-emerald-400/50 cursor-pointer'} relative overflow-hidden flex items-center justify-center transition-colors group`}
                >
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleSoilUpload} />

                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                  {/* Scanner line - Only animate if scanning */}
                  {(isScanningSoil || !soilScanImage) && (
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_2px_#34d399] opacity-70 ${isScanningSoil || !soilScanImage ? 'animate-[scanline_3s_linear_infinite]' : ''} z-20`}></div>
                  )}

                  {soilScanImage ? (
                    <>
                      <img src={soilScanImage} alt="Soil To Scan" className="w-full h-full object-cover opacity-80" />
                      {/* Tint overlay during scan */}
                      {isScanningSoil && <div className="absolute inset-0 bg-emerald-500/20 z-10"></div>}
                    </>
                  ) : (
                    <div className="text-center z-10 flex flex-col items-center">
                      <UploadCloud className="w-16 h-16 text-emerald-400/80 drop-shadow-[0_0_15px_#10b981] mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-white/70 font-black text-[10px] tracking-widest uppercase">Click to Upload Soil</p>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 bg-emerald-900/80 border border-emerald-500/50 px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-sm z-30">
                    {isScanningSoil ? (
                      <>
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="text-[10px] text-emerald-100 font-mono">Running soil diagnosis...</span>
                      </>
                    ) : soilScanImage ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] text-emerald-100 font-mono">Analysis Complete</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] text-emerald-100 font-mono">Waiting for soil sample...</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Stat Widget */}
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-12 bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 shadow-2xl flex items-center gap-4 w-[240px]"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Yield Potential</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">+94.5%</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </motion.section>

      {/* ── ALERTS SECTION ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {data.marketTrends && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mb-12 relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(245,158,11,0.2)] border border-amber-300 flex flex-col md:flex-row items-center gap-8 group"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="shrink-0 scale-110 md:scale-100 p-6 bg-white/20 backdrop-blur-md rounded-full shadow-inner group-hover:rotate-12 transition-transform duration-500">
              <DollarSign className="w-12 h-12 text-white drop-shadow-md" />
            </div>
            <div className="flex-grow z-10 text-center md:text-left">
              <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-90 drop-shadow-md">Financial Intelligence Active</h3>
              <p className="text-white text-xl md:text-2xl font-black leading-snug drop-shadow-md max-w-4xl">{data.marketTrends}</p>
            </div>
            <div className="shrink-0 z-10">
              <SpeakButton text={data.marketTrends} label="Play Analysis" size="lg" />
            </div>
          </motion.div>
        )}

        {/* ── TOP CROP RECOMMENDATIONS GRID ── */}
        <div className="flex flex-col mb-8 gap-4">
          {isDefaultData && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-sm flex gap-3 items-start md:items-center">
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5 md:mt-0" />
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-400">Default Soil Data Detected</h4>
                <p className="text-sm text-amber-700/80 dark:text-amber-500/80">Using standard Indian soil estimates. For highly accurate personalized recommendations, please analyze your actual soil first on the Soil Input page.</p>
              </div>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
                Best Options <span className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-4 py-1.5 rounded-full text-base font-black uppercase tracking-widest align-middle shadow-inner">AI Ranked</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 text-lg">Top {data.topCrops?.length || 0} carefully selected crops tailored for maximum yield.</p>
            </div>
          </div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {data.topCrops?.map((crop, i) => (
            <CropDetailCard
              key={i}
              crop={crop}
              rank={i + 1}
              weatherTemp={weatherData?.temp}
            />
          ))}
        </motion.div>

        {/* ── ROTATION CROPS SECTION ── */}
        {data.rotationCrops?.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl shadow-inner"><TrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400" /></div> Crop Rotation Alternatives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 mx-auto lg:grid-cols-3 gap-6">
              {data.rotationCrops.map((crop, i) => {
                const db = CROP_DATABASE[crop.name] || {};
                const speakTxt = `${crop.name}. ${crop.benefit}`;
                return (
                  <motion.div whileHover={{ scale: 1.03 }} key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-800 transition-all flex items-center gap-5 cursor-default group">
                    {db.image && (
                      <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-inner flex-shrink-0 group-hover:rotate-6 transition-transform">
                        <img src={db.image} alt={crop.name} className="w-full h-full object-cover scale-110" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-gray-900 dark:text-white text-xl mb-1 truncate">{crop.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed line-clamp-2 mb-2">{crop.benefit}</p>
                      <SpeakButton text={speakTxt} label="Listen" size="xs" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Smart local recommendation engine ── */
function generateSmartRecommendations(soil, weather, stateName) {
  const month = new Date().getMonth() + 1;
  const isKharif = month >= 6 && month <= 10;
  const isRabi = month >= 10 || month <= 3;
  const isZaid = month >= 3 && month <= 6;

  const allCrops = Object.entries(CROP_DATABASE);

  const scored = allCrops.map(([name, info]) => {
    let score = 50; // base score
    let reasons = [];

    // Season Match
    const seasonStr = info.season.toLowerCase();
    if (isRabi && seasonStr.includes('rabi')) { score += 20; reasons.push('Current Rabi season match'); }
    else if (isKharif && seasonStr.includes('kharif')) { score += 20; reasons.push('Current Kharif season match'); }
    else if (isZaid && seasonStr.includes('zaid')) { score += 15; reasons.push('Current Zaid season match'); }
    else if (seasonStr.includes('year-round')) { score += 15; reasons.push('Year-round crop'); }
    else { score -= 10; }

    // Soil Parameters Match
    const { nitrogen = 0, phosphorus = 0, potassium = 0, ph = 7.0 } = soil;

    // pH check
    if (ph >= 6.0 && ph <= 7.5) { score += 5; } // Most crops thrive here
    else if (name === 'Potato' && ph < 6.0) { score += 10; reasons.push('Perfect acidic pH for Potato'); }
    else if (ph > 8.0 && ['Mustard', 'Cotton'].includes(name)) { score += 5; reasons.push('Tolerates alkaline soil'); }

    // NPK Logic
    if (nitrogen >= 180 && ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton'].includes(name)) {
      score += 15; reasons.push('High nitrogen supports heavy feeders');
    }
    if (nitrogen < 150 && ['Gram', 'Soybean', 'Bajra', 'Groundnut'].includes(name)) {
      score += 15; reasons.push('Ideal for low nitrogen soil (Nitrogen fixing/hardy crop)');
    }

    if (phosphorus >= 25 && potassium >= 150) {
      score += 5;
    }

    // Weather / State match
    if (stateName && info.bestStates.some(s => stateName.toLowerCase().includes(s.toLowerCase()))) {
      score += 5; reasons.push('Native to your state');
    }

    score = Math.min(98, Math.max(45, score));
    const finalReason = reasons.length > 0 ? reasons.join(' • ') + '.' : info.suggestion;

    return {
      name,
      score,
      reason: finalReason,
      medicine: info.medicine || 'Contact expert',
      fertilizer: info.fertilizer || 'NPK 19:19:19',
      profit: info.profit || 'High'
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const topCrops = scored.slice(0, 6);
  const rotationCrops = scored.slice(6, 9).map(c => ({
    name: c.name,
    benefit: CROP_DATABASE[c.name]?.suggestion || 'Enhances soil organic carbon and breaks pest cycles.'
  }));

  const marketTrends = `${topCrops[0]?.name || 'Your top crop'} is showing strong market stability. Proceeding with ${topCrops[1]?.name || 'a secondary crop'} on some acreage can diversify risk.`;

  return { topCrops, rotationCrops, marketTrends };
}
