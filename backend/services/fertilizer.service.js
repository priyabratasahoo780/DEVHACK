import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import { FERTILIZER_MAP } from '../utils/constants.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function getFertilizerPlan(soilData, crop) {
  // Use a default empty object if soilData is missing
  const safeSoil = soilData || { nitrogen: 0, phosphorus: 0, potassium: 0, ph: 7 };

  const prompt = `You are a fertilizer expert. Respond ONLY in English. Use simple terms.

SOIL DATA:
- Nitrogen: ${safeSoil.nitrogen} kg/ha
- Phosphorus: ${safeSoil.phosphorus} kg/ha
- Potassium: ${safeSoil.potassium} kg/ha
- pH: ${safeSoil.ph}
- Organic Carbon: ${safeSoil.organicCarbon || 'N/A'}%

CROP: ${crop || 'General Crop'}

TASK:
Give a structured fertilizer plan. 

OUTPUT FORMAT: Return ONLY valid JSON inside a code block, exactly like this:
{
  "schedule": [
    { "stage": "Basal Dose", "timing": "At sowing", "actions": ["Urea 25kg/acre", "DAP 25kg/acre"] },
    { "stage": "Top Dressing", "timing": "25 Days after sowing", "actions": ["Urea 25kg/acre"] }
  ],
  "warnings": [
    "Do not apply excessive urea as it burns the soil.",
    "Always apply organic manure along with chemical fertilizers."
  ]
}`;

  try {
    logger.ai('Calling Gemini for fertilizer plan...');
    const response = await model.generateContent(prompt);
    
    // Parse the JSON blocks out of the markdown response
    const rawText = response.response.text();
    const jsonMatch = rawText.match(/```(?:json)?\n([\s\S]*?)\n```/) || rawText.match(/{[\s\S]*}/);
    const resultJson = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : null;
    
    if (resultJson) {
      return {
        requirements: buildQuickReference(safeSoil),
        schedule: resultJson.schedule,
        warnings: resultJson.warnings
      };
    }
    throw new Error('Invalid JSON from Gemini');
  } catch (error) {
    logger.error(`Gemini fertilizer error: ${error.message}`);
    return generateFallbackPlan(safeSoil, crop);
  }
}

function buildQuickReference(soil) {
  const ref = [];
  if (soil.nitrogen < 140) ref.push({ nutrient: 'Nitrogen', status: 'Low', fertilizer: FERTILIZER_MAP.nitrogen.name, dose: FERTILIZER_MAP.nitrogen.defaultDose });
  if (soil.phosphorus < 10) ref.push({ nutrient: 'Phosphorus', status: 'Low', fertilizer: FERTILIZER_MAP.phosphorus.name, dose: FERTILIZER_MAP.phosphorus.defaultDose });
  if (soil.potassium < 110) ref.push({ nutrient: 'Potassium', status: 'Low', fertilizer: FERTILIZER_MAP.potassium.name, dose: FERTILIZER_MAP.potassium.defaultDose });
  return ref;
}

function generateFallbackPlan(soil, crop) {
  const schedule = [];
  if (soil.nitrogen < 140) schedule.push({ stage: "Basal & Top", timing: "Sowing & 25 DAS", actions: ["Urea 25kg/acre"] });
  if (soil.phosphorus < 10) schedule.push({ stage: "Basal Dose", timing: "At sowing", actions: ["DAP 25kg/acre"] });
  if (soil.potassium < 110) schedule.push({ stage: "Basal Dose", timing: "At sowing", actions: ["MOP 15kg/acre"] });
  
  if (schedule.length === 0) {
    schedule.push({ stage: "Maintenance", timing: "During growth", actions: ["Standard NPK mix"] });
  }

  return {
    requirements: buildQuickReference(soil),
    schedule,
    warnings: [
      "Do not over-apply urea, it damages soil health.",
      "Always mix organic manure (FYM) around 2 ton/acre."
    ]
  };
}
