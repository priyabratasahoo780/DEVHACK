import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet"
import { PenTool, UploadCloud, Info, FlaskConical, Leaf, Beaker, Flame, ThermometerSun, ArrowRight, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import SoilForm from '../components/SoilForm';
import UploadBox from '../components/UploadBox';
import VoiceInput from '../components/VoiceInput';
import { useSoil } from '../hooks/useSoil';
import { useAgri } from '../context/AgriContext';
import { scanSoilReport } from '../services/soilApi';

const NUTRIENT_INFO = [
  {
    key: 'nitrogen',
    name: 'Nitrogen (N)',
    icon: <Leaf className="w-6 h-6 text-green-600" />,
    color: 'green',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=200&fit=crop',
    idealRange: '240-480 kg/ha',
    benefits: [
      'Promotes leafy green growth and taller plants',
      'Essential for photosynthesis and protein formation',
      'Increases overall crop yield significantly'
    ],
    deficiency: [
      'Leaves turn pale yellow (chlorosis)',
      'Stunted growth and thin stems',
      'Lower grain/fruit yield'
    ],
    excess: [
      'Excess vegetative growth, delayed flowering',
      'Weaker stems, more pest attacks',
      'Groundwater pollution risk'
    ]
  },
  {
    key: 'phosphorus',
    name: 'Phosphorus (P)',
    icon: <Beaker className="w-6 h-6 text-blue-600" />,
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop',
    idealRange: '22-56 kg/ha',
    benefits: [
      'Strengthens root development and growth',
      'Improves flowering and seed formation',
      'Boosts energy transfer within the plant'
    ],
    deficiency: [
      'Purple/dark green discoloration of leaves',
      'Weak root system, poor establishment',
      'Delayed maturity and reduced yield'
    ],
    excess: [
      'Blocks uptake of zinc and iron',
      'Can cause micronutrient deficiency',
      'Water pollution through runoff'
    ]
  },
  {
    key: 'potassium',
    name: 'Potassium (K)',
    icon: <Flame className="w-6 h-6 text-orange-600" />,
    color: 'orange',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop',
    idealRange: '135-335 kg/ha',
    benefits: [
      'Improves drought and disease resistance',
      'Enhances fruit quality, size, and taste',
      'Strengthens cell walls and stems'
    ],
    deficiency: [
      'Brown/burnt leaf edges (scorching)',
      'Weak stems, lodging in crops',
      'Poor fruit quality and small grains'
    ],
    excess: [
      'Blocks calcium and magnesium uptake',
      'Salt buildup in soil',
      'Rarely toxic but wastes money'
    ]
  },
  {
    key: 'ph',
    name: 'pH Level',
    icon: <FlaskConical className="w-6 h-6 text-purple-600" />,
    color: 'purple',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=400&h=200&fit=crop',
    idealRange: '6.0 - 7.5',
    benefits: [
      'Optimal pH ensures maximum nutrient availability',
      'Supports beneficial soil microorganisms',
      'Most crops thrive in slightly acidic to neutral soil'
    ],
    deficiency: [
      'Too acidic (< 5.5): Aluminum toxicity, poor root growth',
      'Too alkaline (> 8.0): Iron/zinc deficiency',
      'Nutrient lockout reduces fertilizer effectiveness'
    ],
    excess: []
  },
  {
    key: 'organicCarbon',
    name: 'Organic Carbon',
    icon: <ThermometerSun className="w-6 h-6 text-amber-600" />,
    color: 'amber',
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=200&fit=crop',
    idealRange: '0.5 - 1.0 %',
    benefits: [
      'Improves soil structure and water retention',
      'Feeds beneficial bacteria and earthworms',
      'Releases nutrients slowly for sustained growth'
    ],
    deficiency: [
      'Hard, compacted soil with poor drainage',
      'Low microbial activity',
      'Nutrients leach out quickly after rain'
    ],
    excess: []
  }
];

export default function SoilInput() {
  const [activeTab, setActiveTab] = useState('manual');
  const [fileLoading, setFileLoading] = useState(false);
  const [expandedNutrient, setExpandedNutrient] = useState(null);
  const navigate = useNavigate();
  const { loading: apiLoading, analyze, getCrops, getFertilizer } = useSoil();
  const { setAnalysis } = useAgri();

  const isProcessing = apiLoading || fileLoading;

  const handleSubmit = async (data) => {
    const numericData = {
      nitrogen: Number(data.nitrogen) || 150,
      phosphorus: Number(data.phosphorus) || 20,
      potassium: Number(data.potassium) || 200,
      ph: Number(data.ph) || 6.5,
      organicCarbon: Number(data.organicCarbon) || 0.5,
      crop: data.crop || 'Wheat',
      location: data.location || 'India'
    };
    localStorage.setItem('agrisaar_soil', JSON.stringify(numericData));

    const soilResult = await analyze(numericData);
    if (soilResult) {
      const cropResult = await getCrops(numericData);
      const fertResult = await getFertilizer({ ...numericData, crop: numericData.crop });

      const combinedAnalysis = {
        soil: soilResult,
        crops: cropResult,
        fertilizer: fertResult,
        inputData: numericData
      };

      setAnalysis(combinedAnalysis);

      navigate('/analysis', {
        state: combinedAnalysis
      });
    }
  };

  const toggleNutrient = (key) => {
    setExpandedNutrient(expandedNutrient === key ? null : key);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet>
        <title>Soil Analysis — AI Mitti Jaanch | AgriSaar</title>
        <meta name="description" content="Enter your soil data manually or upload a soil health card — AgriSaar AI instantly analyzes N, P, K, pH, and organic carbon levels to give smart farming recommendations." />
        <meta property="og:title" content="Soil Analysis — AI Mitti Jaanch | AgriSaar" />
        <meta property="og:description" content="Get instant AI-powered soil health reports with NPK, pH analysis and crop-specific fertilizer recommendations for Indian farmers." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="soil analysis, mitti jaanch, NPK test, soil health card, pH test, AgriSaar, Indian farming, soil report" />
      </Helmet>

      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-primary-700" /> Soil Analysis
        </h1>
        <p className="text-gray-500 mt-2">Enter your soil data or upload a report — AI will analyze it instantly</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left: Form Section */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => !isProcessing && setActiveTab('manual')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'manual' ? 'bg-primary-900 text-white shadow-md border-primary-900' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              <PenTool className="w-4 h-4" /> Manual Entry
            </button>
            <button
              onClick={() => !isProcessing && setActiveTab('upload')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-primary-900 text-white shadow-md border-primary-900' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              <UploadCloud className="w-4 h-4" /> Upload Report
            </button>
            <div className="ml-auto">
              <VoiceInput onTranscript={(text) => console.log('Voice:', text)} className="w-[140px] px-4 rounded-xl font-bold flex gap-2 !w-auto" placeholder="Speak to fill data" />
            </div>
          </div>

          <div className="card">
            {activeTab === 'manual' ? (
              <SoilForm onSubmit={handleSubmit} loading={isProcessing} />
            ) : (
              <div className="space-y-6">
                <UploadBox
                  onFileSelect={async (file) => {
                    setFileLoading(true);
                    try {
                      const formData = new FormData();
                      formData.append('document', file);
                      
                      const response = await scanSoilReport(formData);
                      
                      if (response.data?.success && response.data?.data) {
                        const ocrData = response.data.data;
                        handleSubmit({
                          nitrogen: ocrData.nitrogen,
                          phosphorus: ocrData.phosphorus,
                          potassium: ocrData.potassium,
                          ph: ocrData.ph,
                          organicCarbon: ocrData.organicCarbon,
                          crop: 'Wheat'
                        });
                      } else {
                        throw new Error("Invalid OCR response");
                      }
                    } catch (error) {
                      console.error("OCR API Error", error);
                      alert("Failed to scan report. Please try manual entry or ensure the backend is running.");
                    } finally {
                      setFileLoading(false);
                    }
                  }}
                  loading={isProcessing}
                />
                {fileLoading && (
                  <p className="text-center text-sm font-bold text-primary-600 animate-pulse bg-primary-50 py-3 rounded-xl border border-primary-100">
                    OCR Processing... Extracting data from your file...
                  </p>
                )}
                {!fileLoading && (
                  <p className="text-center text-sm text-gray-500">
                    Upload a PDF or Image — AI will automatically extract soil data via OCR
                  </p>
                )}
              </div>
            )}
          </div>

          {/* AI Soil Testing Guidance */}
          <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-600" /> Need Help Getting a Soil Report?
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-4">
              Ask our <span className="font-bold text-primary-700">KisaanAI Assistant</span> (bottom-right chat icon) for personalized guidance on where to get your soil tested near your location, including free government options and private labs.
            </p>
            <p className="text-xs text-green-700 font-bold bg-green-100 inline-block px-3 py-1.5 rounded-lg">
              Try asking: "Where can I get a free soil test near me?"
            </p>
          </div>
        </div>

        {/* Right: Nutrient Guide */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-primary-600" /> Nutrient Guide — What Each Value Means
          </h3>
          <p className="text-xs text-gray-400 font-medium mb-4">Click on any nutrient to learn about its role, benefits, and ideal range</p>

          {NUTRIENT_INFO.map((nutrient) => {
            const isExpanded = expandedNutrient === nutrient.key;
            const colorMap = {
              green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', ring: 'ring-green-200' },
              blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', ring: 'ring-blue-200' },
              orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', ring: 'ring-orange-200' },
              purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', ring: 'ring-purple-200' },
              amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', ring: 'ring-amber-200' },
            };
            const c = colorMap[nutrient.color];

            return (
              <div key={nutrient.key} className={`rounded-2xl border overflow-hidden transition-all duration-300 ${isExpanded ? `${c.border} shadow-lg ring-2 ${c.ring}` : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
                {/* Clickable Header */}
                <button
                  onClick={() => toggleNutrient(nutrient.key)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${isExpanded ? c.bg : 'bg-white hover:bg-gray-50'}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    {nutrient.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900">{nutrient.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">Ideal: {nutrient.idealRange}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="animate-fade-in">
                    {/* Image */}
                    <div className="h-32 w-full overflow-hidden">
                      <img src={nutrient.image} alt={nutrient.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="p-4 space-y-4 bg-white">
                      {/* Benefits */}
                      <div>
                        <h5 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Benefits of Proper Levels
                        </h5>
                        <ul className="space-y-1.5">
                          {nutrient.benefits.map((b, i) => (
                            <li key={i} className="text-xs text-gray-600 font-medium flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Deficiency Signs */}
                      <div>
                        <h5 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Signs of Deficiency
                        </h5>
                        <ul className="space-y-1.5">
                          {nutrient.deficiency.map((d, i) => (
                            <li key={i} className="text-xs text-gray-600 font-medium flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Excess Warning */}
                      {nutrient.excess.length > 0 && (
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                          <h5 className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1.5">Too Much? Excess Effects</h5>
                          <ul className="space-y-1">
                            {nutrient.excess.map((e, i) => (
                              <li key={i} className="text-xs text-amber-800 font-medium">• {e}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
