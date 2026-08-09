import { useState, useRef } from 'react';
import { Mic, MicOff, Loader2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

/**
 * ADVANCED SOIL VOICE PARSER
 * 
 * Handles natural speech patterns like:
 * - "nitrogen 240, phosphorus 18, potassium 200, ph 6.5"
 * - "meri mitti mein nitrogen 240 hai, phosphorus 18, potash 200, ph 6.5"
 * - "mera nitrogen do sau chalees hai"
 * - "mitti ka ph 6.5 hai, nitrogen 240, phosphorus abhi 18 hai"
 * - "mere khet ka nitrogen 240, phosphorus 18 aur potassium 200 hai"
 * - "lal mitti hai, nitrogen 250, phosphorus 20, potassium 180"
 * - "domat mitti, N 240, P 18, K 200, pH 6.5"
 * - Hindi numbers: "do sau chalees" → 240
 */

// Hindi number word → digit converter
const HINDI_NUM_MAP = {
  'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5, 'panch': 5,
  'chhe': 6, 'che': 6, 'saat': 7, 'aath': 8, 'nau': 9, 'das': 10,
  'gyarah': 11, 'barah': 12, 'terah': 13, 'chaudah': 14, 'pandrah': 15,
  'solah': 16, 'satrah': 17, 'atharah': 18, 'athaara': 18, 'unees': 19,
  'bees': 20, 'pachees': 25, 'tees': 30, 'paintees': 35, 'chalees': 40,
  'pachaas': 50, 'saath': 60, 'sattar': 70, 'assi': 80, 'nabbe': 90,
  'sau': 100, 'do sau': 200, 'teen sau': 300, 'char sau': 400,
  'paanch sau': 500, 'chhe sau': 600, 'saat sau': 700,
  'hazaar': 1000, 'hazar': 1000,
  'point': '.', 'dasamlav': '.'
};

// Soil type detection keywords (Hindi + English)
const SOIL_TYPES = [
  { keywords: ['domat', 'loam', 'domat mitti', 'loamy'], type: 'Loamy (Domat)', color: 'emerald' },
  { keywords: ['chikni', 'clay', 'chikni mitti', 'clayey', 'chipchipa'], type: 'Clay (Chikni)', color: 'amber' },
  { keywords: ['balui', 'sandy', 'ret', 'reti', 'retili', 'balu', 'sandy soil'], type: 'Sandy (Balui)', color: 'yellow' },
  { keywords: ['lal', 'red', 'lal mitti', 'laterite', 'red soil'], type: 'Red (Lal Mitti)', color: 'red' },
  { keywords: ['kaali', 'kali', 'black', 'black soil', 'regur', 'black cotton'], type: 'Black (Kaali/Regur)', color: 'gray' },
  { keywords: ['alluvial', 'jalloth', 'jalodh', 'nadiyon ki mitti'], type: 'Alluvial (Jalodh)', color: 'blue' },
  { keywords: ['peaty', 'daldali', 'marshy'], type: 'Peaty (Daldali)', color: 'teal' },
];

function parseHindiNumber(text) {
  // First try: direct numeric
  const directMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (directMatch) return parseFloat(directMatch[1]);

  // Second try: Hindi number words
  let result = 0;
  const words = text.toLowerCase().split(/\s+/);
  let decimalPart = '';
  let inDecimal = false;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const twoWord = i < words.length - 1 ? `${word} ${words[i + 1]}` : '';
    
    if (word === 'point' || word === 'dasamlav') {
      inDecimal = true;
      continue;
    }
    
    if (HINDI_NUM_MAP[twoWord] !== undefined && typeof HINDI_NUM_MAP[twoWord] === 'number') {
      if (inDecimal) {
        decimalPart += HINDI_NUM_MAP[twoWord];
      } else {
        result += HINDI_NUM_MAP[twoWord];
      }
      i++; // skip next word
      continue;
    }
    
    if (HINDI_NUM_MAP[word] !== undefined && typeof HINDI_NUM_MAP[word] === 'number') {
      if (inDecimal) {
        decimalPart += HINDI_NUM_MAP[word];
      } else {
        if (HINDI_NUM_MAP[word] === 100 && result > 0) {
          result *= 100;
        } else if (HINDI_NUM_MAP[word] === 1000 && result > 0) {
          result *= 1000;
        } else {
          result += HINDI_NUM_MAP[word];
        }
      }
    }
  }

  if (decimalPart) {
    return parseFloat(`${result}.${decimalPart}`);
  }
  return result || null;
}

