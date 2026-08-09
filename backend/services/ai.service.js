import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import { analyzeSoil } from './soilAnalysis.service.js';
import { recommendCrops } from './cropRecommendation.service.js';
import { getFertilizerPlan } from './fertilizer.service.js';
import { getWeatherAdvisory } from './weather.service.js';
import { findSchemes } from './govScheme.service.js';

let _ai = null;
function getAI() {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error('GEMINI_API_KEY is missing in .env');
      throw new Error('GEMINI_API_KEY is missing');
    }
    _ai = new GoogleGenerativeAI(apiKey);
  }
  return _ai;
}

export async function masterAdvisor(input) {
  const { soilData, location, crop, season, farmerQuery } = input;
  const results = {};

  if (soilData) {
    results.soil = await analyzeSoil(soilData);
  }
  if (soilData && location) {
    results.crops = await recommendCrops(soilData, location, season);
  }
  if (soilData && crop) {
    results.fertilizer = await getFertilizerPlan(soilData, crop);
  }
  if (location) {
    results.weather = await getWeatherAdvisory(location);
  }
  if (location) {
    results.schemes = await findSchemes(location, crop);
  }

  const masterPrompt = `You are the MASTER AI BRAIN of Smart Farming AI. Combine ALL data and give ONE comprehensive response.

FARMER'S QUESTION: ${farmerQuery || 'Give me complete farming advice'}
LOCATION: ${location || 'Not specified'}
CROP: ${crop || 'Not decided'}

${results.soil ? `SOIL ANALYSIS:
- Health Score: ${results.soil.healthScore}/100
- Soil Type: ${results.soil.soilType}` : ''}

${results.weather ? `WEATHER: ${results.weather.current ? `${results.weather.current.temp}°C, ${results.weather.current.description}` : 'Data unavailable'}` : ''}

YOUR BEHAVIOR:
- Respond entirely in ENGLISH.
- Give practical advice the farmer can act on TODAY.
- Keep it structured and easy to read.

OUTPUT FORMAT:
1. 🌱 Soil Condition — 2-3 lines
2. 🌾 Best Crop — top recommendation
3. 🧪 Fertilizer Plan — key points
4. 🌧️ Weather Advisory — today's action
5. 💰 Market & Govt Scheme Tip
6. ✅ Final Suggestion — 1 clear action

Keep under 300 words.`;

  try {
    logger.ai('Calling Gemini MASTER MODE...');
    const model = getAI().getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(masterPrompt);
    const response = await result.response;
    return { masterAdvice: response.text(), details: results, query: farmerQuery || null };
  } catch (error) {
    logger.error(`Gemini master error: ${error.message}`);
    let fallback = `## 🌾 Smart Farming Report\n\n`;
    if (results.soil) fallback += `**Soil Score:** ${results.soil.healthScore}/100\n\n`;
    if (results.weather) fallback += `**Weather:** Check details below\n\n`;
    fallback += `_Detailed AI analysis unavailable._`;
    return { masterAdvice: fallback, details: results, query: farmerQuery || null };
  }
}

export async function recoveryAdvisor(problem, soilData) {
  const prompt = `You are a specialized crop recovery and disaster management expert for Indian farmers. Respond in English.

PROBLEM ENCOUNTERED: ${problem}
${soilData ? `SOIL DATA: N=${soilData.nitrogen}, P=${soilData.phosphorus}, K=${soilData.potassium}, pH=${soilData.ph}` : ''}

TASK: Provide a comprehensive 3-part recovery strategy.
1. Government & Insurance: Steps to claim PMFBY insurance or NDRF compensation.
2. Immediate Action: Crucial steps to take in the next 48 hours to save the land/remaining crop.
3. Recovery Crops: Suggest 2-3 specific short-duration, high-yield cash crops suitable for this situation to recover financial loss.

IMPORTANT: You MUST respond ONLY with a valid JSON object in the exact format below, with NO markdown formatting, NO backticks, NO "json" label.
{
  "compensation": {
    "title": "Government Support & Insurance",
    "steps": ["step 1", "step 2", "step 3"]
  },
  "immediateAction": {
    "title": "Immediate Actions (48 Hours)",
    "steps": ["action 1", "action 2"]
  },
  "recoveryCrops": {
    "title": "Fast Recovery Cash Crops",
    "crops": [
      { "name": "Crop Name", "duration": "xx days", "reason": "Why it works here" }
    ]
  }
}`;

  try {
    logger.ai('Calling Gemini for advanced structured recovery advice...');
    const model = getAI().getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawText = response.text().trim();
    // In case model ignores mimeType and wraps in markdown (fallback cleanup)
    if (rawText.startsWith('\`\`\`json')) {
      rawText = rawText.substring(7, rawText.length - 3).trim();
    } else if (rawText.startsWith('\`\`\`')) {
      rawText = rawText.substring(3, rawText.length - 3).trim();
    }
    
    let structuredData;
    try {
      structuredData = JSON.parse(rawText);
    } catch (parseError) {
      logger.error('Failed to parse Gemini JSON, falling back', parseError);
      throw new Error("JSON Parse failed");
    }

    return { problem, recovery: structuredData };
  } catch (error) {
    logger.error(`Gemini recovery error: ${error.message}`);
    const fallbackStructured = {
      compensation: {
        title: "Government Support & Insurance",
        steps: [
          "File PMFBY claim within 72 hours via Crop Insurance App",
          "Inform local agriculture officer about crop loss for NDRF compensation check",
          "Click photos of the damaged field as proof"
        ]
      },
      immediateAction: {
        title: "Immediate Actions (48 Hours)",
        steps: [
          "Ensure proper drainage if flooded, or retain moisture if drought",
          "Do not apply fresh chemical fertilizers immediately",
          "Clear dead plant debris to prevent pests"
        ]
      },
      recoveryCrops: {
        title: "Fast Recovery Cash Crops",
        crops: [
          { name: "Green Gram (Moong)", duration: "60 days", reason: "Fastest cash crop, requires less water" },
          { name: "Radish / Spinach", duration: "40 days", reason: "Quick harvest to get immediate cash flow" }
        ]
      }
    };
    return {
      problem,
      recovery: fallbackStructured
    };
  }
}

