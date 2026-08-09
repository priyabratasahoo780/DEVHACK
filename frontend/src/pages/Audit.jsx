import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { LifeBuoy, AlertTriangle, CloudRain, Bug, Sun, Sprout, ArrowRight, XCircle, ShieldCheck, Clock, CheckCircle2, ChevronRight, Landmark, Trees, TrendingUp, Droplets, MapPin, Calculator, IndianRupee } from 'lucide-react';
import api from '../services/api';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';

const PROBLEMS = [
  { id: 'rain', icon: <CloudRain className="w-8 h-8" />, label: 'Unseasonal Rain / Flood', desc: 'Crop damaged by heavy rain or flooding' },
  { id: 'pest', icon: <Bug className="w-8 h-8" />, label: 'Pest Attack', desc: 'Insects or disease attacking the crop' },
  { id: 'drought', icon: <Sun className="w-8 h-8" />, label: 'Drought / Dry Spell', desc: 'Water shortage and dry conditions' },
  { id: 'other', icon: <XCircle className="w-8 h-8" />, label: 'Other Crop Damage', desc: 'Other causes of crop loss' }
];

export default function Audit() {
  const { city, locationText, loading: locLoading } = useLocation();
  const [activeTab, setActiveTab] = useState('risk'); // risk | profit
  const [selectedProblem, setSelectedProblem] = useState('');
  const [riskStatus, setRiskStatus] = useState('idle'); // idle | loading | success
  const [riskReport, setRiskReport] = useState(null);
  const [profitData, setProfitData] = useState(null);
  const [profitLoading, setProfitLoading] = useState(false);

  useEffect(() => {
    if (!locLoading && activeTab === 'profit' && !profitData) {
      loadProfitData();
    }
  }, [locLoading, activeTab]);

  const loadProfitData = async () => {
    try {
      setProfitLoading(true);
      const res = await api.post('/ai/agroforestry', { location: locationText });
      const payload = res.data?.data || res.data;
      setProfitData(payload.advice);
    } catch {
      setProfitData('Top Tree: Teak (Sagwan)\nEstimated Return: Rs 1.5 Cr after 10 years per acre.\nMaintenance: Minimal after 2 years.\n\nTop Tree: Bamboo\nReturn: Steady income after 3 years.\n\n_AI analysis temporarily unavailable._');
    } finally {
      setProfitLoading(false);
    }
  };

  const handleRiskAnalyze = async () => {
    if (!selectedProblem) return;
    try {
      setRiskStatus('loading');
      const saved = localStorage.getItem('agrisaar_soil');
      const soilData = saved ? JSON.parse(saved) : null;
      const probLabel = PROBLEMS.find(p => p.id === selectedProblem)?.label || selectedProblem;
      const { data } = await api.post('/ai/recovery', { problem: probLabel, soilData });
      setRiskReport(data.recovery || data.data?.recovery); 
      setRiskStatus('success');
    } catch (error) {
      setRiskReport({
        compensation: { title: "PMFBY & Govt Support", steps: ["Report loss within 72 hrs on Crop Insurance App", "Contact local KVK"] },
        immediateAction: { title: "Immediate Action (48 Hrs)", steps: ["Clear waterlogging", "Do not add urea instantly"] },
        recoveryCrops: { title: "Alternative Cash Crops", crops: [{ name: "Green Gram", duration: "60 days", reason: "Short cycle crop for quick income" }] }
      });
      setRiskStatus('success');
    }
  };

  if (locLoading) return <Loading text="Financial Auditor is preparing your report..." />;

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <Helmet>
        <title>Income & Risk Audit — AI Farm Financial Analysis | AgriSaar</title>
        <meta name="description" content="AI-powered farm financial audit — assess crop risk, profit potential, loss recovery options, and agroforestry investment returns. Protect your farming income with data-driven decisions." />
        <meta property="og:title" content="Income & Risk Audit — Farm Financial Analysis | AgriSaar" />
        <meta property="og:description" content="Complete AI financial audit for farmers — risk assessment, profit maximization, and recovery planning." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="farm audit, income analysis, risk assessment, crop profit, financial planning, farming income, AgriSaar" />
      </Helmet>
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150">
           <Calculator className="w-96 h-96 text-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">Income & Risk Audit</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">Protect from loss or maximize profit — AI-powered farm financial audit (Location: {city})</p>
            
            <div className="mt-10 inline-flex bg-white/10 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 shadow-2xl">
                <button onClick={() => setActiveTab('risk')} className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'risk' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}>
                   <TrendingUp className="w-4 h-4 inline mr-1" /> Risk Recovery
                </button>
                <button onClick={() => setActiveTab('profit')} className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'profit' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}>
                   <TrendingUp className="w-4 h-4 inline mr-1" /> Long-term Profit
                </button>
            </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {activeTab === 'risk' ? (
          /* Risk Recovery Content */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {riskStatus === 'idle' && (
               <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
                  <div className="text-center mb-10">
                     <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">Emergency Protocol</span>
                     <h2 className="text-3xl font-black text-gray-900 mt-4 underline decoration-red-200 underline-offset-8 decoration-4">What damage has occurred?</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {PROBLEMS.map(p => (
                      <button key={p.id} onClick={() => setSelectedProblem(p.id)} className={`p-8 rounded-3xl border-2 transition-all text-center group flex flex-col items-center gap-4 ${selectedProblem === p.id ? 'border-red-500 bg-red-50 shadow-xl scale-105' : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-red-200 hover:shadow-lg'}`}>
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${selectedProblem === p.id ? 'bg-red-500 text-white' : 'bg-white text-gray-400 group-hover:text-red-500'}`}>
                           {p.icon}
                         </div>
                         <div>
                            <p className="font-black text-gray-900">{p.label}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Select to audit</p>
                         </div>
                      </button>
                    ))}
                  </div>
                  <button onClick={handleRiskAnalyze} disabled={!selectedProblem} className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${selectedProblem ? 'bg-red-600 text-white shadow-2xl shadow-red-200 hover:scale-105 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    Start Risk Audit <ShieldCheck className="w-6 h-6" />
                  </button>
               </div>
             )}

             {riskStatus === 'loading' && <div className="py-20 text-center"><Loading text="AI Auditor analyzing disaster impact and govt compensations..." /></div>}

             {riskStatus === 'success' && riskReport && (
               <div className="space-y-8">
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                     <div className="flex flex-col md:flex-row gap-10">
                        {/* Govt Steps */}
                        <div className="flex-1 space-y-6">
                           <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                              <Landmark className="w-8 h-8 text-blue-600" /> {riskReport.compensation?.title}
                           </h3>
                           <div className="space-y-4">
                              {riskReport.compensation?.steps.map((s, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-blue-50 bg-blue-50/30">
                                   <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black flex-shrink-0">{i+1}</span>
                                   <p className="text-gray-800 font-bold text-sm leading-relaxed">{s}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                        {/* Immediate Steps */}
                        <div className="flex-1 space-y-6">
                           <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                              <AlertTriangle className="w-8 h-8 text-amber-500" /> {riskReport.immediateAction?.title}
                           </h3>
                           <div className="space-y-4">
                              {riskReport.immediateAction?.steps.map((s, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-amber-50 bg-amber-50/30">
                                   <CheckCircle2 className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" />
                                   <p className="text-gray-800 font-bold text-sm leading-relaxed">{s}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Alternative Crops */}
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                     <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-green-600" /> {riskReport.recoveryCrops?.title} (Cash Income)
                     </h3>
                     <div className="grid md:grid-cols-3 gap-6">
                        {riskReport.recoveryCrops?.crops.map((c, i) => (
                           <div key={i} className="p-6 rounded-[2rem] border-2 border-green-50 bg-green-50/20 group hover:border-green-400 transition-all">
                              <span className="text-[10px] font-black text-green-700 bg-white px-2 py-1 rounded-md border border-green-100">Quick Harvest</span>
                              <h4 className="text-xl font-black text-gray-900 mt-4 group-hover:text-green-800">{c.name}</h4>
                              <p className="text-sm text-gray-500 font-bold mt-2 leading-relaxed italic">{c.reason}</p>
                              <div className="mt-4 flex items-center gap-2 text-xs font-black text-green-700">
                                 <Clock className="w-4 h-4" /> Ready in {c.duration}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="text-center">
                     <button onClick={() => setRiskStatus('idle')} className="text-gray-400 font-black text-sm uppercase tracking-widest hover:text-red-500 flex items-center gap-2 mx-auto">
                        ← Restart Audit
                     </button>
                  </div>
               </div>
             )}
          </div>
        ) : (
          /* Long-term Profit Content */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {profitLoading ? (
                <div className="py-20 text-center"><Loading text="AI calculating long-term timber yields and retirement value..." /></div>
             ) : (
                <div className="grid lg:grid-cols-5 gap-8">
                   <div className="lg:col-span-3">
                      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 h-full">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-green-100 rounded-2xl text-green-700 shadow-inner">
                               <Trees className="w-8 h-8" />
                            </div>
                            <div>
                               <h3 className="text-3xl font-black text-gray-900">Agroforestry Expert</h3>
                               <p className="text-sm text-gray-400 font-bold uppercase">Land Management Audit</p>
                            </div>
                         </div>
                         <div className="prose prose-green max-w-none text-gray-800 font-bold whitespace-pre-wrap leading-[1.8] text-lg bg-green-50/30 p-8 rounded-3xl border border-green-100 italic">
                            {profitData}
                         </div>
                      </div>
                   </div>
                   <div className="lg:col-span-2 space-y-8">
                      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                         <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 rotate-12">
                            <IndianRupee className="w-64 h-64" />
                         </div>
                         <h4 className="text-xl font-bold mb-6 flex items-center gap-2"><Calculator className="w-6 h-6" /> Benefit Calculator</h4>
                         <div className="space-y-6 relative z-10">
                            {[
                               { label: 'Long-term Savings', value: '₹1.2 Cr - 2 Cr', sub: 'After 10-15 years' },
                               { label: 'Annual Biomass Profit', value: '₹1.5 Lakh - 3 Lakh', sub: 'Inter-cropping' },
                               { label: 'Govt Subsidy (Bamboo)', value: '₹120 / Plant', sub: 'Under National Bamboo Mission' }
                            ].map((stat, i) => (
                               <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                                  <p className="text-[10px] font-black uppercase text-green-200">{stat.label}</p>
                                  <p className="text-2xl font-black">{stat.value}</p>
                                  <p className="text-xs text-green-100/70 font-bold">{stat.sub}</p>
                                </div>
                            ))}
                         </div>
                      </div>
                      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center">
                         <h4 className="font-black text-gray-400 text-xs uppercase tracking-widest mb-6">Expert Guidance</h4>
                         <p className="text-gray-600 font-bold italic leading-relaxed mb-8">"Agroforestry isn't just about trees; it's about making your land value permanent."</p>
                         <button onClick={() => window.open('https://krishi.icar.gov.in/', '_blank')} className="w-full bg-gray-50 hover:bg-green-50 text-green-700 py-4 rounded-2xl font-black text-sm border border-green-100 transition-all flex items-center justify-center gap-2">
                            Talk to ICAR Scientist <ArrowRight className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