function parseSoilFromVoice(text) {
  const lower = text.toLowerCase().replace(/[,\.]+\s/g, ', ');
  const result = {};

  // ========== SOIL TYPE DETECTION ==========
  for (const st of SOIL_TYPES) {
    for (const kw of st.keywords) {
      if (lower.includes(kw)) {
        result.soilType = st.type;
        result.soilTypeColor = st.color;
        break;
      }
    }
    if (result.soilType) break;
  }

  // ========== NITROGEN ==========
  const nPatterns = [
    /(?:nitrogen|naitrojan|n)\s*(?:ka level|level|hai|is|=|:)?\s*(\d+(?:\.\d+)?)/,
    /(?:nitrogen|naitrojan|n)\s+(.+?)(?:\s*(?:hai|,|$|\.|phosph|potash|ph|organ))/,
  ];
  for (const pattern of nPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const val = parseHindiNumber(match[1]);
      if (val && val > 0 && val < 1000) { result.nitrogen = val; break; }
    }
  }

  // ========== PHOSPHORUS ==========
  const pPatterns = [
    /(?:phosphorus|phosphors|fosfor|p\b)\s*(?:ka level|level|hai|is|=|:)?\s*(\d+(?:\.\d+)?)/,
    /(?:phosphorus|phosphors|fosfor)\s+(.+?)(?:\s*(?:hai|,|$|\.|potash|nitrogen|ph|organ))/,
  ];
  for (const pattern of pPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const val = parseHindiNumber(match[1]);
      if (val && val > 0 && val < 500) { result.phosphorus = val; break; }
    }
  }

  // ========== POTASSIUM ==========
  const kPatterns = [
    /(?:potassium|potash|k\b)\s*(?:ka level|level|hai|is|=|:)?\s*(\d+(?:\.\d+)?)/,
    /(?:potassium|potash)\s+(.+?)(?:\s*(?:hai|,|$|\.|phosph|nitrogen|ph|organ))/,
  ];
  for (const pattern of kPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const val = parseHindiNumber(match[1]);
      if (val && val > 0 && val < 1000) { result.potassium = val; break; }
    }
  }

  // ========== pH ==========
  const phPatterns = [
    /(?:ph|p\.h\.|p h|ph level|ph ka)\s*(?:level|hai|is|=|:)?\s*(\d+(?:\.\d+)?)/,
    /(?:ph|p\.h\.)\s+(.+?)(?:\s*(?:hai|,|$|\.|nitrogen|phosph|potash|organ))/,
  ];
  for (const pattern of phPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const val = parseHindiNumber(match[1]);
      if (val && val > 0 && val <= 14) { result.ph = val; break; }
    }
  }

  // ========== ORGANIC CARBON ==========
  const ocPatterns = [
    /(?:organic carbon|carbon|oc|organic)\s*(?:hai|is|=|:)?\s*(\d+(?:\.\d+)?)/,
    /(?:organic carbon|carbon|oc)\s+(.+?)(?:\s*(?:hai|,|$|\.))/,
  ];
  for (const pattern of ocPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const val = parseHindiNumber(match[1]);
      if (val && val >= 0 && val <= 10) { result.organicCarbon = val; break; }
    }
  }

  // ========== LOCATION ==========
  const locPatterns = [
    /(?:location|jagah|khet|from|se|jila|district|state|gaon|village|mera)\s*(?:hai|is|ka|ki|mein)?\s*([a-zA-Z\u0900-\u097F\s]+?)(?:\s*(?:,|$|\.|nitrogen|phosph|potash|ph|mitti|soil))/i,
  ];
  for (const pattern of locPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const locCandidate = match[1].trim();
      if (locCandidate.length > 1 && locCandidate.length < 50) {
        result.location = locCandidate;
        break;
      }
    }
  }

  // ========== CROP ==========
  const cropPatterns = [
    /(?:crop|fasal|ugata|bota|ugana|laga raha)\s*(?:hai|is|=|:)?\s*([a-zA-Z\u0900-\u097F\s]+?)(?:\s*(?:,|$|\.))/i,
  ];
  for (const pattern of cropPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const cropCandidate = match[1].trim();
      if (cropCandidate.length > 1 && cropCandidate.length < 30) {
        result.crop = cropCandidate;
        break;
      }
    }
  }

  // ========== AUTO-DETECT CROP FROM COMMON NAMES ==========
  if (!result.crop) {
    const cropKeywords = {
      'wheat': 'Wheat', 'gehun': 'Wheat', 'gehu': 'Wheat',
      'rice': 'Rice', 'chawal': 'Rice', 'dhan': 'Rice', 'paddy': 'Rice',
      'makka': 'Maize', 'maize': 'Maize', 'corn': 'Maize', 'maka': 'Maize', 'makki': 'Maize',
      'cotton': 'Cotton', 'kapas': 'Cotton', 'kapaa': 'Cotton',
      'soybean': 'Soybean', 'soya': 'Soybean',
      'mustard': 'Mustard', 'sarson': 'Mustard', 'rai': 'Mustard',
      'sugarcane': 'Sugarcane', 'ganna': 'Sugarcane',
      'bajra': 'Bajra', 'bajri': 'Bajra',
      'chana': 'Gram', 'gram': 'Gram',
      'moong': 'Moong', 'mung': 'Moong',
      'tur': 'Tur', 'arhar': 'Tur',
      'potato': 'Potato', 'aalu': 'Potato', 'aloo': 'Potato',
      'onion': 'Onion', 'pyaaz': 'Onion', 'pyaj': 'Onion',
      'tomato': 'Tomato', 'tamatar': 'Tomato',
    };
    for (const [kw, crop] of Object.entries(cropKeywords)) {
      if (lower.includes(kw)) {
        result.crop = crop;
        break;
      }
    }
  }

  return result;
}

