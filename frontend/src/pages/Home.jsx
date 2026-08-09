import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Sprout, FlaskConical, Wheat, CloudSun, BarChart3, Landmark,
  CalendarDays, ArrowRight, Sparkles, Tractor, MapPin, Zap,
  Star, TrendingUp, ShieldCheck, Leaf, HeartHandshake, Droplet, Trees, Store, LifeBuoy
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useLocation from '../hooks/useLocation';
import HeroCarousel from '../components/HeroCarousel';
import MarketTicker from '../components/MarketTicker';
import toast from 'react-hot-toast';

const features = [
  { icon: <FlaskConical className="w-7 h-7" />, title: 'Soil Analysis', desc: 'Complete soil report — N, P, K, pH score', path: '/soil-input', color: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50' },
  { icon: <Wheat className="w-7 h-7" />, title: 'Crop Recommendation', desc: 'AI will suggest the best crop', path: '/crops', color: 'from-green-500 to-emerald-600', bg: 'from-green-50 to-emerald-50' },
  { icon: <LifeBuoy className="w-7 h-7" />, title: 'Loss Recovery', desc: 'Crop damage? Get an emergency AI solution', path: '/recovery', color: 'from-red-500 to-rose-600', bg: 'from-red-50 to-rose-50' },
  { icon: <Sprout className="w-7 h-7" />, title: 'Fertilizer Plan', desc: 'What, when, and how much fertilizer to use', path: '/fertilizer', color: 'from-lime-500 to-green-600', bg: 'from-lime-50 to-green-50' },
  { icon: <Droplet className="w-7 h-7" />, title: 'Bio-Fertilizers', desc: 'Organic farming and low-cost fertilizers', path: '/bio-inputs', color: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50' },
  { icon: <Trees className="w-7 h-7" />, title: 'Agroforestry', desc: 'Plant trees for long-term high profits', path: '/agroforestry', color: 'from-green-600 to-green-800', bg: 'from-green-50/50 to-green-100' },
  { icon: <Store className="w-7 h-7" />, title: 'Direct Market', desc: 'Remove middlemen, sell straight to buyers', path: '/b2b', color: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50' },
  { icon: <CloudSun className="w-7 h-7" />, title: 'Weather Advisory', desc: 'Farming advice based on local weather', path: '/weather', color: 'from-sky-500 to-blue-600', bg: 'from-sky-50 to-blue-50' },
  { icon: <BarChart3 className="w-7 h-7" />, title: 'Market Insights', desc: 'Market price prediction and selling advice', path: '/market', color: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50' },
  { icon: <Landmark className="w-7 h-7" />, title: 'Govt Schemes', desc: 'Government schemes and how to apply', path: '/schemes', color: 'from-pink-500 to-rose-600', bg: 'from-pink-50 to-rose-50' },
  { icon: <CalendarDays className="w-7 h-7" />, title: 'Farming Calendar', desc: 'Complete scheduling — from sowing to harvest', path: '/calendar', color: 'from-teal-500 to-cyan-600', bg: 'from-teal-50 to-cyan-50' },
];

const stats = [
  { value: '11+', label: 'AI Modules', icon: <Sparkles className="w-5 h-5" /> },
  { value: '50+', label: 'Crops Supported', icon: <Leaf className="w-5 h-5" /> },
  { value: '10+', label: 'Govt Schemes', icon: <ShieldCheck className="w-5 h-5" /> },
  { value: '24/7', label: 'AI Available', icon: <TrendingUp className="w-5 h-5" /> },
];


const allCrops = [
  {
    name: 'Wheat', season: 'Rabi', profit: '2,275',
    img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
    badge: '🌾 Most Popular', score: 92, tip: 'Best in loamy soil, pH 6–7.5', accent: '#16a34a'
  },
  {
    name: 'Rice', season: 'Kharif', profit: '3,100',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    badge: '🌿 High Demand', score: 88, tip: 'Requires good irrigation & warm climate', accent: '#0d9488'
  },
  {
    name: 'Mustard', season: 'Rabi', profit: '5,650',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    badge: '🟡 High Profit', score: 85, tip: 'Low water need, cold climate ideal', accent: '#ca8a04'
  },
  {
    name: 'Tomato', season: 'Zaid', profit: '3,900',
    img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
    badge: '🍅 Fast Return', score: 80, tip: 'Short cycle, high market demand', accent: '#dc2626'
  },
  {
    name: 'Cotton', season: 'Kharif', profit: '6,200',
    img: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&q=80',
    badge: '🌱 Export Ready', score: 78, tip: 'Black soil best, dry weather ideal', accent: '#7c3aed'
  },
  {
    name: 'Potato', season: 'Rabi', profit: '1,450',
    img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',
    badge: '🥔 Safe Crop', score: 76, tip: 'Cold weather, sandy loam soil best', accent: '#92400e'
  },
  {
    name: 'Maize', season: 'Kharif', profit: '1,985',
    img: 'https://images.unsplash.com/photo-1559589688-6ba6beafe1e3?w=600&q=80',
    badge: '🌽 Versatile', score: 74, tip: 'Poultry feed demand rising fast', accent: '#d97706'
  },
  {
    name: 'Soybean', season: 'Kharif', profit: '4,200',
    img: 'https://images.unsplash.com/photo-1527383418406-f85a3b146f64?w=600&q=80',
    badge: '🫘 Oil Crop', score: 72, tip: 'Improves soil nitrogen naturally', accent: '#65a30d'
  },
  {
    name: 'Sugarcane', season: 'Year-round', profit: '3,500',
    img: 'https://images.unsplash.com/photo-1596591868231-05e808fd7794?w=600&q=80',
    badge: '🍬 Long Term', score: 71, tip: 'Needs heavy irrigation, loamy soil', accent: '#0891b2'
  },
  {
    name: 'Gram', season: 'Rabi', profit: '5,100',
    img: 'https://images.unsplash.com/photo-1585325701956-60dd9c8399f3?w=600&q=80',
    badge: '🫛 Protein Rich', score: 70, tip: 'Drought tolerant, good for dry areas', accent: '#b45309'
  },
  {
    name: 'Onion', season: 'Rabi', profit: '2,800',
    img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
    badge: '🧅 Steady Price', score: 69, tip: 'Well-drained sandy soil best', accent: '#be185d'
  },
  {
    name: 'Groundnut', season: 'Kharif', profit: '5,850',
    img: 'https://images.unsplash.com/photo-1567892737950-30c4db39a622?w=600&q=80',
    badge: '🥜 Export Value', score: 67, tip: 'Sandy loam, well-drained soil is key', accent: '#c2410c'
  },
];


const cropTabs = ['All', 'Rabi', 'Kharif', 'Zaid'];

const farmingStyles = [
  { title: 'Organic Farming', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', desc: 'Farming in harmony with nature, no chemicals', tag: '🌿 Natural', link: '/soil-input' },
  { title: 'Precision Agriculture', img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80', desc: 'Smart land management using drones and AI', tag: '🤖 Tech-Driven', link: '/crops' },
  { title: 'Water-Efficient Farming', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80', desc: 'Save 40% water using drip irrigation', tag: '💧 Eco-Friendly', link: '/fertilizer' },
  { title: 'Greenhouse Farming', img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80', desc: 'High-value crops in a controlled environment', tag: '🏡 Protected', link: '/crops' },
];

const seasons = [
  { name: 'Rabi', months: 'Oct – Mar', icon: '❄️', color: 'from-blue-500 to-sky-600', crops: ['Wheat', 'Mustard', 'Gram', 'Potato', 'Onion'], tip: 'Sow early during the start of the season' },
  { name: 'Kharif', months: 'Jun – Oct', icon: '☀️', color: 'from-amber-500 to-orange-500', crops: ['Rice', 'Maize', 'Cotton', 'Soybean', 'Groundnut'], tip: 'Start sowing with the monsoon rains' },
  { name: 'Zaid', months: 'Mar – Jun', icon: '🌸', color: 'from-pink-500 to-rose-500', crops: ['Tomato', 'Cucumber', 'Watermelon', 'Muskmelon'], tip: 'Short cycle, high return' },
];

const smartTips = [
  { icon: '💧', title: 'Drip Irrigation', desc: 'Install a drip system to save 40% water. This also increases crop yield.', color: 'from-blue-50 to-sky-100', border: 'border-blue-200' },
  { icon: '🌿', title: 'Organic Matter', desc: 'Increase soil fertility naturally with compost and organic matter.', color: 'from-green-50 to-emerald-100', border: 'border-green-200' },
  { icon: '☁️', title: 'Weather Alerts', desc: 'Get alerts before weather changes — protect your crops from damage.', color: 'from-purple-50 to-violet-100', border: 'border-purple-200' },
  { icon: '🧪', title: 'Soil Testing', desc: 'Test your soil every 2-3 years to create the right fertilizer plan.', color: 'from-amber-50 to-yellow-100', border: 'border-amber-200' },
  { icon: '💰', title: 'PM Kisan Yojana', desc: '₹6,000/year directly in your account — apply online today.', color: 'from-rose-50 to-pink-100', border: 'border-rose-200' },
  { icon: '📊', title: 'Market Timing', desc: 'Sell crops during high demand using AI price predictions.', color: 'from-teal-50 to-cyan-100', border: 'border-teal-200' },
];

const testimonials = [
  { name: 'Ramesh Patel', loc: 'Madhya Pradesh', text: 'AgriSaar increased my soybean yield by 35%. The AI tips were spot on!', crop: '🫘 Soybean Farmer' },
  { name: 'Sunita Devi', loc: 'Punjab', text: 'I was always confused about which fertilizer to use for wheat. The app made it simple.', crop: '🌾 Wheat Farmer' },
  { name: 'Ajay Kumar', loc: 'Maharashtra', text: 'My PM Kisan money was delayed. With the app\'s help, I found the right scheme and got the money in 2 weeks!', crop: '🌱 Multi-Crop Farmer' },
];

const rotatingTips = [
  { icon: '💧', tip: 'Save 40% water using Drip irrigation' },
  { icon: '🌿', tip: 'Improve soil quality with organic fertilizers' },
  { icon: '📱', tip: 'Check the app daily for weather alerts' },
  { icon: '🧪', tip: 'Always test your soil every 3 years' },
  { icon: '💰', tip: 'Apply for PM Kisan Yojana today' },
];

const mandiRates = [
  { crop: '🌾 Wheat', rate: '₹2,275', change: '+2.1%', up: true },
  { crop: '🌿 Rice', rate: '₹3,100', change: '+1.4%', up: true },
  { crop: '🟡 Mustard', rate: '₹5,650', change: '-0.8%', up: false },
  { crop: '🫘 Soybean', rate: '₹4,200', change: '+3.2%', up: true },
  { crop: '🌽 Maize', rate: '₹1,985', change: '+0.5%', up: true },
  { crop: '🧅 Onion', rate: '₹2,800', change: '-1.2%', up: false },
];

export default function Home() {
  const { city, state, loading: locLoading } = useLocation();
  const [activeTip, setActiveTip] = useState(0);
  const [activeTab, setActiveTab] = useState('All');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActiveTip(p => (p + 1) % rotatingTips.length), 3500);

    // Smart Alert (Mock Weather Notification)
    const alertTimeout = setTimeout(() => {
      toast(
        (t) => (
          <div className="flex gap-3 items-start">
            <span className="text-3xl mt-1">⛈️</span>
            <div>
              <p className="font-black text-gray-900 text-base">Weather Alert</p>
              <p className="text-sm text-gray-700 font-semibold mt-0.5">Bhaari baarish ke asaar hain agle 24 ghante mein. Fasal cover karein.</p>
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="self-start text-xs text-blue-600 font-black ml-2 py-1 px-2 hover:bg-blue-50 rounded-lg">Dismiss</button>
          </div>
        ),
        { 
          duration: 8000, 
          position: 'top-right', 
          style: { 
            borderRadius: '16px', 
            padding: '16px',
            background: '#ffffff', // Explicitly set background to white
            color: '#1f2937',     // Ensure default text color is dark
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #fee2e2' // Light red border for alert feel
          } 
        }
      );
    }, 4000);

    return () => {
      clearInterval(t);
      clearTimeout(alertTimeout);
    };
  }, []);

  const filteredCrops = allCrops.filter(c => activeTab === 'All' || c.season === activeTab);
  const visibleCrops = showAll ? filteredCrops : filteredCrops.slice(0, 6);

  return (
    <div className="overflow-hidden bg-[#f4f7f4] dark:bg-gray-950 transition-colors duration-500">
      <Helmet>
        <title>AgriSaar — AI-Powered Smart Farming Platform for Indian Kisaan</title>
        <meta name="description" content="AgriSaar is India's #1 AI farming platform — get smart crop recommendations, soil analysis, weather advisory, market prices, government schemes, fertilizer plans, and more. Boost your farm income with AI." />
        <meta property="og:title" content="AgriSaar — AI-Powered Smart Farming Platform for Indian Kisaan" />
        <meta property="og:description" content="11+ AI modules, 50+ crops supported. Soil analysis, crop intelligence, weather alerts, market predictions, govt schemes — all in one platform for Indian farmers." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="AgriSaar, smart farming, AI agriculture, Indian farming, crop recommendation, soil analysis, mandi price, government schemes, kisaan, precision agriculture" />
        <link rel="canonical" href="https://agrisaar.vercel.app/" />
      </Helmet>
      <MarketTicker />

      {/* Hero */}
      <HeroCarousel>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 w-full">
          <div className="max-w-4xl">
            <div className={`inline-flex items-center gap-3 bg-black/30 backdrop-blur-xl px-5 py-2.5 rounded-full text-white text-sm font-bold mb-8 border shadow-xl transition-all duration-700 ${locLoading ? 'border-green-400/50 animate-pulse' : 'border-white/30'}`}>
              <span className="relative flex h-3 w-3">
                {locLoading && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${locLoading ? 'bg-green-500' : 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]'}`} />
              </span>
              <MapPin className={`w-4 h-4 ${locLoading ? 'text-green-300' : 'text-green-300 animate-bounce'}`} />
              {locLoading
                ? <span className="tracking-wide text-green-100">Detecting Live Location...</span>
                : <span className="tracking-wide">Smart Farming in <span className="text-green-300 font-black">{city}, {state}</span></span>}
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white leading-[1.05] mb-6 tracking-tight drop-shadow-2xl">
              Empower Your
              <span className="block mt-2 bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 text-transparent bg-clip-text pb-2">
                Smart Farming
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed font-medium border-l-4 border-green-500 pl-6 py-2 bg-black/30 backdrop-blur-sm rounded-r-2xl">
              Based on {city}'s soil and weather — get the best crop recommendations, fertilizer plans, and government schemes all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/soil-input" className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 border border-green-400/50">
                <FlaskConical className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Free Soil Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/crops" className="group bg-white/15 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-white/25 transition-all duration-300 hover:-translate-y-1 flex items-center gap-3">
                <Wheat className="w-6 h-6" /> View Crops
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 max-w-lg">
              <span className="text-2xl">{rotatingTips[activeTip].icon}</span>
              <p className="text-sm text-white/90 font-medium">{rotatingTips[activeTip].tip}</p>
            </div>
          </div>
        </div>
      </HeroCarousel>

      {/* Stats Float */}
      <section className="py-4 bg-[#f4f7f4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 -mt-20 relative z-20">
            {stats.map((s, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 backdrop-blur-xl border border-green-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300 group">
                <div className="flex justify-center mb-2 text-green-600 dark:text-green-400 group-hover:scale-125 transition-transform">{s.icon}</div>
                <div className="text-4xl font-black bg-gradient-to-r from-green-800 to-emerald-600 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-bold uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-10 bg-[#f4f7f4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-extrabold text-gray-700 dark:text-gray-200 mb-6">⚡ Quick Actions — Seedha Shuru Karo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

            {[
              { icon: '🧪', label: 'Check Soil', sub: 'Soil Test', path: '/soil-input', color: 'bg-[#fff7ed]', border: 'border-orange-200', text: 'text-orange-900' },
              { icon: '🌾', label: 'Select Crop', sub: 'Best Fasal', path: '/crops', color: 'bg-[#f0fdf4]', border: 'border-green-200', text: 'text-green-900' },
              { icon: '💊', label: 'Damage Aid', sub: 'Recovery', path: '/recovery', color: 'bg-[#fff1f2]', border: 'border-rose-200', text: 'text-rose-900' },
              { icon: '🌲', label: 'Agroforestry', sub: 'Profit Trees', path: '/agroforestry', color: 'bg-[#ecfdf5]', border: 'border-emerald-200', text: 'text-emerald-900' },
              { icon: '🤝', label: 'Direct Sell', sub: 'B2B markets', path: '/b2b', color: 'bg-[#eff6ff]', border: 'border-blue-200', text: 'text-blue-900' },
              { icon: '💰', label: 'Price List', sub: 'Market Rates', path: '/market', color: 'bg-[#faf5ff]', border: 'border-purple-200', text: 'text-purple-900' },
            ].map((a, i) => (
              <Link key={i} to={a.path} className="group flex flex-col items-center text-center gap-3 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-green-200 transition-all hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {a.icon}
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-sm">{a.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{a.sub}</p>

                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Crop Showcase with Tabs */}
      <section className="py-16 bg-[#f4f7f4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">AI Recommended</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">🌾 Is Season Ki Best Fasalein</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium mb-8">Real-time mandi data aur soil analysis ke based par top profitable crops</p>
            <div className="inline-flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-1 gap-1 shadow-sm">

              {cropTabs.map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setShowAll(false); }}
                  className={`px-5 py-2 rounded-xl text-sm font-black transition-all duration-200 ${activeTab === tab ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-gray-800'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCrops.map((crop, i) => (
              <Link to="/crops" key={i} className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:border-green-200 transition-all duration-300 hover:-translate-y-2 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img src={crop.img} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 text-[10px] font-black px-2.5 py-1 rounded-full shadow uppercase tracking-wide">{crop.season}</span>
                  <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow" style={{ background: crop.accent + '33', color: crop.accent, border: `1px solid ${crop.accent}55` }}>{crop.badge}</span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-black text-lg drop-shadow leading-tight">{crop.name}</h3>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-white/70 text-xs font-semibold">Mandi Rate</span>
                      <span className="text-white text-sm font-black bg-green-600/80 px-2.5 py-0.5 rounded-full shadow">{'₹' + crop.profit + '/q'}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-bold mb-1.5 text-gray-500 dark:text-gray-400">
                      <span>AI Suitability Score</span>
                      <span style={{ color: crop.accent }}>{crop.score}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${crop.score}%`, background: `linear-gradient(to right, ${crop.accent}88, ${crop.accent})` }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-auto flex items-start gap-1.5 leading-relaxed">
                    <span className="mt-0.5">💡</span>{crop.tip}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-extrabold text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    Detail dekho <ArrowRight className="w-3 h-3" />

                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filteredCrops.length > 6 && (
            <div className="text-center mt-10">
              <button onClick={() => setShowAll(p => !p)}
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border-2 border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 font-black px-8 py-3 rounded-2xl hover:bg-green-50 dark:hover:bg-gray-800 transition-all hover:shadow-lg">
                {showAll ? 'Kam Dikhaao ▲' : `Aur ${filteredCrops.length - 6} Fasalein Dekho ▼`}

              </button>
            </div>
          )}
        </div>
      </section>

      {/* Mandi Rates Table */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Live Data</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">📈 Aaj Ki Mandi Rates</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time market prices — AI se analyzed</p>

          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gradient-to-r from-green-800 to-emerald-700 px-6 py-4 text-white text-sm font-black uppercase tracking-widest">
              <span>Crop</span><span className="text-center">Rate (per quintal)</span><span className="text-right">Change</span>
            </div>
            {mandiRates.map((r, i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-4 items-center border-b border-gray-50 dark:border-gray-800 hover:bg-green-50/50 dark:hover:bg-gray-800 transition-colors ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                <span className="font-bold text-gray-900 dark:text-white">{r.crop}</span>
                <span className="text-center font-black text-gray-900 dark:text-white text-lg">{r.rate}</span>
                <span className={`text-right font-black text-sm ${r.up ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{r.up ? '▲' : '▼'} {r.change}</span>
              </div>
            ))}
            <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 flex justify-between items-center">
              <span className="text-xs text-green-700 dark:text-green-400 font-bold">Data updated automatically</span>
              <Link to="/market" className="text-sm font-extrabold text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 flex items-center gap-1">Poori list dekho <ArrowRight className="w-4 h-4" /></Link>

            </div>
          </div>
        </div>
      </section>

      {/* Farming Styles */}
      <section className="py-16 bg-[#f4f7f4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Farming Types</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">🚜 Apna Farming Style Chunein</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">Har kisan ke liye alag approach — AI se guided</p>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmingStyles.map((fs, i) => (
              <Link to={fs.link} key={i} className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 h-72 flex flex-col justify-end">
                <img src={fs.img} alt={fs.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="relative z-10 p-5">
                  <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">{fs.tag}</span>
                  <h3 className="text-white font-black text-lg leading-tight mb-1">{fs.title}</h3>
                  <p className="text-white/70 text-xs font-medium">{fs.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Calendar */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Seasonal Guide</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">📅 Season Ke Hisaab Se Fasalein</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">Sahi season mein sahi fasal — AI guaranteed</p>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seasons.map((s, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-green-200 transition-all hover:-translate-y-1 group">
                <div className={`bg-gradient-to-r ${s.color} p-6 text-white relative overflow-hidden`}>
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <h3 className="text-2xl font-black">{s.name}</h3>
                  <p className="text-white/80 text-sm font-semibold mt-1">{s.months}</p>
                  <div className="absolute -right-4 -bottom-4 text-[80px] opacity-10">{s.icon}</div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-3">Top Crops</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {s.crops.map(c => (
                      <span key={c} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300 transition-colors">{c}</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />{s.tip}
                  </p>
                  <Link to="/calendar" className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Calendar Dekho <ArrowRight className="w-4 h-4" />

                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Tips */}
      <section className="py-16 bg-[#f4f7f4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Pro Tips</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">⚡ Smart Farming Tips</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Ye tips apnao, yield aur income dono badhao</p>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {smartTips.map((tip, i) => (
              <div key={i} className={`bg-gradient-to-br ${tip.color} border ${tip.border} dark:border-gray-800 rounded-3xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 group`}>
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2 group-hover:text-green-800 transition-colors">{tip.title}</h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">All AI Tools</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-3 mb-3">
              <Tractor className="w-8 h-8 text-green-600" /> Hamari Subidhayein
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium text-lg">{city} mein farming ke liye AI-powered tools</p>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={i} to={f.path} className={`relative bg-gradient-to-br ${f.bg} dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-green-300 hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1 overflow-hidden`}>
                <div className={`w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2 group-hover:text-green-800 transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow font-medium">{f.desc}</p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-extrabold text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-300">
                  Abhi Kholein <ArrowRight className="w-4 h-4" />

                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#f4f7f4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">⚡ Kaise Kaam Karta Hai?</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">3 simple steps mein poora farming guide</p>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🧪', title: 'Enter Soil Data', desc: 'Enter N, P, K, pH and your location — it only takes 2 mins' },
              { step: '02', icon: '🤖', title: 'AI Analyzes Data', desc: 'Gemini AI analyzes your soil, local weather, and market trends' },
              { step: '03', icon: '📋', title: 'Get Plan & Report', desc: 'Crops, fertilizers, weather, and market data all in one report' },
            ].map((item, i) => (
              <div key={i} className="relative text-center p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-green-200 hover:shadow-xl transition-all group">
                <div className="text-6xl mb-5">{item.icon}</div>
                <div className="absolute top-4 right-4 text-5xl font-black text-green-100 dark:text-green-900 group-hover:text-green-200 transition-colors select-none">{item.step}</div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">❤️ Kisan Kya Kehte Hain</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Humare users ki asli kahaniyaan</p>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#f4f7f4] dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-green-200 transition-all hover:-translate-y-1">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-5 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t.crop} · {t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#f4f7f4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-900 via-emerald-800 to-[#0a2e0d] rounded-[3rem] p-10 md:p-20 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <Tractor className="w-[500px] h-[500px] text-white" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Test Your Soil, <br />Boost Your Yield <Sparkles className="inline w-8 h-8 text-yellow-400 mb-2" />
              </h2>
              <p className="text-green-100/90 mb-10 text-lg font-medium">
                Just enter your basic soil data and our AI will generate a complete farming plan. Completely free.
              </p>
              <Link to="/soil-input" className="inline-flex items-center gap-3 bg-white text-green-950 px-10 py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-gray-50 transition-all active:scale-95 hover:-translate-y-1">
                <FlaskConical className="w-6 h-6" /> Start Soil Analysis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1a0c] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <span className="font-black text-2xl tracking-tight">AgriSaar</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">An AI-powered smart farming platform for India's modern farmers.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {features.map(f => (
                <Link key={f.title} to={f.path} className="text-sm text-gray-400 hover:text-green-400 transition-colors font-medium py-1">{f.title}</Link>
              ))}
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-gray-500 font-medium">
            © 2026 AgriSaar. Smart Farming Assistant. Made with <span className="text-green-500 animate-pulse inline-block mx-1">♥</span> for Farmers.
          </div>
        </div>
      </footer>
    </div>
  );
}
