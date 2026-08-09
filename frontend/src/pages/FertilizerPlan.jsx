import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Sprout, CalendarClock, Beaker, Ban, Search, Leaf, ShieldCheck, AlertTriangle, Droplets, TestTube, Volume2, Filter, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import { getFertilizerPlan } from '../services/fertilizerApi';
import Loading from '../components/Loading';
import SpeakButton from '../components/SpeakButton';

/* ── Agricultural Medicine & Pesticide Database ── */
const AGRI_MEDICINES = [
  { name: 'Imidacloprid 17.8% SL', type: 'Insecticide', target: 'Aphids, Jassids, Whiteflies, Thrips', crops: 'Cotton, Rice, Wheat, Vegetables', dose: '0.5-1 ml per litre water', method: 'Foliar spray', timing: 'Apply when pest population crosses ETL. Spray in morning/evening.', safety: '14-day waiting period before harvest. Harmful to bees — avoid during flowering.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chlorpyrifos 20% EC', type: 'Insecticide', target: 'Termites, Cutworms, Stem Borers, Soil insects', crops: 'Sugarcane, Rice, Wheat, Maize', dose: '2.5 ml per litre water (foliar) or 4-5L/ha (soil)', method: 'Soil drench or foliar spray', timing: 'Apply at sowing for soil pests. Foliar spray at early pest stages.', safety: '21-day pre-harvest interval. Do not apply near water bodies.', image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Carbendazim 50% WP', type: 'Fungicide', target: 'Blast, Blight, Wilt, Powdery Mildew, Anthracnose', crops: 'Rice, Wheat, Pulses, Vegetables, Fruits', dose: '1-2 gm per litre water', method: 'Seed treatment (2g/kg seed) or foliar spray', timing: 'Seed treatment before sowing. Spray at first sign of disease.', safety: '7-day waiting period. Wear mask during application.', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80' },
  { name: 'Mancozeb 75% WP', type: 'Fungicide', target: 'Late Blight, Early Blight, Downy Mildew, Rust', crops: 'Potato, Tomato, Grapes, Wheat, Rice', dose: '2-2.5 gm per litre water', method: 'Foliar spray', timing: 'Preventive spray before disease onset. Repeat every 7-10 days.', safety: '14-day pre-harvest interval. Do not mix with alkaline substances.', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80' },
  { name: 'Glyphosate 41% SL', type: 'Herbicide', target: 'All broadleaf weeds and grasses (non-selective)', crops: 'Pre-planting for all crops, Orchards, Non-crop areas', dose: '5-10 ml per litre water', method: 'Directed spray on weeds only — avoid crop contact', timing: 'Apply 7-10 days before sowing. Use hood/shield sprayer in orchards.', safety: 'Systemic — absorbed by leaves. Do NOT spray on crop. Wait 15 days before sowing.', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80' },
  { name: '2,4-D Sodium Salt 80% WP', type: 'Herbicide', target: 'Broadleaf weeds (Bathua, Hirankhuri, Chenopodium)', crops: 'Wheat, Rice, Sugarcane, Maize', dose: '0.5-0.625 kg/ha in 500L water', method: 'Flat fan nozzle spray', timing: 'Apply 30-35 days after sowing in wheat. 20-25 days in rice.', safety: 'Do not spray near cotton, vegetables, or pulses — it kills them.', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Thiamethoxam 25% WG', type: 'Insecticide', target: 'Brown Plant Hopper, White-backed Hopper, Jassids', crops: 'Rice, Cotton, Vegetables, Sugarcane', dose: '0.2-0.3 gm per litre water', method: 'Foliar spray or seed treatment (4g/kg)', timing: 'Spray when hopper count exceeds 5-10 per hill. Seed treatment for sucking pests.', safety: '14-day waiting period. Toxic to bees — spray after 5 PM.', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Trichoderma viride (Bio-agent)', type: 'Bio-fungicide', target: 'Root rot, Damping off, Wilt, Collar rot', crops: 'All crops — especially Pulses, Cotton, Vegetables', dose: '5-10 gm per kg seed or 2.5 kg/ha soil application', method: 'Seed treatment, soil drenching, or FYM mixing', timing: 'Apply at sowing. Mix with 100kg FYM and broadcast before transplanting.', safety: 'Completely organic and safe. No waiting period. Safe for beneficial insects.', image: 'https://images.unsplash.com/photo-1598284699564-9eb51e8adbc5?auto=format&fit=crop&w=400&q=80' },
  { name: 'Neem Oil (Azadirachtin 0.03%)', type: 'Bio-pesticide', target: 'Aphids, Mealybugs, Whiteflies, Leaf miners, Caterpillars', crops: 'Vegetables, Fruits, Flowers, Cotton', dose: '3-5 ml per litre water', method: 'Foliar spray', timing: 'Spray every 7-10 days during pest season. Apply early morning or evening.', safety: 'Organic and safe. No pre-harvest interval. Safe for pollinators.', image: 'https://images.unsplash.com/photo-1616422329764-9dfcffc2bc4a?auto=format&fit=crop&w=400&q=80' },
  { name: 'Profenofos 50% EC', type: 'Insecticide', target: 'Bollworm, Spotted Bollworm, American Bollworm', crops: 'Cotton, Soybean, Vegetables', dose: '2 ml per litre water', method: 'Foliar spray with high-volume sprayer', timing: 'Spray when bollworm larvae first appear. Repeat after 10-15 days if needed.', safety: '21-day pre-harvest interval. Highly toxic — full PPE required.', image: 'https://images.unsplash.com/photo-1590483864197-0ec997a39833?auto=format&fit=crop&w=400&q=80' },
  { name: 'Copper Oxychloride 50% WP', type: 'Fungicide', target: 'Bacterial Leaf Blight, Canker, Black Rot, Anthracnose', crops: 'Rice, Citrus, Grapes, Pomegranate, Mango', dose: '2.5-3 gm per litre water', method: 'Foliar spray', timing: 'First spray at disease onset. Repeat every 10-15 days. 3-4 sprays per season.', safety: '14-day waiting period. Avoid excessive use as copper accumulates in soil.', image: 'https://images.unsplash.com/photo-1596752718105-d326ccbc126f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pseudomonas fluorescens (Bio-agent)', type: 'Bio-fungicide', target: 'Wilt, Root rot, Sheath Blight, Bacterial Leaf Blight', crops: 'Rice, Pulses, Vegetables, Cotton', dose: '10 gm per litre (foliar) or 2.5 kg per acre (soil)', method: 'Seed treatment, soil application, or foliar spray', timing: 'Apply at transplanting. Foliar spray at 30 and 60 days after sowing.', safety: 'Completely safe. Organic certified. Enhances plant growth and immunity.', image: 'https://images.unsplash.com/photo-1599839619711-2eb2ce0ab0eb?auto=format&fit=crop&w=400&q=80' },
  { name: 'DAP (Di-Ammonium Phosphate)', type: 'Fertilizer', target: 'Phosphorus deficiency — promotes root growth & flowering', crops: 'All crops — essential basal fertilizer', dose: '100-125 kg per hectare', method: 'Basal application at sowing or transplanting', timing: 'Apply at sowing time. Mix with soil. Do not top-dress.', safety: 'Do not mix with lime or urea in same application. Store in dry place.', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80' },
  { name: 'Urea (46% N)', type: 'Fertilizer', target: 'Nitrogen deficiency — promotes leaf growth & green color', crops: 'All crops', dose: '80-130 kg/ha in 2-3 split doses', method: 'Broadcasting or band placement. Best when incorporated into soil.', timing: 'Split: 1/3 at sowing, 1/3 at tillering, 1/3 at panicle initiation (rice/wheat).', safety: 'Do not apply on dry soil. Irrigate after application. Releases ammonia if left on surface.', image: 'https://images.unsplash.com/photo-1535405814088-7eecd04e4ecb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Potash (MOP — Muriate of Potash)', type: 'Fertilizer', target: 'Potassium deficiency — improves grain quality & disease resistance', crops: 'Potato, Sugarcane, Banana, Fruits, Vegetables', dose: '60-100 kg per hectare', method: 'Basal application or split — 50% basal, 50% top-dress', timing: 'Apply 50% at sowing. Rest at 30-45 days. Critical for fruit & tuber crops.', safety: 'Do not use on saline soils. Avoid chloride-sensitive crops (tobacco, grapes).', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Zinc Sulphate (ZnSO4 21%)', type: 'Micronutrient', target: 'Zinc deficiency — Khaira disease in rice, stunted growth', crops: 'Rice, Wheat, Maize, Pulses', dose: '25 kg/ha soil or 5gm/litre foliar', method: 'Soil application at sowing or 2 foliar sprays', timing: 'Soil: before transplanting. Foliar: at 20 and 40 days after sowing.', safety: 'Do not mix with phosphatic fertilizers — reduces availability.', image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=400&q=80' },
];

const MEDICINE_TYPES = ['All', 'Insecticide', 'Fungicide', 'Herbicide', 'Bio-fungicide', 'Bio-pesticide', 'Fertilizer', 'Micronutrient'];

export default function FertilizerPlan() {
  const { setAnalysis } = useAgri();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [fertilizerData, setFertilizerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const saved = localStorage.getItem('agrisaar_soil');
      const soilData = saved ? JSON.parse(saved) : {
        nitrogen: 200, phosphorus: 25, potassium: 180, ph: 6.5, organicCarbon: 0.6
      };
      try {
        const res = await getFertilizerPlan({
          nitrogen: Number(soilData.nitrogen),
          phosphorus: Number(soilData.phosphorus),
          potassium: Number(soilData.potassium),
          ph: Number(soilData.ph),
          organicCarbon: Number(soilData.organicCarbon) || 0.5,
          crop: soilData.crop || 'Wheat'
        });
        const result = res.data || res;
        setFertilizerData(result);
        setAnalysis({ fertilizer: result });
      } catch {
        setFertilizerData(getDefaultFertilizerPlan(soilData));
      }
    } catch {
      setFertilizerData(getDefaultFertilizerPlan({}));
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = AGRI_MEDICINES.filter(m => {
    const matchType = selectedType === 'All' || m.type === selectedType;
    const matchSearch = !searchTerm || 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.crops.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  if (loading) return <Loading text="Building your fertilizer & medicine guide..." />;

  return (
    <div className="min-h-screen bg-[#f8faf8] pb-12">
      <Helmet>
        <title>Fertilizer & Crop Medicine Guide — Khad Davai Yojana | AgriSaar</title>
        <meta name="description" content="Complete database of agricultural fertilizers, pesticides, fungicides, and bio-agents with exact doses, safety guidelines, and application timing for Indian crops." />
        <meta property="og:title" content="Fertilizer & Crop Medicine Guide | AgriSaar" />
        <meta property="og:description" content="Find the right fertilizer and pesticide for your crop — DAP, Urea, Neem Oil, Trichoderma, and 15+ medicines with dose, timing, and safety info." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="fertilizer plan, pesticide guide, khad, davai, crop medicine, DAP, urea, bio-fertilizer, organic farming, AgriSaar" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-8">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=400&fit=crop" alt="Farm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/85 via-emerald-800/70 to-[#f8faf8]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 flex items-center gap-3 drop-shadow-xl">
            <TestTube className="w-10 h-10 text-green-400" /> Fertilizer & Crop Medicine Guide
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-2xl">
            Complete database of agricultural chemicals, pesticides, fertilizers and bio-agents — with exact doses and safety guidelines.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fertilizer Plan Summary (if available) */}
        {fertilizerData && (
          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Sprout className="w-6 h-6 text-primary-600" /> Your Soil-Based Fertilizer Plan
            </h2>
            
            {/* Requirements */}
            {fertilizerData.requirements && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {fertilizerData.requirements.map((req, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{req.nutrient || req.name}</h4>
                    <p className="text-lg font-extrabold text-primary-700">{req.dose || req.current}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">{req.product || req.status}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Schedule */}
            {fertilizerData.schedule?.length > 0 && (
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 mb-8">
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-primary-600" /> Application Schedule
                </h3>
                <div className="space-y-4">
                  {fertilizerData.schedule.map((stage, i) => (
                    <div key={i} className="flex gap-4 items-start border-b border-gray-50 pb-4 last:border-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-black text-sm flex-shrink-0">{i + 1}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{stage.stage} — {stage.timing}</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {stage.actions?.map((act, j) => (
                            <span key={j} className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-lg border border-green-100">{act}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {fertilizerData.warnings?.length > 0 && (
              <div className="bg-red-50 rounded-2xl p-5 border border-red-100 mb-8">
                <h3 className="font-black text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Important Warnings
                </h3>
                <ul className="space-y-2">
                  {fertilizerData.warnings.map((w, i) => (
                    <li key={i} className="flex gap-2 text-red-700 text-sm font-medium">
                      <Ban className="w-4 h-4 mt-0.5 flex-shrink-0" /> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ── Agricultural Medicine Database Section ── */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
            <Beaker className="w-6 h-6 text-emerald-600" /> Complete Crop Medicine & Chemical Database
          </h2>
          <p className="text-gray-500 font-medium mb-6">
            All major pesticides, fungicides, herbicides, bio-agents and fertilizers used in Indian agriculture with exact doses and safety guidelines.
          </p>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by medicine name, pest, or crop..."
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {MEDICINE_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedType === type
                      ? 'bg-green-600 text-white border-green-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 font-bold mb-4">{filteredMedicines.length} medicines found</p>
        </div>

        {/* Medicine Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((med, i) => {
            const typeColors = {
              'Insecticide': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100' },
              'Fungicide': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100' },
              'Herbicide': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100' },
              'Bio-fungicide': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100' },
              'Bio-pesticide': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', badge: 'bg-teal-100' },
              'Fertilizer': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100' },
              'Micronutrient': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', badge: 'bg-cyan-100' },
            };
            const colors = typeColors[med.type] || typeColors['Insecticide'];
            const speakText = `${med.name}. Type: ${med.type}. Used for: ${med.target}. Dose: ${med.dose}. ${med.timing}. Safety: ${med.safety}`;

            return (
              <div key={i} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                {/* Image Header */}
                <div className="h-36 relative overflow-hidden">
                  <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                  
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colors.badge} ${colors.text} border ${colors.border}`}>
                    {med.type}
                  </span>
                  
                  <h4 className="absolute bottom-3 left-4 right-4 text-sm font-extrabold text-white drop-shadow-lg leading-snug">{med.name}</h4>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  {/* Target Pests */}
                  <div className="mb-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Targets</p>
                    <p className="text-sm font-bold text-gray-800">{med.target}</p>
                  </div>

                  {/* Crops */}
                  <div className="mb-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Suitable Crops</p>
                    <p className="text-xs text-gray-600 font-medium">{med.crops}</p>
                  </div>

                  {/* Dose - Prominent */}
                  <div className={`${colors.bg} rounded-xl p-3 mb-3 border ${colors.border}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-4 h-4" style={{ color: colors.text.replace('text-', '') }} />
                      <span className={`text-xs font-black uppercase tracking-wider ${colors.text}`}>Dose</span>
                    </div>
                    <p className="text-sm font-extrabold text-gray-900">{med.dose}</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">Method: {med.method}</p>
                  </div>

                  {/* Timing */}
                  <div className="mb-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> When to Apply
                    </p>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{med.timing}</p>
                  </div>

                  {/* Safety Warning */}
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 mb-3 mt-auto">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-0.5">Safety</p>
                        <p className="text-[11px] text-amber-800 font-medium leading-relaxed">{med.safety}</p>
                      </div>
                    </div>
                  </div>

                  {/* Listen Button */}
                  <div className="pt-2 border-t border-gray-50 flex items-center gap-2">
                    <SpeakButton text={speakText} label="Listen" size="sm" />
                    <span className="text-[10px] text-gray-400 font-medium">Hear full details</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getDefaultFertilizerPlan(soil) {
  return {
    requirements: [
      { nutrient: 'Nitrogen (N)', dose: '120-150 kg/ha', product: 'Urea (46% N)', status: soil.nitrogen > 200 ? 'Adequate' : 'Deficient' },
      { nutrient: 'Phosphorus (P)', dose: '60-80 kg/ha', product: 'DAP (46% P₂O₅)', status: soil.phosphorus > 20 ? 'Adequate' : 'Deficient' },
      { nutrient: 'Potassium (K)', dose: '40-60 kg/ha', product: 'MOP (60% K₂O)', status: soil.potassium > 150 ? 'Adequate' : 'Deficient' },
      { nutrient: 'Zinc (Zn)', dose: '25 kg/ha', product: 'Zinc Sulphate (21% Zn)', status: 'Recommended' },
    ],
    schedule: [
      { stage: 'Basal (At Sowing)', timing: 'Day 0', actions: ['Full DAP dose (100kg/ha)', '1/3 Urea (40kg/ha)', 'Full MOP (50kg/ha)', 'Zinc Sulphate (25kg/ha)'] },
      { stage: 'First Top-dress', timing: 'Day 21-25 (Crown Root)', actions: ['1/3 Urea (40kg/ha)', 'Light irrigation after application'] },
      { stage: 'Second Top-dress', timing: 'Day 45-50 (Tillering)', actions: ['Final 1/3 Urea (40kg/ha)', 'Irrigate within 24 hours'] },
    ],
    warnings: [
      'Never mix Urea and DAP together — apply separately with 2-day gap.',
      'Do not apply fertilizer on dry soil — always irrigate before or after.',
      'Keep 15cm distance from stem when applying granular fertilizer.',
      'Store all chemicals away from food, water, and children.',
      'Wear gloves, mask, and full-sleeve shirt when spraying any chemical.',
    ],
  };
}
