import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function checkFertilizerSafety(soilData, weatherSummary, crop) {
  const prompt = `You are a fertilizer safety expert. Give warnings in English.

SOIL DATA:
- Nitrogen: ${soilData.nitrogen} kg/ha
- Phosphorus: ${soilData.phosphorus} kg/ha
- Potassium: ${soilData.potassium} kg/ha
- pH: ${soilData.ph}

WEATHER: ${weatherSummary || 'Normal conditions'}
CROP: ${crop || 'General crop'}

SAFETY RULES:
1. Over-fertilization → soil damage, phool/phal kam aayenge
2. Rain + fertilizer → nutrients wash ho jayenge, paisa waste
3. High heat + urea → ammonia gas banti hai, fasal jal sakti hai
4. Acidic soil + ammonium fertilizer → soil aur acidic ho jayega
5. Already high nutrient → add mat karo, excess harmful hai

TASK:
1. Check if any nutrient is already too high (don't add more)
2. Check weather conditions — safe to apply or not?
3. Give specific warnings
4. Suggest best time to apply

OUTPUT:
✅ SAFE / ⚠️ CAUTION / ❌ DO NOT APPLY
[Explanation and recommendations]

Keep response under 150 words.`;

  try {
    logger.ai('Calling Gemini for safety advisor...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { safety: response.text() };
  } catch (error) {
    logger.error(`Gemini safety error: ${error.message}`);
    let msg = '⚠️ **General Safety Tips:**\n\n';
    msg += '• Split doses mein fertilizer daalein\n';
    msg += '• Baarish ke din mat daalein\n';
    msg += '• Subah ya shaam ko daalein, dopahar mein nahi\n';
    msg += '• Organic manure bhi zaroor mix karein';
    return { safety: msg };
  }
}
