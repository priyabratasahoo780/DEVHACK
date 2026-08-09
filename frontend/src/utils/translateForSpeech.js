/**
 * Translates English farming text to the target language for speech.
 * Handles: word translation, number-to-words, currency, percentages.
 * Goal: Speech should sound like a real person speaking that language.
 */

// ─── NUMBER TO HINDI WORDS ───────────────────────────
const HINDI_ONES = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
  'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस',
  'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
  'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास',
  'इक्यावन', 'बावन', 'तिरपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ', 'साठ',
  'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर', 'सत्तर',
  'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी', 'अस्सी',
  'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी', 'नब्बे',
  'इक्यानबे', 'बानबे', 'तिरानबे', 'चौरानबे', 'पंचानबे', 'छियानबे', 'सत्तानबे', 'अट्ठानबे', 'निन्यानबे'
];

function numberToHindi(num) {
  if (num === 0) return 'शून्य';
  if (num < 0) return 'ऋण ' + numberToHindi(-num);
  
  let result = '';
  
  if (num >= 10000000) {
    result += numberToHindi(Math.floor(num / 10000000)) + ' करोड़ ';
    num %= 10000000;
  }
  if (num >= 100000) {
    result += numberToHindi(Math.floor(num / 100000)) + ' लाख ';
    num %= 100000;
  }
  if (num >= 1000) {
    result += numberToHindi(Math.floor(num / 1000)) + ' हज़ार ';
    num %= 1000;
  }
  if (num >= 100) {
    result += HINDI_ONES[Math.floor(num / 100)] + ' सौ ';
    num %= 100;
  }
  if (num > 0 && num < 100) {
    result += HINDI_ONES[num];
  }
  
  return result.trim();
}

// ─── MARATHI NUMBER WORDS (uses same Indian system) ───
function numberToMarathi(num) {
  // Simplified: use Hindi number words structure with Marathi connectors
  const hindiWords = numberToHindi(num);
  return hindiWords
    .replace('हज़ार', 'हजार')
    .replace('शून्य', 'शून्य');
}

