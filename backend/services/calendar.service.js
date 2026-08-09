import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function generateFarmingCalendar(crop, season, location) {
  const prompt = `You are a farming planner for Indian farmers. Give a complete farming calendar in English.

CROP: ${crop}
SEASON: ${season || 'Current season'}
LOCATION: ${location || 'India'}

TASK: Create a step-by-step farming calendar from land preparation to harvest:

1. Land Preparation (Khet taiyari) — When & How
2. Sowing (Buwai) — When, seed rate, spacing
3. First Irrigation (Pehli sinchai) — When
4. Fertilizer Application rounds — Day 0, Day 25, Day 45
5. Weeding (Kharpatwar) — When
6. Pest/Disease check — When to spray
7. Second/Third Irrigation — Schedule
8. Harvest (Katai) — When & signs of readiness

OUTPUT FORMAT:
📅 Day 1-5: [Task] — [Details]
📅 Day 15: [Task] — [Details]
... and so on

Use approximate days. Give practical tips at each stage.
Keep response under 350 words.`;

  try {
    logger.ai('Calling Gemini for crop calendar...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      crop,
      season: season || 'Current',
      location: location || 'India',
      calendar: response.text()
    };
  } catch (error) {
    logger.error(`Gemini calendar error: ${error.message}`);
    return {
      crop,
      season: season || 'Current',
      location: location || 'India',
      calendar: `## Farming Calendar for ${crop}\n\n📅 Day 1-5: Khet ki taiyari — ploughing karein\n📅 Day 6-10: Buwai/Sowing\n📅 Day 15: Pehli sinchai\n📅 Day 20-25: Urea ki pehli dose\n📅 Day 30: Weeding\n📅 Day 45: Doosri fertilizer dose\n📅 Day 60: Pest check & spray\n📅 Day 90-120: Harvest\n\n_Note: AI calendar unavailable. Ye general schedule hai._`
    };
  }
}
