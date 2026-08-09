import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, AlertTriangle, Cpu, Wheat, FlaskConical, Sprout } from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import SoilHealthCard from '../components/SoilHealthCard';
import SoilChart from '../components/SoilChart';
import CropCard from '../components/CropCard';
import FertilizerTable from '../components/FertilizerTable';

export default function AnalysisDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAnalysis } = useAgri();
  const state = location.state;

  useEffect(() => {
    if (state) {
      setAnalysis(state);
    }
  }, [state, setAnalysis]);

  if (!state || !state.soil) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Please enter your soil data or upload a report first to view the analysis.</p>
        <button onClick={() => navigate('/soil-input')} className="bg-primary-900 text-white px-8 py-3 rounded-xl font-bold">
          Enter Soil Data
        </button>
      </div>
    );
  }

  const { soil: aiAnalysis, crops: cropData, fertilizer: fertData, inputData: originalData } = state;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet>
        <title>AI Soil Analysis Report — Detailed Mitti Report | AgriSaar</title>
        <meta name="description" content="View your complete AI-generated soil health report — NPK levels, pH score, organic carbon analysis with crop & fertilizer recommendations tailored to your land." />
        <meta property="og:title" content="AI Soil Analysis Report | AgriSaar" />
        <meta property="og:description" content="Complete AI-powered soil health checkup with detailed nutrient analysis, crop recommendations, and fertilizer plans." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="soil report, AI analysis, NPK levels, pH analysis, soil health card, farming report, AgriSaar" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-10 rounded-3xl mx-px mt-2 shadow-sm border border-gray-100">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=400&fit=crop" alt="Soil Analysis" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/80 to-transparent"></div>
        </div>
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3 mb-3">
              <Cpu className="w-9 h-9 text-primary-200" /> AI Soil Analysis Report
            </h1>
            <p className="text-primary-100 text-lg font-medium">Complete AI-powered soil health checkup</p>
          </div>
          <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/30 flex items-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-white/10">
            <Download className="w-5 h-5" /> Download PDF Report
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <SoilHealthCard
              score={aiAnalysis?.healthScore || aiAnalysis?.score}
              soilType={aiAnalysis?.soilType}
              nutrients={aiAnalysis?.nutrients || aiAnalysis?.nutrientsStatus}
            />
          </div>
          
          <div className="mt-4">
            <SoilChart nutrients={{
              nitrogen: { value: originalData?.nitrogen || 0 },
              phosphorus: { value: originalData?.phosphorus || 0 },
              potassium: { value: originalData?.potassium || 0 },
              ph: { value: originalData?.ph || 0 }
            }} />
          </div>

          <div className="bg-gradient-to-br from-green-50 to-primary-100 p-6 rounded-2xl border border-green-200 mt-6 shadow-sm">
            <h3 className="font-extrabold text-primary-900 mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-600" /> AI Insights & Takeaways
            </h3>
            <div className="whitespace-pre-wrap text-sm text-green-900 leading-relaxed font-medium" style={{ scrollbarWidth: 'thin' }}>
              {aiAnalysis?.analysis || 'Your AI Analysis is ready. Refer to the scores above for a detailed breakdown.'}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Wheat className="w-6 h-6 text-primary-600" /> Best Crops
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {cropData?.topCrops?.length > 0 ? (
                cropData.topCrops.map((crop, i) => (
                  <CropCard key={i} rank={i + 1} name={crop.name} score={crop.score} reason={crop.reason} />
                ))
              ) : aiAnalysis?.suitableCrops?.length > 0 ? (
                aiAnalysis.suitableCrops.map((crop, i) => (
                  <CropCard key={i} rank={i + 1} name={crop.name} score={crop.score} reason={crop.reason} />
                ))
              ) : (
                <p className="text-gray-500 italic">No crop data generated.</p>
              )}
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => navigate('/crops')} className="text-primary-700 font-bold text-sm hover:text-primary-800">
                View all crops →
              </button>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Sprout className="w-6 h-6 text-primary-600" /> Quick Fertilizer Plan
            </h2>
            <FertilizerTable quickReference={fertData?.requirements || aiAnalysis?.fertilizerRecommendations} />
            <div className="mt-6 text-right">
              <button onClick={() => navigate('/fertilizer')} className="text-primary-700 font-bold text-sm hover:text-primary-800">
                View detailed plan →
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