// ─── WORD DICTIONARIES ───────────────────────────────
const DICT = {
  hi: {
    'farmer': 'किसान', 'farmers': 'किसानों', 'farming': 'खेती',
    'wheat': 'गेहूँ', 'rice': 'चावल', 'cotton': 'कपास', 'maize': 'मक्का',
    'soybean': 'सोयाबीन', 'mustard': 'सरसों', 'tomato': 'टमाटर',
    'potato': 'आलू', 'onion': 'प्याज', 'sugarcane': 'गन्ना', 'gram': 'चना',
    'bajra': 'बाजरा', 'bamboo': 'बांस', 'teak': 'सागौन', 'sandalwood': 'चंदन',
    'crop': 'फसल', 'crops': 'फसलें', 'soil': 'मिट्टी', 'water': 'पानी',
    'rain': 'बारिश', 'rainfall': 'वर्षा', 'weather': 'मौसम', 'season': 'मौसम',
    'market': 'बाज़ार', 'mandi': 'मंडी', 'price': 'कीमत', 'prices': 'कीमतें',
    'sell': 'बेचें', 'buy': 'खरीदें', 'hold': 'रुकें', 'wait': 'इंतज़ार करें',
    'profit': 'मुनाफ़ा', 'loss': 'नुकसान', 'income': 'आय', 'investment': 'निवेश',
    'fertilizer': 'खाद', 'pesticide': 'कीटनाशक', 'irrigation': 'सिंचाई',
    'harvest': 'फसल कटाई', 'sowing': 'बुआई', 'yield': 'उपज',
    'government': 'सरकार', 'scheme': 'योजना', 'schemes': 'योजनाएँ',
    'subsidy': 'सब्सिडी', 'loan': 'ऋण', 'insurance': 'बीमा', 'pension': 'पेंशन',
    'benefit': 'लाभ', 'eligibility': 'पात्रता', 'documents': 'दस्तावेज़',
    'aadhaar': 'आधार', 'land': 'ज़मीन', 'hectare': 'हेक्टेयर',
    'quintal': 'क्विंटल', 'acre': 'एकड़',
    'uptrend': 'तेज़ी', 'downtrend': 'मंदी', 'stable': 'स्थिर',
    'temperature': 'तापमान', 'humidity': 'नमी', 'moisture': 'नमी',
    'organic': 'जैविक', 'seed': 'बीज', 'seeds': 'बीज',
    'storage': 'भंडारण', 'cold storage': 'शीत भंडारण',
    'demand': 'माँग', 'supply': 'आपूर्ति',
    'current price': 'वर्तमान कीमत', 'market price': 'बाज़ार भाव',
    'market update': 'बाज़ार अपडेट',
    'sell now': 'अभी बेचें', 'hold and wait': 'रुकें और इंतज़ार करें',
    'hold \u0026 wait': 'रुकें और इंतज़ार करें',
    'expert tip': 'विशेषज्ञ सुझाव', 'suggestion': 'सुझाव',
    'analysis': 'विश्लेषण', 'recommendation': 'सिफ़ारिश',
    'apply now': 'अभी आवेदन करें', 'official portal': 'आधिकारिक पोर्टल',
    'per year': 'प्रति वर्ष', 'per month': 'प्रति माह',
    'return': 'रिटर्न', 'growth': 'विकास',
    'increase': 'बढ़ोतरी', 'decrease': 'कमी',
    'likely': 'संभावित', 'possible': 'संभव',
    'detected': 'पाया गया', 'update': 'अपडेट',
    'today': 'आज', 'yesterday': 'कल', 'week': 'हफ़्ता',
    'accuracy': 'सटीकता', 'confidence': 'विश्वसनीयता',
    'positive': 'सकारात्मक', 'negative': 'नकारात्मक',
    'momentum': 'गति', 'surplus': 'अतिरिक्त',
    'inventory': 'स्टॉक', 'volatility': 'अस्थिरता',
    'capital': 'पूँजी', 'required': 'आवश्यक',
    'drop': 'गिरावट', 'variation': 'उतार-चढ़ाव',
    'executing': 'चला रहे हैं', 'protects': 'बचाता है',
    'rapid': 'तेज़', 'holding': 'रखने से', 'better': 'बेहतर',
    'returns': 'मुनाफ़ा', 'liquidate': 'बेच दें',
    'properly': 'सही तरीके से', 'recommended': 'सुझाया गया',
    'perishable': 'जल्दी खराब होने वाला', 'essential': 'ज़रूरी',
    'premium': 'अच्छा दाम', 'grading': 'ग्रेडिंग',
    'contaminated': 'दूषित', 'separate': 'अलग करें',
    'store': 'रखें', 'dry': 'सूखा', 'place': 'जगह',
    'peaks': 'ऊँचाई पर होती है', 'below': 'से कम',
    'sun-dry': 'धूप में सुखाएँ', 'before': 'पहले', 'selling': 'बेचने',
    'oil mills': 'तेल मिलें', 'pay': 'देती हैं', 'content': 'मात्रा',
    'high': 'ज़्यादा', 'low': 'कम',
    'industrial': 'औद्योगिक', 'poultry': 'मुर्गी पालन',
    'feed': 'चारा', 'starch': 'स्टार्च',
    'cure': 'सुखाना', 'watch': 'ध्यान', 'export': 'निर्यात',
    'restrictions': 'प्रतिबंध', 'off-season': 'ऑफ-सीज़न',
    'peak rates': 'सबसे ऊँचे दाम',
  },
  mr: {
    'farmer': 'शेतकरी', 'farmers': 'शेतकऱ्यांना', 'farming': 'शेती',
    'wheat': 'गहू', 'rice': 'तांदूळ', 'cotton': 'कापूस', 'maize': 'मका',
    'tomato': 'टोमॅटो', 'potato': 'बटाटा', 'onion': 'कांदा',
    'crop': 'पीक', 'crops': 'पिके', 'soil': 'माती', 'water': 'पाणी',
    'market': 'बाजार', 'price': 'किंमत', 'sell': 'विका',
    'government': 'सरकार', 'scheme': 'योजना', 'benefit': 'फायदा',
    'quintal': 'क्विंटल', 'demand': 'मागणी', 'supply': 'पुरवठा',
    'today': 'आज', 'storage': 'साठवण',
  },
  bn: {
    'farmer': 'কৃষক', 'farming': 'চাষ', 'wheat': 'গম', 'rice': 'ধান',
    'crop': 'ফসল', 'soil': 'মাটি', 'water': 'জল', 'market': 'বাজার',
    'price': 'দাম', 'government': 'সরকার', 'scheme': 'প্রকল্প',
    'sell': 'বিক্রি করুন', 'today': 'আজ',
  },
  ta: {
    'farmer': 'விவசாயி', 'farming': 'விவசாயம்', 'rice': 'அரிசி',
    'crop': 'பயிர்', 'soil': 'மண்', 'water': 'நீர்', 'market': 'சந்தை',
    'price': 'விலை', 'government': 'அரசு', 'today': 'இன்று',
  },
  te: {
    'farmer': 'రైతు', 'farming': 'వ్యవసాయం', 'rice': 'బియ్యం',
    'crop': 'పంట', 'soil': 'నేల', 'water': 'నీరు', 'market': 'మార్కెట్',
    'price': 'ధర', 'government': 'ప్రభుత్వం', 'today': 'ఈరోజు',
  },
  gu: {
    'farmer': 'ખેડૂત', 'farming': 'ખેતી', 'wheat': 'ઘઉં', 'cotton': 'કપાસ',
    'crop': 'પાક', 'soil': 'જમીન', 'water': 'પાણી', 'market': 'બજાર',
    'price': 'ભાવ', 'government': 'સરકાર', 'today': 'આજે',
  },
  pa: {
    'farmer': 'ਕਿਸਾਨ', 'farming': 'ਖੇਤੀ', 'wheat': 'ਕਣਕ', 'rice': 'ਚੌਲ',
    'crop': 'ਫ਼ਸਲ', 'soil': 'ਮਿੱਟੀ', 'water': 'ਪਾਣੀ', 'market': 'ਮੰਡੀ',
    'price': 'ਭਾਅ', 'government': 'ਸਰਕਾਰ', 'today': 'ਅੱਜ',
  },
};

