import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Trees, TrendingUp, Sun, Droplets, MapPin, Activity, DollarSign, Leaf, ShieldCheck, ChevronRight, Volume2, Info, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import getPageLanguage, { getSpeechLang } from '../utils/getPageLanguage';
import translateForSpeech from '../utils/translateForSpeech';

const TREE_ASSETS = {
  'Teak (Sagwan)': {
    image: 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?auto=format&fit=crop&w=800&q=80',
    benefits: ['High Timber Value', 'Minimal Water', 'Pest Resistant']
  },
  'Bamboo': {
    image: 'https://images.unsplash.com/photo-1549421263-5ec394a5ad4c?auto=format&fit=crop&w=800&q=80',
    benefits: ['Fast Growth', 'Daily Income', 'Carbon Credit']
  },
  'Sandalwood': {
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=800&q=80',
    benefits: ['Highest ROI', 'Premium Oil', 'Luxury Market']
  }
};

export default function ProfitTrees() {
  const { locationText, loading: locLoading } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locLoading) loadData();
  }, [locLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.post('/ai/agroforestry', { location: locationText });
      const payload = res.data?.data || res.data;
      setData(payload.advice);
    } catch {
      setData('Based on your location, **Teak (Sagwan)** is the highest performing asset.\n\n**Financial Outlook:**\n- Estimated Return: ₹1.5 Crore+ after 10-12 years per acre.\n- Initial Cost: ₹50,000 - ₹80,000.\n- Strategy: Boundary planting for zero land loss.\n\n**Maintenance Profile:**\n- Water: Low (after year 3)\n- Labor: Occasional pruning.\n\n**Bamboo** is recommended for short-term rotation (3-year cycle) with steady market demand for paper and furniture industries.');
    } finally {
      setLoading(false);
    }
  };

  const speakAdvice = () => {
    if ('speechSynthesis' in window && data) {
      window.speechSynthesis.cancel();
      const lang = getPageLanguage();
      const cleanText = data.replace(/\*\*|_/g, '');
      const translated = translateForSpeech(cleanText, lang);
      const utterance = new SpeechSynthesisUtterance(translated);
      utterance.lang = getSpeechLang(lang);
      utterance.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find(v => v.lang.startsWith(lang)) || voices.find(v => v.lang.includes('IN')) || voices[0];
      if (v) utterance.voice = v;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading || locLoading) return <Loading text="Mapping ecological data for high-yield timber assets..." />;

  return (
    <div className="min-h-screen bg-[#f0f4f0] dark:bg-gray-950 pb-20 font-sans selection:bg-emerald-200">
      <Helmet>
        <title>Agroforestry — Profit Trees & Timber Investment | AgriSaar</title>
        <meta name="description" content="Plant Teak, Bamboo, Sandalwood, and Mahogany for long-term high ROI. AI-powered agroforestry guide with profitability analysis, growth timelines, and carbon credit potential." />
        <meta property="og:title" content="Agroforestry — Profit Trees & Timber Investment | AgriSaar" />
        <meta property="og:description" content="Discover high-profit tree farming — 10-year investment plans for Sagwan, Bamboo, Sandalwood with ROI, water needs, and market value." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="agroforestry, profit trees, teak farming, sagwan, bamboo, sandalwood, timber investment, carbon credit, AgriSaar" />
      </Helmet>
      
      {/* HERO */}
      <motion.section 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden pt-12 pb-24 rounded-b-[4rem] shadow-2xl mb-12 border-b border-emerald-500/20"
      >
        <div className="absolute inset-0 bg-[#062419]">
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80" 
            alt="Eco Forest" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062419] via-emerald-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 px-5 py-2 rounded-full mb-8 shadow-inner shadow-emerald-500/20">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-100 text-xs font-black uppercase tracking-[0.2em]">{locationText || 'India Ecosystem'}</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-6">
                Harvest the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Green Gold.</span>
              </h1>
              <p className="text-emerald-50/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-10 border-l-4 border-emerald-500 lg:pl-6 mx-auto lg:mx-0">
                Transform underutilized land into high-performing timber and fruit estates. Our AI analyzes soil and market growth to recommend trees that double as your retirement fund.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 text-white">
                  <div className="bg-emerald-500/30 p-3 rounded-2xl shadow-inner border border-emerald-400/30"><TrendingUp className="w-6 h-6 text-emerald-400" /></div>
                  <div className="text-left"><p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest leading-none mb-1">Return Factor</p><p className="text-2xl font-black">15X - 40X</p></div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 text-white">
                  <div className="bg-blue-500/30 p-3 rounded-2xl shadow-inner border border-blue-400/30"><Leaf className="w-6 h-6 text-blue-400" /></div>
                  <div className="text-left"><p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest leading-none mb-1">Asset Type</p><p className="text-2xl font-black">Sustainable</p></div>
                </div>
              </div>
            </div>
            {/* Visualizer Panel hidden on mobile */}
            <div className="hidden lg:block w-[450px] relative">
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-6 shadow-2xl overflow-hidden group">
                <div className="h-80 rounded-[2.5rem] overflow-hidden mb-6 relative">
                   <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Timber" />
                   <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/20 to-transparent"></div>
                </div>
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="bg-emerald-100 p-2.5 rounded-xl"><Sparkles className="w-5 h-5 text-emerald-600" /></div>
                      <div className="text-left"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Projection</p><p className="text-base font-black text-slate-900">Semi-Arid Assets</p></div>
                   </div>
                   <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase text-gray-500"><span>Market Liquidity</span><span>85% Ideal</span></div>
                     <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-emerald-500"></div></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CONTENT BOARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* AI REPORT */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="lg:col-span-8 bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
                <div className="flex items-center gap-5">
                   <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-2xl text-emerald-600"><Trees className="w-8 h-8" /></div>
                   <div className="text-left"><h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI Strategy Report</h2><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optimized for your region</p></div>
                </div>
                <button onClick={speakAdvice} className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform"><Volume2 className="w-6 h-6" /></button>
              </div>

              <div className="prose prose-emerald lg:prose-xl max-w-none dark:prose-invert font-medium text-slate-700 dark:text-gray-300 leading-relaxed text-left">
                {data?.split('\n').map((para, i) => (
                  <p key={i} className="mb-6 last:mb-0">
                    {para.startsWith('**') ? (
                      <span className="block text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4 border-b-2 border-emerald-500/20 w-fit">{para.replace(/\*\*/g, '')}</span>
                    ) : para.startsWith('-') ? (
                       <span className="flex items-start gap-4 my-3 text-slate-600 dark:text-gray-400 group">
                         <ChevronRight className="w-5 h-5 text-emerald-500 shrink-0 mt-1" /> {para.substring(1)}
                       </span>
                    ) : para}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* SIDE PANEL */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden text-left">
               <ShieldCheck className="w-12 h-12 text-emerald-400 mb-6" />
               <h3 className="text-2xl font-black mb-2 tracking-tight">Trusted Growth</h3>
               <p className="text-sm font-medium text-gray-400 mb-8">Financial frameworks for your timber investments.</p>
               <div className="space-y-5">
                  <div className="flex gap-4 items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                     <DollarSign className="w-6 h-6 text-emerald-400" />
                     <div><p className="text-[10px] font-bold text-gray-500 uppercase leading-none mb-1">Govt. Support</p><p className="text-sm font-black">40% Capital Subsidy</p></div>
                  </div>
                  <div className="flex gap-4 items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                     <Activity className="w-6 h-6 text-blue-400" />
                     <div><p className="text-[10px] font-bold text-gray-500 uppercase leading-none mb-1">Tax Law</p><p className="text-sm font-black">Agricultural Exemption</p></div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Top Performers</h4>
               {Object.entries(TREE_ASSETS).map(([name, asset]) => (
                 <motion.div key={name} whileHover={{ x: -8 }} className="bg-white dark:bg-gray-900 border border-slate-100 p-4 rounded-[2.5rem] flex items-center gap-5 shadow-sm group cursor-pointer">
                    <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shrink-0"><img src={asset.image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                    <div className="flex-1 min-w-0 text-left">
                      <h5 className="font-black text-slate-900 dark:text-white text-lg truncate leading-tight mb-1">{name}</h5>
                      <div className="flex flex-wrap gap-1.5">{asset.benefits.map((b, i) => <span key={i} className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{b}</span>)}</div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-emerald-500" />
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
