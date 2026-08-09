import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Camera, UploadCloud, ScanLine, Leaf, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SpeakButton from '../components/SpeakButton';
import { detectDisease } from '../services/aiApi.js';

export default function DiseaseScanner() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | scanning | result | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processImage = async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    setStatus('scanning');
    setErrorMsg('');
    
    try {
      const data = await detectDisease(file);
      if (data && data.disease) {
        setResult(data);
        setStatus('result');
        toast.success("AI Analysis Complete!");
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to analyze image');
      setStatus('error');
      toast.error("Analysis failed. Please try again with a clearer photo.");
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) await processImage(file);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] py-12">
      <Helmet>
        <title>Kisaan Lens PRO — AI Crop Disease Scanner | AgriSaar</title>
        <meta name="description" content="Upload a photo of your sick crop and get instant AI diagnosis. Identifies plant diseases, pest damage, and nutrient deficiencies with treatment recommendations." />
        <meta property="og:title" content="Kisaan Lens PRO — AI Crop Disease Scanner | AgriSaar" />
        <meta property="og:description" content="AI-powered plant disease detection from a single photo. Get instant diagnosis with treatment and medicine recommendations." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="crop disease scanner, plant disease, AI diagnosis, pest detection, crop health, kisaan lens, AgriSaar" />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5 shadow-inner border-4 border-white">
            <ScanLine className="w-10 h-10 text-green-600 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Kisaan Lens <span className="text-sm align-top bg-green-500 text-white px-2 py-1 rounded shadow">PRO</span></h1>
          <p className="text-gray-600 font-medium text-lg">Take a photo of your sick crop. AI will instantly identify the disease and suggest treatment.</p>
        </div>

        {status === 'idle' && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 sm:p-12 text-center transition-all hover:shadow-2xl">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-green-200 rounded-[2rem] p-12 bg-green-50/30 hover:bg-green-50 cursor-pointer transition-all hover:border-green-400 group"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-3">Upload Leaf Photo</h2>
              <p className="text-gray-500 font-medium">Capture directly from your mobile camera or upload from gallery</p>
              
              <div className="mt-8 flex justify-center gap-4" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => cameraInputRef.current?.click()} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-600/30 hover:bg-green-700 transition-colors">
                  <Camera className="w-5 h-5" /> Open Camera
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="bg-white text-green-700 border border-green-200 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 transition-colors">
                  <UploadCloud className="w-5 h-5" /> Gallery
                </button>
              </div>
            </div>
            {/* Camera input — opens rear camera on mobile */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              ref={cameraInputRef} 
              onChange={handleImageSelect}
            />
            {/* Gallery input — opens file picker */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageSelect}
            />
          </div>
        )}

        {/* Error State with Retry */}
        {status === 'error' && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-red-100 p-8 text-center animate-fade-in">
            {image && (
              <div className="w-full max-w-xs mx-auto h-56 rounded-2xl overflow-hidden shadow-lg mb-6 border-2 border-red-200">
                <img src={image} alt="Failed scan" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-3">Analysis Failed</h2>
            <p className="text-gray-500 font-medium mb-2">{errorMsg || 'Could not identify disease from this image.'}</p>
            <p className="text-sm text-gray-400 mb-6">Tips: Use a well-lit, close-up photo of the affected leaf. Avoid blurry or distant shots.</p>
            <div className="flex justify-center gap-4">
              <button onClick={reset} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-600/30 hover:bg-green-700 transition-colors">
                <Camera className="w-5 h-5" /> Try Again
              </button>
            </div>
          </div>
        )}

        {status === 'scanning' && image && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 text-center animate-fade-in relative overflow-hidden">
            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center justify-center gap-2">
              <ScanLine className="w-6 h-6 animate-pulse text-green-500" /> AI Vision Scanning Plant Details...
            </h2>
            <div className="relative w-full max-w-sm mx-auto h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800">
              <img src={image} alt="Scanning..." className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-green-500/20" />
              
              {/* Laser Animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] animate-laser pointer-events-none" />
              
              {/* Grid overlay */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-30">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="border border-green-400/50" />
                ))}
              </div>
            </div>
            <p className="mt-6 text-gray-500 font-bold animate-pulse">Running Deep Learning Models covering 10,000+ diseases...</p>
          </div>
        )}

        {status === 'result' && result && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
            {/* Header Result */}
            <div className={`bg-gradient-to-r ${result.severity === 'High' ? 'from-red-600 to-rose-700' : 'from-orange-500 to-amber-600'} p-8 text-white relative`}>
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <AlertTriangle className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="w-32 h-32 rounded-full border-4 border-white/50 overflow-hidden shadow-2xl flex-shrink-0">
                  <img src={image} alt="Crop" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="inline-flex bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-white/30 backdrop-blur-sm">
                    AI Confidence: {result.confidence}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-2">{result.disease}</h2>
                  <p className="text-red-100 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                    <ShieldCheck className="w-5 h-5" /> Severity: {result.severity} — {result.action}
                  </p>
                  
                  <div className="mt-4">
                    <SpeakButton text={`Ye bimari ${result.disease} hai. Isey theek karne ke liye: ${result.description} Suggestion: ${result.treatments[0]}`} label="Sunne ke liye click karein" />
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Data */}
            <div className="p-8">
              <p className="text-gray-600 font-medium text-lg leading-relaxed mb-8">
                {result.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                  <h3 className="text-blue-900 font-black text-xl mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Chemical Treatment
                  </h3>
                  <ul className="space-y-4">
                    {result.treatments.map((t, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">{t}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full text-center bg-white border border-blue-200 text-blue-700 font-bold py-3 rounded-xl shadow-sm hover:bg-blue-100">
                    Find nearby Pesticide Shops
                  </button>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                  <h3 className="text-green-900 font-black text-xl mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5" /> Organic Treatment
                  </h3>
                  <ul className="space-y-4">
                    {result.organic.map((t, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">{t}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full text-center bg-green-600 text-white font-bold py-3 rounded-xl shadow-sm hover:bg-green-700 hover:shadow-lg transition-all">
                    Order Organic Formula
                  </button>
                </div>
              </div>

              <div className="mt-10 text-center">
                <button onClick={reset} className="text-gray-500 font-bold hover:text-gray-800 transition-colors inline-flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Scan Another Leaf
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Dynamic Laser Animation CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes laser {
          0% { transform: translateY(0); }
          50% { transform: translateY(20rem); }
          100% { transform: translateY(0); }
        }
        .animate-laser {
          animation: laser 2s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