// ─── CURRENCY LABELS ─────────────────────────────────
const CURRENCY_WORD = {
  hi: 'रुपये', mr: 'रुपये', bn: 'টাকা', ta: 'ரூபாய்',
  te: 'రూపాయలు', gu: 'રૂપિયા', pa: 'ਰੁਪਏ', en: 'rupees'
};

const PERCENT_WORD = {
  hi: 'प्रतिशत', mr: 'टक्के', bn: 'শতাংশ', ta: 'சதவீதம்',
  te: 'శాతం', gu: 'ટકા', pa: 'ਫ਼ੀਸਦ', en: 'percent'
};

// ─── NUMBER CONVERTER (dispatches to right language) ──
function numberToWords(num, lang) {
  if (lang === 'hi' || lang === 'mr') return numberToHindi(num);
  // For other Indian languages, still use Hindi numbers (widely understood)
  // since full number systems for each language are very complex
  if (['bn', 'ta', 'te', 'gu', 'pa'].includes(lang)) return numberToHindi(num);
  return null; // English — let TTS handle natively
}

/**
 * Main export: Translates English text to the target language for natural speech.
 * Converts: words, ₹ amounts, percentages, plain numbers.
 */
export default function translateForSpeech(text, langCode) {
  if (!text || langCode === 'en') return text;
  
  let result = text;

  // 1. Convert ₹ currency amounts: ₹2,385 → दो हज़ार तीन सौ पचासी रुपये
  result = result.replace(/₹\s?([\d,]+(?:\.\d+)?)/g, (_, numStr) => {
    const num = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(num)) return _;
    
    const intPart = Math.floor(num);
    const words = numberToWords(intPart, langCode);
    if (!words) return _;
    
    return words + ' ' + (CURRENCY_WORD[langCode] || 'रुपये');
  });

  // 2. Convert Lakh/Crore text patterns: "1.5 Crore" → "डेढ़ करोड़"
  result = result.replace(/(\d+(?:\.\d+)?)\s*(?:crore|करोड़)/gi, (_, numStr) => {
    const n = parseFloat(numStr);
    if (langCode === 'hi' || langCode === 'mr') {
      if (n === 1.5) return 'डेढ़ करोड़';
      if (n === 2.5) return 'ढाई करोड़';
      return numberToHindi(n) + ' करोड़';
    }
    return _;
  });
  
  result = result.replace(/(\d+(?:\.\d+)?)\s*(?:lakh|लाख)/gi, (_, numStr) => {
    const n = parseFloat(numStr);
    if (langCode === 'hi' || langCode === 'mr') {
      if (n === 1.5) return 'डेढ़ लाख';
      if (n === 2.5) return 'ढाई लाख';
      return numberToHindi(n) + ' लाख';
    }
    return _;
  });

  // 3. Convert percentages: 1.3% → एक दशमलव तीन प्रतिशत
  result = result.replace(/([\d.]+)\s*%/g, (_, numStr) => {
    const n = parseFloat(numStr);
    if (isNaN(n)) return _;
    
    if (langCode === 'hi' || langCode === 'mr') {
      const parts = numStr.split('.');
      let spoken = numberToHindi(parseInt(parts[0]));
      if (parts[1]) {
        spoken += ' दशमलव ';
        // Read each digit after decimal
        for (const d of parts[1]) {
          spoken += HINDI_ONES[parseInt(d)] + ' ';
        }
      }
      return spoken.trim() + ' ' + (PERCENT_WORD[langCode] || 'प्रतिशत');
    }
    return _;
  });

  // 4. Convert standalone numbers (not already converted): 2275 → दो हज़ार दो सौ पचहत्तर
  result = result.replace(/\b(\d{2,})\b/g, (match) => {
    const num = parseInt(match);
    if (isNaN(num) || num > 99999999) return match;
    const words = numberToWords(num, langCode);
    return words || match;
  });

  // 5. Word-level translation (longest phrases first)
  const dict = DICT[langCode];
  if (dict) {
    const entries = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
    for (const [eng, translated] of entries) {
      const regex = new RegExp(`\\b${eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      result = result.replace(regex, translated);
    }
  }

  return result;
}
