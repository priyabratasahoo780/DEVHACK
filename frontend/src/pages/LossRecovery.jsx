import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { HeartHandshake, AlertTriangle, CloudRain, Bug, Sun, Sprout, ArrowRight, XCircle, ShieldCheck, Clock, CheckCircle2, ChevronRight, Landmark } from 'lucide-react';
import api from '../services/api';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import SpeakButton from '../components/SpeakButton';

const PROBLEMS = [
  { id: 'rain', icon: <CloudRain className="w-8 h-8" />, label: 'Unseasonal Rain / Flood', desc: 'Crop damaged by heavy rain or flooding' },
  { id: 'pest', icon: <Bug className="w-8 h-8" />, label: 'Pest Attack', desc: 'Insects or disease attacking the crop' },
  { id: 'drought', icon: <Sun className="w-8 h-8" />, label: 'Drought / Dry Spell', desc: 'Water shortage and dry conditions' },
  { id: 'other', icon: <XCircle className="w-8 h-8" />, label: 'Other Crop Damage', desc: 'Other causes of crop loss' }
];

export default function LossRecovery() {
  const { city } = useLocation();
  const [selectedProblem, setSelectedProblem] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [report, setReport] = useState(null);

  const handleAnalyze = async () => {
    if (!selectedProblem) return;
    try {
      setStatus('loading');
      const saved = localStorage.getItem('agrisaar_soil');
      const soilData = saved ? JSON.parse(saved) : null;
      
      const probLabel = PROBLEMS.find(p => p.id === selectedProblem)?.label || selectedProblem;
      
      const { data } = await api.post('/ai/recovery', { problem: probLabel, soilData });
      setReport(data.recovery || data.data?.recovery); 
      setStatus('success');
    } catch (error) {
      console.error(error);
      // Fallback object matching structured data
      setReport({
        compensation: {
          title: "PMFBY & Govt Support",
          steps: ["Report loss within 72 hrs on Crop Insurance App", "Contact local KVK"]
        },
        immediateAction: {
          title: "Immediate Action (48 Hrs)",
          steps: ["Clear waterlogging", "Do not add urea instantly"]
        },
        recoveryCrops: {
          title: "Alternative Cash Crops",
          crops: [{ name: "Green Gram", duration: "60 days", reason: "AI fallback option" }]
        }
      });
      setStatus('success');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] py-12">
      <Helmet>
        <title>Disaster Recovery & Crop Loss Support — Fasal Nuksan Madad | AgriSaar</title>
        <meta name="description" content="Crop damaged by rain, pest, or drought? Get instant AI-powered recovery plans — PMFBY insurance claims, NDRF fund guidance, emergency cash crop suggestions, and direct govt helpline access." />
        <meta property="og:title" content="Disaster Recovery — Fasal Nuksan Madad | AgriSaar" />
        <meta property="og:description" content="Emergency farming support — AI helps with crop loss recovery, insurance claims, fast cash crop planning, and government disaster relief." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="crop loss, disaster recovery, PMFBY claim, flood damage, pest attack, drought relief, fasal nuksan, AgriSaar" />
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-5 shadow-inner border-4 border-white">
            <HeartHandshake className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Disaster Recovery & Support</h1>
          <p className="text-gray-600 font-medium text-lg">After crop loss? AI helps with PMFBY claims, NDRF funds, and fast cash crop planning ({city})</p>
        </div>

        {status === 'idle' && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 sm:p-12 transition-all">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-8 flex items-center justify-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-500" /> Select Your Disaster Type:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {PROBLEMS.map((prob) => (
                <button
                  key={prob.id}
                  onClick={() => setSelectedProblem(prob.id)}
                  className={`flex items-start gap-5 p-6 rounded-3xl border-2 transition-all text-left group
                    ${selectedProblem === prob.id 
                      ? 'border-green-500 bg-green-50/50 shadow-lg transform -translate-y-1' 
                      : 'border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50 hover:shadow-md'}`}
                >
                  <div className={`p-4 rounded-2xl transition-colors ${selectedProblem === prob.id ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'}`}>
                    {prob.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg font-black tracking-wide ${selectedProblem === prob.id ? 'text-green-900' : 'text-gray-800'}`}>{prob.label}</h3>
                    <p className="text-sm text-gray-500 font-bold mt-1.5 leading-relaxed">{prob.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center max-w-sm mx-auto">
              <button
                onClick={handleAnalyze}
                disabled={!selectedProblem}
                className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg transition-transform duration-300 ${selectedProblem ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Get AI Recovery Plan <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-20 text-center animate-pulse">
            <Loading text="Analyzing disaster impact... Fetching PMFBY guidelines and short-cycle recovery crops..." />
          </div>
        )}

        {status === 'success' && report && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Alert */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-[2rem] shadow-2xl p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-8 -translate-y-8">
                <HeartHandshake className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-red-400/30">
                  <AlertTriangle className="w-4 h-4 text-yellow-300" /> Emergency Protocol Active
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-3">Don't Panic. Here is the Plan.</h2>
                <p className="text-red-100 text-lg font-medium max-w-2xl">Based on the disaster reported, follow these exact steps to claim compensation and replant your fields for immediate cash flow.</p>
                <div className="mt-4">
                  <SpeakButton 
                    text={`Recovery Plan: ${report.compensation?.steps?.join('. ')}. Immediate Actions: ${report.immediateAction?.steps?.join('. ')}. Recovery Crops: ${report.recoveryCrops?.crops?.map(c => c.name + ' takes ' + c.duration).join(', ')}`} 
                    label="Listen to Plan" 
                    size="md" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Box 1: Government Support & Insurance */}
              <div className="bg-white rounded-[2rem] p-8 shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                    <Landmark className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">{report.compensation?.title || 'Govt Support'}</h3>
                </div>
                <ul className="space-y-4">
                  {report.compensation?.steps?.map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">{i+1}</div>
                      <p className="text-gray-700 font-semibold leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ul>
                <a href="https://pmfby.gov.in/" target="_blank" rel="noreferrer" className="mt-8 flex items-center justify-center gap-2 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 rounded-xl border border-blue-200 transition-colors">
                  Go to PMFBY Portal <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Box 2: Immediate Actions */}
              <div className="bg-white rounded-[2rem] p-8 shadow-lg border-2 border-amber-100 hover:border-amber-300 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                    <Clock className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">{report.immediateAction?.title || 'Immediate Action'}</h3>
                </div>
                <ul className="space-y-4">
                  {report.immediateAction?.steps?.map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 font-semibold leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Box 3: Recovery Crops */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg border-2 border-green-200">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                    <Sprout className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{report.recoveryCrops?.title || 'Recovery Crops'}</h3>
                    <p className="text-gray-500 font-semibold">Short-duration cash crops to recover financial loss quickly.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {report.recoveryCrops?.crops?.map((crop, i) => (
                    <div key={i} className="bg-green-50/50 rounded-2xl p-6 border border-green-100 hover:shadow-md hover:border-green-300 transition-all">
                      <div className="bg-white w-full py-2 px-4 rounded-full border border-green-200 inline-flex items-center gap-2 text-green-800 font-black mb-4 shadow-sm text-sm">
                        <Clock className="w-4 h-4 text-green-600" /> Harvest in {crop.duration}
                      </div>
                      <h4 className="text-xl font-extrabold text-gray-900 mb-2">{crop.name}</h4>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">{crop.reason}</p>
                    </div>
                  ))}
                </div>
            </div>
            
            <div className="text-center pt-4">
              <button 
                onClick={() => { setStatus('idle'); setSelectedProblem(''); setReport(null); }}
                className="bg-white text-gray-500 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 px-8 py-4 rounded-2xl font-bold transition-all inline-flex items-center gap-2"
              >
                Change Disaster Type
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
