import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { CalendarDays, MapPin, Sprout, Sun, CloudRain, Snowflake, RefreshCw, Wheat } from 'lucide-react';
import { getCalendar } from '../services/calendarApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import Error from '../components/Error';

const CROP_OPTIONS = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Soybean', 'Gram', 'Mustard', 'Bajra', 'Groundnut', 'Moong'];

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return { name: 'Kharif', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Monsoon season crops', tips: ['Prepare seeds before the monsoon starts', 'Ensure proper drainage arrangements', 'Sow Soybean/Cotton in June', 'Avoid waterlogging — use raised beds'] };
  if (month >= 11 || month <= 3) return { name: 'Rabi', icon: Snowflake, color: 'text-cyan-600', bg: 'bg-cyan-50', desc: 'Winter season crops', tips: ['Complete wheat sowing by November', 'Use light irrigation to prevent frost damage', 'Spray for aphids in mustard crops', 'Watch for pod borer in gram'] };
  return { name: 'Zaid', icon: Sun, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Summer season crops', tips: ['Sow Moong/Urad in March-April', 'Manage water usage properly', 'Use mulching to preserve soil moisture', 'Select short-duration crops'] };
}


function getLocalCalendar(crop, season) {
  const calendars = {
    'Wheat': `📅 WHEAT FARMING CALENDAR (Rabi Season)

🌱 LAND PREPARATION (October 1-15)
• Deep plough field 2-3 times
• Level the field for uniform irrigation
• Apply 10-15 tonnes FYM per hectare
• Last ploughing: Mix basal fertilizers

🌾 SOWING (October 25 - November 25)
• Use certified seeds: HD-2967, PBW-343, WH-711
• Seed rate: 100-125 kg/ha
• Row spacing: 20-23 cm
• Seed treatment: Carbendazim 2g/kg seed
• Apply DAP, MOP and Zinc at sowing

💧 IRRIGATION SCHEDULE
• 1st irrigation: 20-25 DAS (Crown Root Initiation) — CRITICAL
• 2nd irrigation: 40-45 DAS (Tillering)
• 3rd irrigation: 60-65 DAS (Late Jointing)
• 4th irrigation: 80-85 DAS (Flowering)
• 5th irrigation: 100-105 DAS (Milking)
• 6th irrigation: 115-120 DAS (Dough stage)

🧪 FERTILIZER SCHEDULE
• Basal: 60kg Urea + 125kg DAP + 50kg MOP + 25kg ZnSO4 per hectare
• 1st Top-dress (21 DAS): 40kg Urea
• 2nd Top-dress (45 DAS): 40kg Urea

🐛 PEST MANAGEMENT
• 30-35 DAS: Spray 2,4-D for broadleaf weeds
• Watch for aphids at ear emergence
• Yellow rust: Spray Propiconazole 25% EC (1ml/L)

🌾 HARVEST (March 15 - April 15)
• Harvest when grain moisture is 14-16%
• Sun-dry to 12% moisture before storage
• Expected yield: 45-55 quintals/hectare`,

    'Rice': `📅 RICE FARMING CALENDAR (Kharif Season)

🌱 NURSERY PREPARATION (May 15 - June 15)
• Prepare wet nursery bed
• Seed treatment: Carbendazim 2g/kg
• Seed rate: 30-40 kg/ha
• Keep nursery flooded with 2-3 cm water

🌾 TRANSPLANTING (June 15 - July 15)
• Transplant 25-30 day old seedlings
• 2-3 seedlings per hill
• Spacing: 20x15 cm
• Maintain 3-5 cm standing water

💧 WATER MANAGEMENT
• Continuous flooding: Transplanting to tillering
• Intermittent flooding: Tillering to flowering
• Drain field 15 days before harvest

🧪 FERTILIZER SCHEDULE
• Basal: 60kg DAP + 40kg MOP per hectare
• 1st Top-dress (15 DAT): 40kg Urea
• 2nd Top-dress (45 DAT): 40kg Urea
• 3rd Top-dress (65 DAT): 20kg Urea

🐛 PEST MANAGEMENT
• Stem borer: Carbofuran 3G granules in leaf whorl
• BPH: Imidacloprid spray when 5-10 hoppers/hill
• Blast: Tricyclazole 75% WP (0.6g/L)
• Sheath blight: Hexaconazole 5% SC (2ml/L)

🌾 HARVEST (October - November)
• Harvest when 80% grains are golden
• Thresh within 24 hours
• Expected yield: 40-60 quintals/hectare`,
  };
  
  return {
    calendar: calendars[crop] || `📅 ${crop.toUpperCase()} FARMING CALENDAR (${season} Season)

🌱 LAND PREPARATION
• Deep plough field 2-3 times, 15 days before sowing
• Level the field for uniform water distribution
• Apply 10-12 tonnes FYM per hectare during last ploughing
• Ensure proper drainage channels

🌾 SOWING
• Use certified, disease-resistant seeds from government outlets
• Follow recommended seed rate and spacing for your variety
• Treat seeds with appropriate fungicide before sowing
• Sow at optimal depth (2-5 cm depending on seed size)

💧 IRRIGATION
• First irrigation: 20-25 days after sowing (most critical)
• Schedule subsequent irrigations every 15-25 days
• Total 4-6 irrigations depending on soil type and rainfall
• Reduce irrigation 15 days before expected harvest

🧪 FERTILIZER APPLICATION
• Basal dose at sowing: Full P, K, and 1/3 N
• First top-dress: 1/3 N at 25-30 DAS
• Second top-dress: Final 1/3 N at 45-50 DAS
• Micronutrients: Apply zinc/iron if deficiency symptoms appear

🐛 PEST & DISEASE MANAGEMENT
• Scout fields weekly for pest/disease symptoms
• Use economic threshold levels (ETL) before spraying
• Prefer bio-agents (Trichoderma, Pseudomonas) when possible
• Always follow safety precautions while spraying chemicals

🌾 HARVEST & POST-HARVEST
• Harvest at correct maturity stage (check specifications for your crop)
• Dry produce to safe moisture level before storage
• Grade and sort for better market prices
• Sell at government procurement centers for MSP guarantee`
  };
}

export default function FarmingCalendar() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const { city, state, locationText, loading: locLoading } = useLocation();

  const season = getCurrentSeason();
  const SeasonIcon = season.icon;
  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    if (!locLoading) loadCalendar();
  }, [locLoading]);

  const loadCalendar = async (crop) => {
    try {
      setLoading(true);
      setError('');
      const res = await getCalendar({ crop: crop || selectedCrop, season: season.name, location: locationText || 'India' });
      const payload = res.data || res;
      if (payload?.calendar) {
        setData(payload);
      } else {
        setData(getLocalCalendar(crop || selectedCrop, season.name));
      }
    } catch (err) {
      console.warn('Calendar API failed, using local data:', err.message);
      setData(getLocalCalendar(crop || selectedCrop, season.name));
    } finally {
      setLoading(false);
    }
  };

  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
    loadCalendar(crop);
  };

  if (locLoading || loading) return <Loading text={`Building ${selectedCrop} farming calendar...`} />;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <Helmet>
        <title>Farming Calendar — Fasal Panchang & Crop Schedule | AgriSaar</title>
        <meta name="description" content="Complete farming calendar from sowing to harvest — Rabi, Kharif, Zaid season schedules with land preparation, fertilizer timing, irrigation, and harvesting guides for 10+ crops." />
        <meta property="og:title" content="Farming Calendar — Fasal Panchang | AgriSaar" />
        <meta property="og:description" content="Season-wise crop scheduling for Indian farmers. Know exactly when to sow, irrigate, spray, and harvest." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="farming calendar, fasal panchang, crop schedule, Rabi season, Kharif season, sowing time, harvest time, AgriSaar" />
      </Helmet>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1592982537447-6f23fcf93eb9?auto=format&fit=crop&w=1200&h=400&q=80" alt="Farm Calendar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/85 via-primary-800/70 to-[#f8faf8]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary-300" />
            <span className="text-primary-200 text-sm font-medium">{locationText}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 flex items-center gap-3">
            <CalendarDays className="w-9 h-9" /> Farming Calendar
          </h1>
          <p className="text-primary-200 text-lg font-medium mb-6">Complete farming schedule — sowing to harvest</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
            <div className={`${season.bg} rounded-2xl p-4 border border-white/50`}>
              <div className="flex items-center gap-2 mb-1">
                <SeasonIcon className={`w-5 h-5 ${season.color}`} />
                <span className={`text-sm font-bold ${season.color}`}>{season.name} Season</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">{season.desc}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-white font-bold text-sm">{todayStr}</p>
              <p className="text-primary-200 text-xs font-medium mt-1">Schedule based on today's date</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wheat className="w-4 h-4" /> Select a Crop — Calendar Will Update
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {CROP_OPTIONS.map(crop => (
              <button key={crop} onClick={() => handleCropChange(crop)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${selectedCrop === crop ? 'bg-primary-800 text-white shadow-lg shadow-primary-800/25' : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100'}`}>
                {crop}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-primary-600" /> {selectedCrop} — Complete Calendar
              </h2>
              <button onClick={() => loadCalendar()} className="text-sm text-primary-600 font-bold flex items-center gap-1 hover:text-primary-800">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-medium text-sm max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {typeof data.calendar === 'string' ? data.calendar : "Calendar generation failed. Please retry."}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-6 text-white">
              <h3 className="font-extrabold text-lg mb-4">Today's Action Plan</h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-primary-300 font-bold uppercase mb-1">Season</p>
                  <p className="text-sm font-medium">{season.name} — {season.desc}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-primary-300 font-bold uppercase mb-1">Selected Crop</p>
                  <p className="text-sm font-bold">{selectedCrop}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-primary-300 font-bold uppercase mb-1">Location</p>
                  <p className="text-sm font-medium">{locationText}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2"><Wheat className="w-5 h-5 text-amber-600" /> {season.name} Season Tips</h3>
              <div className="space-y-3">
                {season.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-700 mt-0.5 flex-shrink-0">{i + 1}</span>
                    <p className="text-gray-600 font-medium leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=250&fit=crop" alt="Farming activities" className="w-full h-36 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
