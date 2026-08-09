import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function compareMandis(crop, location, mandiPrices) {
  const mandiList = mandiPrices && mandiPrices.length > 0
    ? mandiPrices.map(m => `${m.name}: ₹${m.price}/quintal`).join('\n')
    : 'No mandi data provided';

  const prompt = `You are a live mandi (market) comparison advisor. Provide structured advice in English.

CROP: ${crop}
LOCATION: ${location}
MANDI DATA:
${mandiList}

TASK:
1. If no data, simulate realistic current prices for 2 nearest Mandis to ${location}.
2. Compare prices.
3. Recommend where to sell considering transport cost.

OUTPUT STYLE: Pointwise, clear English. Keep under 100 words.`;

  try {
    logger.ai('Calling Gemini for mandi comparison...');
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();
    return {
      crop,
      location,
      mandis: mandiPrices || [],
      comparison: aiResponse
    };
  } catch (error) {
    logger.error(`Gemini mandi error: ${error.message}`);
    return {
      crop,
      location,
      mandis: mandiPrices || [],
      comparison: `## Mandi Comparison\n\n📍 Local mandi prices check karein\n🌐 e-NAM portal: enam.gov.in pe online prices milenge\n📞 Apne area ke mandi samiti se contact karein`
    };
  }
}
