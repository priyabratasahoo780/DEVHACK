import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import { GOVERNMENT_SCHEMES } from '../utils/constants.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function findSchemes(location, crop, farmerType) {
  const schemesList = GOVERNMENT_SCHEMES.map(s => 
    `- ${s.name}: ${s.amount} | ${s.benefit} | Eligibility: ${s.eligibility} | Category: ${s.category}`
  ).join('\n');

  const prompt = `You are a government scheme advisor for Indian farmers. Respond in English.

FARMER DETAILS:
- Location: ${location || 'India'}
- Crop: ${crop || 'General'}
- Farmer Type: ${farmerType || 'Small farmer'}

AVAILABLE SCHEMES:
${schemesList}

TASK:
1. Rank the top 5 most relevant schemes for this farmer
2. For each, explain WHY this scheme is good for them specifically
3. Give 2-3 step apply instructions
4. Mention if any deadline is coming soon

OUTPUT FORMAT (respond ONLY in this JSON-like text format):
For each scheme, one paragraph with:
- Scheme name
- Why it's relevant
- How to apply (2-3 steps)

Keep response under 400 words. Warm and helpful English.`;

  try {
    logger.ai('Calling Gemini for scheme recommendation...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      location: location || 'India',
      crop: crop || 'General',
      schemes: GOVERNMENT_SCHEMES,
      recommendation: response.text(),
      totalSchemes: GOVERNMENT_SCHEMES.length,
      totalBenefitValue: '₹6,000 - ₹5,00,000+'
    };
  } catch (error) {
    logger.error(`Gemini scheme error: ${error.message}`);
    return { 
      location: location || 'India', 
      crop: crop || 'General', 
      schemes: GOVERNMENT_SCHEMES, 
      recommendation: `Kshama karein, abhi direct AI recommendation available nahi hai. Lekin neeche di gayi sabhi yojanayein aapke liye labhdayak hain. Kripya list check karein.`,
      totalSchemes: GOVERNMENT_SCHEMES.length,
      totalBenefitValue: '₹6,000 - ₹5,00,000+'
    };
  }
}