export async function processVoiceQuery(transcript) {
  const prompt = `You are AgriSaar Fast Voice AI for farmers. Use a professional, helpful female voice tone.

USER SPEECH: "${transcript}"

RULES:
1. Detect the language the user used. Reply in the SAME language. If Hindi, reply in Hindi. If English, reply in English. If Gujarati, reply in Gujarati.
2. Reply in the NATIVE SCRIPT of that language (e.g. Devanagari for Hindi, not Latin/Roman).
3. Keep it EXTREMELY SHORT — under 15 seconds to read aloud (2-3 sentences max).
4. Give the exact solution right away.

OUTPUT ONLY THE RESPONSE TEXT. NO INTRO. NO QUOTES.`;

  try {
    logger.ai('Calling Gemini for Voice AI...');
    const model = getAI().getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      }
    });
    const response = await result.response;
    return { success: true, advice: response.text().trim() };
  } catch (error) {
    console.error('STRICT_AI_ERROR:', error);
    logger.error(`Gemini voice error [Model: gemini-2.5-flash]: ${error.message}`);
    return { success: false, advice: `Maafi chaahte hain, AI server se jud nahi pa raha hai. Kripya thodi der baad koshish karein.` };
  }
}

export async function getNearbyFarmingInfo(lat, lon, location) {
  const currentMonth = new Date().toLocaleString('en-IN', { month: 'long' });
  const currentSeason = getSeasonName();

  const prompt = `You are a local agriculture information system for Indian farmers. Respond in English.

FARMER LOCATION: ${location || `${lat}, ${lon}`}
CURRENT MONTH: ${currentMonth}
CURRENT SEASON: ${currentSeason}

TASK: Generate a comprehensive NEARBY FARMING REPORT for this location. Include:

1. **Nearby Krishi Vigyan Kendras (KVK)**: Estimate how many KVK/agriculture advisory centers are within 50km radius. Give approximate count and name 1-2 nearest ones.

2. **Crop Advisory for this Region**: What crops are currently being grown in this area? What stage are they at (buwai, growth, harvest)?

3. **Expected Yield**: For top 2-3 crops in this region, what is the expected yield per acre this season?

4. **Current Farming Activities**: What are farmers in this region doing RIGHT NOW (this week)?

5. **Advisors Count**: Estimate total agriculture advisors, extension workers, and KVK scientists available in the nearby district.

OUTPUT FORMAT — respond in structured text:
🏛️ Nearby Advisors: [X+ KVK centers, Y+ agriculture officers in district]
🌾 Active Crops: [List crops currently growing]
📊 Growth Stage: [Stage details]
📈 Expected Yield: [Yield per acre for top crops]
🗓️ This Week: [What to do right now]
👨‍🌾 Expert Access: [How to reach nearest KVK/advisor]

Keep response under 250 words. Be specific to the location.`;

  try {
    logger.ai('Calling Gemini for nearby farming info...');
    const model = getAI().getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      location: location || `${lat}, ${lon}`,
      season: currentSeason,
      month: currentMonth,
      info: response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Gemini nearby info error: ${error.message}`);
    return {
      location: location || `${lat}, ${lon}`,
      season: currentSeason,
      month: currentMonth,
      info: `- Nearby Advisors: Please contact your district Krishi Vigyan Kendra (KVK).\n- Active Crops: Recommended cultivation based on the current season.\n- Helpline: Contact Kisan Call Center at 1800-180-1551 (Toll-Free).`,
      timestamp: new Date().toISOString()
    };
  }
}

export async function getAgroforestryAdvice(location) {
  const prompt = `You are an agroforestry (tree farming) expert for Indian farmers. Respond in English.

FARMER LOCATION: ${location || 'India'}

TASK: Identify the top 3 high-profit trees/plants for this region (e.g., Teak, Sandalwood, Bamboo, Malabar Neem).
For each, provide:
1. Estimated profit per acre after 5-10 years.
2. Ease of maintenance.
3. Market demand.
4. Soil/Water requirement.

Keep response under 250 words. Focus on maximum profit for small farmers.`;

  try {
    logger.ai('Calling Gemini for agroforestry advice...');
    const model = getAI().getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { location, advice: response.text() };
  } catch (error) {
    logger.error(`Gemini agroforestry error: ${error.message}`);
    return {
      location,
      advice: `🌲 Recommended Trees: Teak, Bamboo, and Lemon.\n💰 High Profit: Teak/Sandalwood (Long term)\n💧 Maintenance: Medium\n\n_Detailed AI report unavailable._`
    };
  }
}

export async function getBioInputIntelligence(crop) {
  const prompt = `You are an organic farming (ZBNF/Organic) expert for Indian farmers. Respond in English.

CROP: ${crop || 'General/Multi-crop'}

TASK: Provide intelligence on Bio-fertilizers and Bio-pesticides specifically for this crop.
Include:
1. One specific bio-organic recipe (e.g., Jeevamrut, Neemastra).
2. Benefits over chemical alternatives.
3. Application method.

Keep response under 200 words. Be practical and low-cost.`;

  try {
    logger.ai('Calling Gemini for bio-input intelligence...');
    const model = getAI().getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { crop, intelligence: response.text() };
  } catch (error) {
    logger.error(`Gemini bio-input error: ${error.message}`);
    return {
      crop,
      intelligence: `🌿 **Bio-Input Formula for ${crop || 'your crop'}**

### 🧪 Jeevamrut Preparation
• **Mix:** 10L Water + 1kg Cow Dung + 1L Cow Urine.
• **Add:** 100g Jaggery + Handful of farm soil.
• **Ferment:** Keep in shade for 48 hours, stir daily.

### ✅ Key Benefits
• Replaces 100% urea/DAP requirements and reduces costs.
• Vastly improves soil microbiology & natural earthworm count.
• Enhances crop taste and yield naturally.

### 📋 Application Method
• **Dilute:** 1 liter Jeevamrut per 10 liters of water.
• **Apply:** Pour or spray directly near the root zone in the evening.
• **Frequency:** Repeat every 14-15 days for optimal plant immunity.`
    };
  }
}


export async function detectDisease(imageBuffer, mimeType) {
  const prompt = `You are a professional plant pathologist and agriculture expert. Analyze this image of a plant/crop leaf.

TASK:
1. Identify the exact disease (if any).
2. Rate the confidence of your analysis.
3. Provide a brief description of the disease.
4. Give a "Chemical Treatment" (specific pesticides/fungicides available in India).
5. Give an "Organic Treatment" (low-cost, natural methods).
6. Rate the severity (Low, Medium, High).

IMPORTANT: You MUST respond ONLY with a valid JSON object in the exact format below, with NO markdown formatting, NO backticks, NO "json" label.
{
  "disease": "Disease Name",
  "confidence": "XX%",
  "severity": "High/Medium/Low",
  "action": "Immediate Action text",
  "description": "Short description of the disease",
  "treatments": ["Chemical step 1", "Chemical step 2"],
  "organic": ["Organic step 1", "Organic step 2"]
}`;

  try {
    logger.ai('Calling Gemini Vision for disease detection...');
    const model = getAI().getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType
        }
      }
    ]);

    const response = await result.response;
    let rawText = response.text().trim();
    
    // Fallback cleanup
    if (rawText.startsWith('\`\`\`json')) {
      rawText = rawText.substring(7, rawText.length - 3).trim();
    } else if (rawText.startsWith('\`\`\`')) {
      rawText = rawText.substring(3, rawText.length - 3).trim();
    }

    return JSON.parse(rawText);
  } catch (error) {
    logger.error(`Gemini disease detection error: ${error.message}`);
    // Return a structured error response that the frontend can handle
    return {
      disease: "Identification Failed",
      confidence: "0%",
      severity: "N/A",
      action: "Please retry with a clearer photo",
      description: "AI was unable to clearly identify a disease from this photo. It could be due to lighting, focus, or an unknown condition.",
      treatments: ["Check for pests manually", "Ensure proper watering"],
      organic: ["Spray neem oil if pests are visible"]
    };
  }
}

function getSeasonName() {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif (Monsoon)';
  if (month >= 11 || month <= 3) return 'Rabi (Winter)';
  return 'Zaid (Summer)';
}
