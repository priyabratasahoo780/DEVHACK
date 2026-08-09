import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Droplet, Leaf, Sprout, CheckCircle2, ArrowRight, Star, Sparkles, TestTube2, Wind, Search } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';
import SpeakButton from '../components/SpeakButton';

const COMMON_INPUTS = [
  { name: 'Jeevamrut', desc: 'Cow dung + Urine based liquid fertilizer', icon: '🐄', target: 'Wheat, Rice, Veggies', gradient: 'from-amber-100 to-orange-50', text: 'text-orange-700' },
  { name: 'Neemastra', desc: 'Neem-based natural pest control', icon: '🌿', target: 'Cotton, Tomatoes', gradient: 'from-emerald-100 to-green-50', text: 'text-emerald-700' },
  { name: 'Vermicompost', desc: 'Earthworm compost for rich soil', icon: '🪱', target: 'Potatoes, Orchards', gradient: 'from-orange-100 to-red-50', text: 'text-red-700' },
  { name: 'Panchagavya', desc: '5 cow products for growth promotion', icon: '🌾', target: 'All Crops', gradient: 'from-yellow-100 to-amber-50', text: 'text-amber-700' },
];

export default function BioFertilizer() {
  const [crop, setCrop] = useState('');
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!crop) return;
    try {
      setStatus('loading');
      setData(null);
      const res = await api.post('/ai/bio-inputs', { crop });
      const payload = res.data || res;
      const intelligence = payload?.intelligence || payload?.crop?.intelligence || (typeof payload === 'string' ? payload : null);
      
      if (intelligence && !intelligence.includes('unavailable')) {
        setData(intelligence);
      } else {
        throw new Error('Got fallback response');
      }
      setStatus('success');
    } catch {
      try {
        const voiceRes = await api.post('/ai/voice', { 
          transcript: `[Reply in: English] Give me a detailed bio-fertilizer recipe and organic farming guide for ${crop} crop. Include: 1) Specific bio-organic recipe (Jeevamrut/Neemastra etc), 2) Benefits over chemicals, 3) Application method, 4) Cost saving estimate. Keep it practical for Indian farmers.` 
        });
        const voicePayload = voiceRes.data || voiceRes;
        const advice = voicePayload?.advice || voicePayload;
        if (advice && typeof advice === 'string' && !advice.includes('samajh nahi paaya')) {
          setData(advice);
        } else {
          setData(getOfflineFallback(crop));
        }
      } catch {
        setData(getOfflineFallback(crop));
      }
      
      setStatus('success');
    }
  };

  const speakData = () => {
      const utter = new SpeechSynthesisUtterance(data || getOfflineFallback(crop));
      const voices = window.speechSynthesis.getVoices();
      
      const femaleKeywords = ['female', 'kalpana', 'priya', 'swara', 'samantha', 'zira', 'google hindi', 'microsoft k'];
      const femaleVoices = voices.filter(v => 
        femaleKeywords.some(kw => v.name.toLowerCase().includes(kw))
      );
      
      const bestVoice = 
        femaleVoices.find(v => v.lang.includes('hi')) || 
        femaleVoices[0] || 
        voices.find(v => v.lang.includes('hi')) || 
        voices[0];

      if (bestVoice) {
        console.log('Selected Voice:', bestVoice.name);
        utter.voice = bestVoice;
      }
      
      window.speechSynthesis.speak(utter);
  }

  const getOfflineFallback = (cropName) => {
    return `Bio-Input Recipe for ${cropName}:

Jeevamrut Formula:
• 10L Water + 1kg Cow Dung + 1L Cow Urine
• Add 50g Jaggery + Handful of soil from farm
• Mix well, ferment for 48 hours in shade
• Apply 200L per acre every 15 days

Benefits:
• 60-80% reduction in chemical fertilizer cost
• Improves soil microbiome & water retention
• Better taste & quality of produce
• Zero chemical residue — fully organic

Application Method:
• Dilute 1:10 with water
• Apply near root zone in evening
• Best results when soil is moist
• Start from seedling stage

Cost Saving: Rs 4,000-8,000 per acre per season`;
  };

  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-green-900">$1</strong>')
        .replace(/^(#{1,3})\s+(.*)/, '<strong class="text-xl text-green-950 block mt-4 mb-2">$2</strong>')
        .replace(/^[•-]\s(.*)/, '<span class="flex gap-2 items-start"><span class="text-green-500 mt-1">✦</span><span>$1</span></span>');
      return (
        <span key={i} className="block mb-2 font-medium" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] pb-24 relative overflow-hidden">
      <Helmet>
        <title>Bio-Fertilizers & Organic Inputs — Javik Khad Guide | AgriSaar</title>
        <meta name="description" content="Learn to make Jeevamrut, Neemastra, Vermicompost, and Panchagavya at home. AI-powered organic farming guide with crop-specific bio-fertilizer recommendations." />
        <meta property="og:title" content="Bio-Fertilizers & Organic Inputs | AgriSaar" />
        <meta property="og:description" content="Complete guide to organic farming bio-inputs — Jeevamrut, Neemastra, Vermicompost, and more. Low-cost, high-yield natural farming methods." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="bio-fertilizer, organic farming, jeevamrut, neemastra, vermicompost, panchagavya, javik kheti, natural farming, AgriSaar" />
      </Helmet>
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-green-300/30 to-emerald-400/10 blur-[100px] rounded-full point-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-emerald-400/20 to-teal-300/10 blur-[120px] rounded-full point-events-none" />

      {/* Hero Section */}
      <div className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-green-200 shadow-sm text-green-800 font-bold text-sm mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-green-600" /> AI-Powered Organic Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Transform Farming With <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Bio-Fertilizers</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Switch to chemical-free farming. Reduce your fertilizer costs by up to 80% while dramatically improving soil health and crop quality.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Popular Inputs & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Leaf className="w-6 h-6 text-green-500" /> Popular Bio-Inputs
              </h2>
              <div className="space-y-4">
                {COMMON_INPUTS.map((input, i) => (
                  <div key={i} className="group relative bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-green-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${input.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out`}></div>
                    <div className="relative z-10 flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner group-hover:bg-white group-hover:shadow transition-all">
                        {input.icon}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 group-hover:text-green-900 transition-colors">{input.name}</h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5">{input.desc}</p>
                        <div className={`text-[10px] uppercase font-black tracking-wider mt-2 bg-white px-2 py-1 inline-block rounded border border-gray-100 ${input.text}`}>
                          Best for: {input.target}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-700 via-emerald-800 to-green-950 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-400 opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-white/20 mb-4 backdrop-blur-md shadow-inner border border-white/20">
                  <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                </div>
                <h3 className="font-black text-2xl mb-3 leading-tight">Save up to <br/><span className="text-yellow-300 text-4xl">₹8,000/Acre</span></h3>
                <p className="text-green-100/90 font-medium text-sm leading-relaxed px-4">
                  Eliminate chemical fertilizer dependencies. Increase your absolute profits significantly.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: AI Form & Results */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sm:p-12 h-full flex flex-col relative overflow-hidden">
              {/* Subtle glassmorphic decorations */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-green-100/50 to-transparent rounded-bl-full pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                    <TestTube2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Generate custom recipe</h2>
                    <p className="text-green-700 font-bold text-sm">Powered by Gemini AI Engine</p>
                  </div>
                </div>
                <p className="text-gray-500 font-medium mb-8 text-lg mt-2">Enter your crop name and let AI formulate the perfect organic fertilizer recipe tailored for Indian farming conditions.</p>
                
                <form onSubmit={handleSearch} className="relative mb-10 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex-1 relative flex items-center">
                      <Search className="w-6 h-6 text-green-500 absolute left-4" />
                      <input
                        type="text"
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                        placeholder="E.g., Wheat, Tomato, Soybean..."
                        className="w-full bg-transparent border-none py-4 pl-14 pr-4 text-gray-900 font-bold text-lg focus:outline-none focus:ring-0 placeholder-gray-400"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={!crop || status === 'loading'} 
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 sm:py-0 rounded-xl font-black shadow-[0_4px_14px_0_rgb(22,163,74,0.39)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none hover:-translate-y-0.5"
                    >
                      {status === 'loading' ? 'Analyzing...' : 'Generate Guide'} <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                <div className="flex-1">
                  {status === 'idle' && !data && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                      <Wind className="w-16 h-16 text-gray-300 mb-4" />
                      <h4 className="text-gray-500 font-bold text-lg mb-2">Awaiting your input</h4>
                      <p className="text-gray-400 font-medium text-sm max-w-sm">Type a crop name above and press "Generate Guide" to view the AI formulation.</p>
                    </div>
                  )}

                  {status === 'loading' && (
                    <div className="py-16">
                      <Loading text={`Formulating bio-recipe for ${crop}...`} />
                    </div>
                  )}
                  
                  {status === 'success' && data && (
                     <div className="bg-gradient-to-br from-green-50 to-[#ebfdf2] rounded-3xl border border-green-200/60 p-8 shadow-sm animate-fade-in relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400"></div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-green-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl border border-green-100">
                             🌿
                          </div>
                          <div>
                            <span className="font-black text-gray-900 text-xl tracking-tight block">AI Formula for {crop}</span>
                            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Verified Organic Recipe</span>
                          </div>
                        </div>
                        <div onClick={speakData}>
                            <SpeakButton text={data} label="Listen to Instructions" />
                        </div>
                      </div>
                      
                      <div className="text-gray-700 font-medium text-[15px] leading-relaxed space-y-2">
                        {formatText(data)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
