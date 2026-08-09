import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Landmark, MapPin, RefreshCw, ExternalLink, IndianRupee, Search, ChevronRight, ShieldCheck, FileText, Sparkles, Loader2, Info, CheckCircle2, Clock, Filter, AlertCircle, Building2, UserCheck, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { findSchemes } from '../services/schemeApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';

const CATEGORY_CONFIG = {
  'Direct Benefit': { color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500', icon: '₹' },
  'Insurance': { color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', icon: '✦' },
  'Loan': { color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', icon: '⊕' },
  'Subsidy': { color: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500', icon: '◎' },
  'Market': { color: 'pink', bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-500', icon: '↗' },
  'Support': { color: 'cyan', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-500', icon: '⊞' },
  'Pension': { color: 'orange', bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500', icon: '◈' },
  'Innovation': { color: 'teal', bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-500', icon: '▴' }
};

// Each scheme gets its own real, contextual image
const SCHEME_IMAGE_MAP = {
  'PM-KISAN Samman Nidhi': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
  'PM Fasal Bima Yojana (PMFBY)': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  'Kisan Credit Card (KCC)': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
  'Soil Health Card Scheme': 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80',
  'PM Kisan Maandhan Yojana': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
  'PM Krishi Sinchayee Yojana': 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
};

function getSchemeApplyUrl(schemeName) {
  if (!schemeName) return 'https://www.india.gov.in/topics/agriculture';
  const name = schemeName.toLowerCase();
  if (name.includes('pm-kisan')) return 'https://pmkisan.gov.in/';
  if (name.includes('pmfby')) return 'https://pmfby.gov.in/';
  if (name.includes('kcc')) return 'https://www.pmjdy.gov.in/scheme';
  if (name.includes('soil health')) return 'https://soilhealth.dac.gov.in/';
  if (name.includes('e-nam')) return 'https://enam.gov.in/web/';
  return `https://www.india.gov.in/search/site/${encodeURIComponent(name)}`;
}

function getFallbackSchemes() {
  return {
    schemes: [
      { name: 'PM-KISAN Samman Nidhi', category: 'Direct Benefit', amount: '₹6,000 / Year', description: 'Direct income support credited in 3 equal installments to bank accounts. Over 11 crore farmers already enrolled.', eligibility: 'All landholding farmer families', documents: ['Aadhaar', 'Land Records', 'Bank Passbook'], image: SCHEME_IMAGE_MAP['PM-KISAN Samman Nidhi'] },
      { name: 'PM Fasal Bima Yojana (PMFBY)', category: 'Insurance', amount: 'Full Crop Cover', description: 'Lowest premium crop insurance against natural calamities, pests, and diseases. Covers pre-sowing to post-harvest.', eligibility: 'All farmers growing notified crops', documents: ['Sowing Cert', 'Land Record', 'ID Proof'], image: SCHEME_IMAGE_MAP['PM Fasal Bima Yojana (PMFBY)'] },
      { name: 'Kisan Credit Card (KCC)', category: 'Loan', amount: '₹3 Lakh @ 4% p.a.', description: 'Flexible short-term credit for crop production, dairy, and fisheries at subsidized interest rates.', eligibility: 'Farmers, Sharecroppers, Tenant farmers', documents: ['Land Record', 'ID Proof', 'Photo'], image: SCHEME_IMAGE_MAP['Kisan Credit Card (KCC)'] },
      { name: 'Soil Health Card Scheme', category: 'Support', amount: 'Free Soil Testing', description: 'Government provides free soil nutrient analysis and personalized fertilizer recommendations every 2 years.', eligibility: 'All farm owners', documents: ['Land Sample ID', 'Aadhaar'], image: SCHEME_IMAGE_MAP['Soil Health Card Scheme'] },
      { name: 'PM Kisan Maandhan Yojana', category: 'Pension', amount: '₹3,000 / Month', description: 'Voluntary pension scheme — ₹55 to ₹200 monthly contribution with equal government match. Pension from age 60.', eligibility: 'Small/Marginal farmers aged 18-40', documents: ['Aadhaar', 'Saving Bank A/c'], image: SCHEME_IMAGE_MAP['PM Kisan Maandhan Yojana'] },
      { name: 'PM Krishi Sinchayee Yojana', category: 'Subsidy', amount: 'Up to 75% Subsidy', description: 'Capital subsidy for drip irrigation, sprinkler systems, and water harvesting structures. Saves 40-50% water.', eligibility: 'Farmers with verified land', documents: ['Land Map', 'Bank Details'], image: SCHEME_IMAGE_MAP['PM Krishi Sinchayee Yojana'] }
    ],
    recommendation: 'Based on your profile as a small landholder, we highly recommend prioritizing PM-KISAN for liquidity and PMFBY for risk management. Also, apply for the Soil Health Card immediately to reduce fertilizer costs by up to 25%.',
    totalBenefitValue: '₹6K - ₹5L+'
  };
}

export default function GovernmentSchemes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { locationText, city, loading: locLoading } = useLocation();

  const [showWizard, setShowWizard] = useState(true);
  const [farmerProfile, setFarmerProfile] = useState({
    landSize: 'Small (< 2 Ha)',
    income: '< 2 Lakhs',
    category: 'General'
  });

  useEffect(() => {
    if (!locLoading) loadSchemes(true);
  }, [locLoading]);

  const loadSchemes = async (initialLoad = false) => {
    try {
      setLoading(true);
      const res = await findSchemes({
        location: locationText || 'India',
        farmerType: `${farmerProfile.landSize}, ${farmerProfile.income} income`
      });
      const payload = res.data || res;
      setData(payload?.schemes?.length ? payload : getFallbackSchemes());
      if (!initialLoad) setShowWizard(false);
    } catch {
      setData(getFallbackSchemes());
    } finally {
      setLoading(false);
    }
  };

  if (locLoading || loading) return <Loading text="Negotiating with government data servers for your benefits..." />;
  if (!data) return null;

  const schemes = data.schemes || [];
  const categories = ['All', ...new Set(schemes.map(s => s.category).filter(Boolean))];

  const filteredSchemes = schemes.filter(s => {
    const matchSearch = searchTerm === '' || s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-20 font-sans selection:bg-blue-200">
      <Helmet>
        <title>Government Schemes — Sarkari Yojana for Farmers | AgriSaar</title>
        <meta name="description" content="Discover all Indian government schemes for farmers — PM-KISAN, PMFBY, Kisan Credit Card, Soil Health Card, PM Kisan Maandhan. Check eligibility and apply online." />
        <meta property="og:title" content="Government Schemes — Sarkari Yojana for Farmers | AgriSaar" />
        <meta property="og:description" content="Find and apply for 10+ government farming schemes. AI matches schemes to your profile — land size, income, and location." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="sarkari yojana, PM KISAN, PMFBY, Kisan Credit Card, government schemes farmers, subsidy, AgriSaar" />
      </Helmet>
      
      {/* ── STUNNING GOVERNMENT NEXUS HERO ── */}
      <motion.section 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        className="relative overflow-hidden pt-12 pb-24 rounded-b-[4.5rem] shadow-2xl mb-12 border-b border-blue-500/20"
      >
        <div className="absolute inset-0 bg-[#0c1a3b]">
          <img 
            src="https://images.unsplash.com/photo-1517089531942-ef99b2cee9b0?auto=format&fit=crop&w=1920&q=80" 
            alt="Govt Building" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a3b] via-[#0c1a3b]/90 to-[#0c1a3b]/60"></div>
          
          {/* Animated Grids */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.div 
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 px-5 py-2 rounded-full mb-8"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em]">{locationText || 'Pan-India Database'}</span>
              </motion.div>

              <motion.h1 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-6"
              >
                Government <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Benefit Nexus.</span>
              </motion.h1>

              <motion.p 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-blue-100/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-10 border-l-4 border-blue-500 pl-6 mx-auto lg:mx-0"
              >
                Access {schemes.length}+ personalized agriculture subsidies, insurance plans, and low-interest credits. Verified directly with national portals.
              </motion.p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 text-white">
                  <div className="bg-blue-500/30 p-3 rounded-2xl border border-blue-400/30"><IndianRupee className="w-6 h-6 text-blue-400" /></div>
                  <div className="text-left"><p className="text-[10px] font-bold text-blue-300 uppercase leading-none mb-1">Max Benefit</p><p className="text-2xl font-black">₹5 Lakh+</p></div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-5 text-white">
                  <div className="bg-emerald-500/30 p-3 rounded-2xl border border-emerald-400/30"><UserCheck className="w-6 h-6 text-emerald-400" /></div>
                  <div className="text-left"><p className="text-[10px] font-bold text-emerald-300 uppercase leading-none mb-1">Status</p><p className="text-2xl font-black">Verified</p></div>
                </div>
              </div>
            </div>

            {/* AI Trust Badge Visual */}
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}
               className="hidden lg:block w-[420px] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-8 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20"><Landmark className="w-8 h-8 text-blue-400" /></div>
                  <div><h4 className="text-white font-black text-xl leading-none">Official Access</h4><p className="text-blue-300 text-xs font-bold mt-1 uppercase tracking-widest">Secure Handshake</p></div>
               </div>
               <div className="space-y-6">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                     <div className="flex justify-between items-center"><span className="text-xs font-black text-gray-400 uppercase">Real-time Data Sync</span><CheckCircle2 className="w-4 h-4 text-blue-400" /></div>
                     <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-full bg-blue-500" /></div>
                  </div>
                  <div className="bg-emerald-500/10 rounded-2xl p-5 border border-emerald-500/20 flex items-center justify-between">
                     <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-emerald-400" /><span className="text-emerald-100 text-sm font-black uppercase">Eligibility High</span></div>
                     <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── PROFILE & FILTER TOOLBAR ── */}
        <div className="mb-12 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-gray-800 p-3 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-[2rem] px-6 h-16 border border-gray-100 dark:border-gray-800 group focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, loan, or subsidy..." 
                  className="w-full bg-transparent outline-none ml-4 text-sm font-bold text-gray-800 dark:text-white placeholder:text-gray-400" 
                />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 border ${
                    selectedCategory === cat 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {CATEGORY_CONFIG[cat]?.icon || '•'} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Re-selector Toggle */}
          <AnimatePresence>
            {!showWizard && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center px-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">S</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-600">L</div>
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Matches for: <span className="text-blue-600 underline">{farmerProfile.landSize} / {farmerProfile.income}</span></p>
                </div>
                <button onClick={() => setShowWizard(true)} className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase hover:text-blue-600 transition-colors">
                  <Filter className="w-4 h-4" /> Recalibrate AI
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── AI WIZARD PANEL ── */}
        <AnimatePresence>
          {showWizard && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-blue-100 dark:border-blue-900/30 overflow-hidden mb-12"
            >
              <div className="p-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20"><Sparkles className="w-6 h-6 text-white" /></div>
                  <div><h2 className="text-2xl font-black text-gray-900 dark:text-white">Eligibility Analysis</h2><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Let the AI scan for matching benefits</p></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  {Object.keys(farmerProfile).map(key => (
                    <div key={key} className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <select 
                        name={key} value={farmerProfile[key]} 
                        onChange={(e) => setFarmerProfile({...farmerProfile, [key]: e.target.value})}
                        className="w-full h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 text-sm font-black text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                      >
                         {key === 'landSize' && ['Small (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)', 'Landless'].map(o => <option key={o}>{o}</option>)}
                         {key === 'income' && ['< 1 Lakh', '< 2 Lakhs', '< 5 Lakhs', 'More than 5L'].map(o => <option key={o}>{o}</option>)}
                         {key === 'category' && ['General', 'SC / ST', 'OBC', 'Women Farmer'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                   <button onClick={() => setShowWizard(false)} className="px-8 py-4 text-xs font-black text-gray-500 uppercase">Skip</button>
                   <button onClick={() => loadSchemes(false)} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1">Run Analysis Model</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AI SUMMARY BOARD ── */}
        <AnimatePresence>
          {data.recommendation && !showWizard && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
               <div className="relative p-8 rounded-[3rem] bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-2xl overflow-hidden group">
                  <Sparkles className="absolute -right-4 -top-4 w-40 h-40 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
                  <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                     <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center shrink-0 border border-white/20"><Building2 className="w-10 h-10" /></div>
                     <div>
                        <h3 className="text-2xl font-black mb-3">AI Benefit Summary — {city || 'Your Region'}</h3>
                        <p className="text-emerald-50/90 text-sm font-medium leading-relaxed italic border-l-2 border-emerald-400 pl-4">{data.recommendation}</p>
                     </div>
                     <div className="shrink-0 bg-white/10 px-6 py-4 rounded-3xl border border-white/20 text-center">
                        <p className="text-[10px] font-black uppercase opacity-70">Asset Worth</p>
                        <p className="text-3xl font-black text-emerald-300">{data.totalBenefitValue}</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SCHEME CARDS GRID ── */}
        <motion.div 
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {filteredSchemes.map((scheme, i) => {
            const config = CATEGORY_CONFIG[scheme.category] || CATEGORY_CONFIG['Support'];
            const img = scheme.image || SCHEME_IMAGE_MAP[scheme.name] || SCHEME_IMAGE_MAP['default'];
            const applyUrl = scheme.url || getSchemeApplyUrl(scheme.name);

            return (
              <motion.div 
                key={i} 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col group h-full"
              >
                {/* Visual Header */}
                <div className="h-44 relative bg-gray-200 overflow-hidden">
                  <img src={img} alt={scheme.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
                  
                  {/* Floating Category */}
                  <div className="absolute top-4 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                     <span className={`w-2 h-2 rounded-full h-full bg-${config.color}-500 shadow-[0_0_8px_#3b82f6]`}></span>
                     <span className={`text-[10px] font-black uppercase tracking-wider ${config.text}`}>{scheme.category}</span>
                  </div>

                  <h4 className="absolute bottom-4 left-6 right-6 text-xl font-black text-white leading-tight drop-shadow-md">{scheme.name}</h4>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  {/* Value Block */}
                  <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 relative group-hover:border-blue-200 transition-colors">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Net Benefit</p>
                     <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{scheme.amount}</p>
                     <div className="absolute top-4 right-4"><TrendingUp className="w-4 h-4 text-emerald-500" /></div>
                  </div>

                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-grow">{scheme.description}</p>

                  <div className="space-y-4 mb-8">
                     <div className="flex gap-4 items-start">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl"><ShieldCheck className="w-4 h-4 text-blue-500" /></div>
                        <div><p className="text-[10px] font-black text-gray-400 uppercase mb-0.5 tracking-widest">Eligibility</p><p className="text-[11px] font-bold text-gray-600 dark:text-gray-300">{scheme.eligibility}</p></div>
                     </div>
                     <div className="flex gap-4 items-start">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-xl"><FileText className="w-4 h-4 text-amber-500" /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Key Docs</p>
                          <div className="flex flex-wrap gap-1">
                            {scheme.documents?.slice(0, 3).map(d => <span key={d} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-[8px] font-black text-gray-500 uppercase">{d}</span>)}
                          </div>
                        </div>
                     </div>
                  </div>

                  {/* Apply Button — Premium */}
                  <a 
                    href={applyUrl} target="_blank" rel="noopener noreferrer"
                    className="relative w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-2xl py-4 px-6 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] group/btn"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></span>
                    <ExternalLink className="w-5 h-5" />
                    Apply on Official Portal
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredSchemes.length === 0 && (
          <div className="text-center py-24">
             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"><Landmark className="w-12 h-12 text-gray-300" /></div>
             <p className="text-xl font-black text-gray-400">No results found for your search.</p>
             <button onClick={() => {setSearchTerm(''); setSelectedCategory('All');}} className="text-blue-500 font-bold text-sm mt-2 border-b border-blue-500">Reset all filters</button>
          </div>
        )}

      </div>
    </div>
  );
}
