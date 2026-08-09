import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import { SEASONS } from '../utils/constants.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  for (const [key, season] of Object.entries(SEASONS)) {
    if (season.months.includes(month)) return { key, ...season };
  }
  return { key: 'rabi', ...SEASONS.rabi };
}

export async function recommendCrops(soilData, location, season) {
  const currentSeason = season || getCurrentSeason();
  const seasonLabel = typeof currentSeason === 'string' ? currentSeason : currentSeason.label;

  const prompt = `You are a crop advisor for farmers. Respond ONLY in English. Use simple and clear terms.

SOIL DATA:
- Nitrogen: ${soilData.nitrogen} kg/ha
- Phosphorus: ${soilData.phosphorus} kg/ha
- Potassium: ${soilData.potassium} kg/ha
- pH: ${soilData.ph}
- Organic Carbon: ${soilData.organicCarbon || 'N/A'}%

LOCATION: ${location || 'India'}
SEASON: ${seasonLabel}

TASK:
Give top 3 best crops. For each crop, you MUST provide:
1. Exact Fertilizer/Khaad (e.g., Urea quantity, DAP).
2. Required "Dawai" / Pesticides (Prevention or common issue treatment).
3. Critical watering periods.
4. Total expected profit per acre.

Also provide 2 rotation crops with benefits, and 1 market trend prediction. 

OUTPUT FORMAT: Return ONLY valid JSON inside a code block, exactly like this:
{
  "topCrops": [
    { 
      "name": "Wheat", 
      "score": 90, 
      "reason": "Reason why it is good",
      "medicine": "Medicine/Pesticide name & dose",
      "fertilizer": "Fertilizer/Khaad details & amount",
      "watering": "Watering schedule",
      "profit": "Estimated profit in ₹ per acre"
    }
  ],
  "rotationCrops": [
    { "name": "Legumes", "benefit": "Fixes nitrogen in soil" }
  ],
  "marketTrends": "Wheat prices are expected to rise by 5% this season."
}`;

  try {
    logger.ai('Calling Gemini for crop recommendation...');
    // Add a 10s timeout to prevent hanging if the API key is bad or network is slow
    const generatePromise = model.generateContent(prompt);
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API timeout')), 10000));
    const response = await Promise.race([generatePromise, timeoutPromise]);
    
    // Parse the JSON blocks out of the markdown response
    const rawText = response.response.text();
    const jsonMatch = rawText.match(/```(?:json)?\n([\s\S]*?)\n```/) || rawText.match(/{[\s\S]*}/);
    const resultJson = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : null;
    
    if (resultJson) {
      return resultJson;
    }
    throw new Error('Invalid JSON from Gemini');
  } catch (error) {
    logger.error(`Gemini crop recommendation error: ${error.message}`);
    const fallbackData = generateFallbackCrops(soilData, seasonLabel);
    return fallbackData;
  }
}

function generateFallbackCrops(soil, season) {
  let topCrops = [];
  const isBalanced = soil.nitrogen >= 200 && soil.phosphorus >= 15 && soil.potassium >= 150;

  if (isBalanced) {
    topCrops = [
      { 
        name: 'Wheat', score: 85, 
        reason: 'Good balanced NPK levels',
        medicine: 'Chlorpyriphos for termites',
        fertilizer: 'DAP: 50kg, Urea: 100kg per acre',
        watering: 'CRI Stage (21 days), Flowering stage',
        profit: '₹35,000 - ₹45,000'
      },
      { 
        name: 'Rice', score: 75, 
        reason: 'Sufficient nutrients for paddy',
        medicine: 'Zinc Sulfate for Khaira disease',
        fertilizer: 'Urea: 120kg, SSP: 150kg per acre',
        watering: 'Maintain 5cm water constantly',
        profit: '₹25,000 - ₹35,000'
      },
      { 
        name: 'Maize', score: 65, 
        reason: 'Decent conditions for generic crops',
        medicine: 'Emamectin Benzoate for Fall Armyworm',
        fertilizer: 'DAP: 40kg, Urea: 80kg per acre',
        watering: 'Knee high stage, Tasseling stage',
        profit: '₹15,000 - ₹25,000'
      }
    ];
  } else if (soil.nitrogen < 140) {
    topCrops = [
      { 
        name: 'Green Gram', score: 88, 
        reason: 'Legume helps fix low nitrogen',
        medicine: 'Imidacloprid for Aphids',
        fertilizer: 'DAP: 25kg per acre',
        watering: 'Flowering & Pod filling stage',
        profit: '₹20,000 - ₹30,000'
      },
      { 
        name: 'Gram', score: 80, 
        reason: 'Needs very low nitrogen',
        medicine: 'Indoxacarb for Pod borer',
        fertilizer: 'SSP: 80kg per acre',
        watering: 'Pre-flowering stage only',
        profit: '₹22,000 - ₹32,000'
      },
      { 
        name: 'Lentil', score: 70, 
        reason: 'Drought resistant and low N requirement',
        medicine: 'Mancozeb for Wilt prevention',
        fertilizer: 'DAP: 30kg per acre',
        watering: 'One irrigation at pod formation',
        profit: '₹18,000 - ₹28,000'
      }
    ];
  } else {
    topCrops = [
      { 
        name: 'Pearl Millet', score: 80, 
        reason: 'Tolerant to harsh soil conditions',
        medicine: 'Thiram seed treatment',
        fertilizer: 'Nitrogen: 40kg per acre',
        watering: 'Tillering & Grain filling stage',
        profit: '₹12,000 - ₹18,000'
      },
      { 
        name: 'Sorghum', score: 75, 
        reason: 'Hardy crop for imbalanced soil',
        medicine: 'Dimethoate for Shoot fly',
        fertilizer: 'Urea: 60kg per acre',
        watering: 'Boot stage, Flowering stage',
        profit: '₹10,000 - ₹16,000'
      },
      { 
        name: 'Pigeon Pea', score: 60, 
        reason: 'Deep rooting crop',
        medicine: 'Monocrotophos for Pod fly',
        fertilizer: 'DAP: 40kg per acre',
        watering: 'Flower initiation stage',
        profit: '₹28,000 - ₹38,000'
      }
    ];
  }

  return {
    topCrops,
    rotationCrops: [
      { name: 'Mustard', benefit: 'Breaks pest cycle' },
      { name: 'Cowpea', benefit: 'Improves soil organic carbon' }
    ],
    marketTrends: 'Market prices generally look stable for these hardy resilient crops.'
  };
}