export default function VoiceButton({ onResult, onParsedSoil, lang = 'hi-IN' }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  const [supported] = useState('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!supported) {
      setError('Voice input is not supported in this browser. Please use Chrome.');
      return;
    }

    setError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy

    recognition.onstart = () => { 
      setListening(true); 
      setTranscript(''); 
      setParsed(null);
      setError('');
    };
    
    recognition.onend = () => setListening(false);
    
    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === 'no-speech') {
        setError('No speech detected. Please speak clearly near the microphone. Example: "Nitrogen 240, Phosphorus 18, Potassium 200, pH 6.5"');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permission in your browser settings.');
      } else if (event.error === 'audio-capture') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (event.error === 'network') {
        setError('Internet connection required for voice recognition. Please check your network.');
      } else {
        setError('Could not understand. Please speak slowly and clearly. Say: "Nitrogen 200, Phosphorus 20, Potassium 180"');
      }
    };

    recognition.onresult = (event) => {
      // Try all alternatives for best parse result
      let bestText = event.results[0][0].transcript;
      let bestParsed = parseSoilFromVoice(bestText);
      let bestCount = Object.keys(bestParsed).filter(k => k !== 'soilType' && k !== 'soilTypeColor').length;

      for (let i = 1; i < event.results[0].length; i++) {
        const altText = event.results[0][i].transcript;
        const altParsed = parseSoilFromVoice(altText);
        const altCount = Object.keys(altParsed).filter(k => k !== 'soilType' && k !== 'soilTypeColor').length;
        if (altCount > bestCount) {
          bestText = altText;
          bestParsed = altParsed;
          bestCount = altCount;
        }
      }

      setTranscript(bestText);
      setParsed(bestParsed);

      // If voice was recognized but no soil data was parsed
      if (bestCount === 0) {
        setError('Voice heard but no soil values detected. Please say clearly: "Nitrogen 240, Phosphorus 18, Potassium 200, pH 6.5" — say each nutrient name followed by its number.');
      }
      
      // Send parsed data upstream
      if (onParsedSoil && Object.keys(bestParsed).filter(k => k !== 'soilType' && k !== 'soilTypeColor').length > 0) {
        onParsedSoil(bestParsed);
      }
      
      // Also pass raw transcript
      onResult?.(bestText);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  if (!supported) return null;

  const parsedKeys = parsed ? Object.keys(parsed).filter(k => k !== 'soilType' && k !== 'soilTypeColor') : [];
  const hasNPK = parsed?.nitrogen && parsed?.phosphorus && parsed?.potassium;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={listening ? stopListening : startListening}
        className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-bold text-sm
          ${listening
            ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
            : 'bg-primary-100 text-primary-800 hover:bg-primary-200 hover:shadow-md'
          }`}
        title="Speak your soil data: nitrogen 240, phosphorus 18, potassium 200, ph 6.5"
      >
        {listening ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Listening... Tap to stop</>
        ) : (
          <><Mic className="w-5 h-5" /> Speak Soil Data</>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 p-3 rounded-xl text-xs border border-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-bold">{error}</p>
        </div>
      )}

      {/* Transcript + Parsed Results */}
      {transcript && (
        <div className="bg-primary-50 p-4 rounded-xl text-xs border border-primary-100 animate-in fade-in space-y-3">
          {/* Raw transcript */}
          <div>
            <p className="font-extrabold text-primary-800 mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> You said:
            </p>
            <p className="text-gray-700 italic font-medium">"{transcript}"</p>
          </div>

          {/* Soil Type Badge */}
          {parsed?.soilType && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Soil Type:</span>
              <span className={`bg-${parsed.soilTypeColor}-100 text-${parsed.soilTypeColor}-800 px-3 py-1 rounded-lg font-extrabold text-xs border border-${parsed.soilTypeColor}-200`}>
                {parsed.soilType}
              </span>
            </div>
          )}

          {/* Parsed Nutrient Badges */}
          {parsedKeys.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {parsed.nitrogen && <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-lg font-extrabold text-[11px] border border-green-200">N: {parsed.nitrogen}</span>}
              {parsed.phosphorus && <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg font-extrabold text-[11px] border border-blue-200">P: {parsed.phosphorus}</span>}
              {parsed.potassium && <span className="bg-orange-100 text-orange-800 px-2.5 py-1 rounded-lg font-extrabold text-[11px] border border-orange-200">K: {parsed.potassium}</span>}
              {parsed.ph && <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg font-extrabold text-[11px] border border-purple-200">pH: {parsed.ph}</span>}
              {parsed.organicCarbon && <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-extrabold text-[11px] border border-amber-200">OC: {parsed.organicCarbon}%</span>}
              {parsed.crop && <span className="bg-teal-100 text-teal-800 px-2.5 py-1 rounded-lg font-extrabold text-[11px] border border-teal-200">Crop: {parsed.crop}</span>}
              {parsed.location && <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg font-extrabold text-[11px] border border-indigo-200">Location: {parsed.location}</span>}
            </div>
          )}

          {/* Auto-submit indicator */}
          {hasNPK && (
            <div className="flex items-center gap-1.5 text-green-700 font-bold text-[11px] bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <CheckCircle2 className="w-4 h-4" />
              N, P, K detected — Auto-analyzing your soil...
            </div>
          )}

          {/* Missing data hint */}
          {!hasNPK && parsedKeys.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px] bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              Need at least Nitrogen, Phosphorus & Potassium. Try again with all 3 values.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
