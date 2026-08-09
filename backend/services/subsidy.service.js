import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function fetchSubsidyTracker(location, farmerType) {
  const prompt = `You are a transparency and anti-corruption analyzer for Indian farmers. Output strictly in valid JSON format only, without markdown fences or extra text.

Task: Generate a highly realistic subsidy tracking report for farmers in ${location || 'India'} (${farmerType || 'General'}).

Include 3-4 major schemes. For each scheme, show:
1. "schemeName" (String)
2. "governmentReleased" (String - realistic amounts like '₹10,000' or '25 Kg Seeds')
3. "averageReceived" (String - what farmers actually get due to leaks/middlemen, like '₹6,000' or '15 Kg Seeds')
4. "leakagePercent" (Number 0-100)
5. "commonIssues" (Array of 2-3 Strings detailing the local corruption or delay issues)

JSON Schema to follow:
{
  "trackingData": [
    {
       "schemeName": "",
       "governmentReleased": "",
       "averageReceived": "",
       "leakagePercent": 0,
       "commonIssues": []
    }
  ],
  "recommendation": "Advice on how to bypass agents and apply directly in English"
}`;

  try {
    logger.ai('Calling Gemini for subsidy search...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      location: location || 'India',
      crop: farmerType || 'General',
      info: JSON.parse(response.text().replace(/```json/gi, '').replace(/```/g, '').trim()),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Gemini transparency error: ${error.message}`);
    // Fallback data
    return {
      trackingData: [
        {
           schemeName: "PM Kisan Samman Nidhi",
           governmentReleased: "₹6,000",
           averageReceived: "₹6,000",
           leakagePercent: 0,
           commonIssues: ["Bank account linking delays", "Aadhar mismatch"]
        },
        {
           schemeName: "Urea Fertilizer Subsidy",
           governmentReleased: "45 Kg Bag @ ₹266",
           averageReceived: "45 Kg Bag @ ₹400+",
           leakagePercent: 35,
           commonIssues: ["Black marketing", "Forced tagging of other products"]
        }
      ],
      recommendation: "PM Kisan line sahi chal rahi hai. Urea ke liye seedha sarkari society (PACS) se khareedein aur POS machine ka bill zaroor lein."
    };
  }
}
