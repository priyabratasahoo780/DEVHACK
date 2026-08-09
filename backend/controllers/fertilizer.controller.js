import { getFertilizerPlan } from '../services/fertilizer.service.js';
import { checkFertilizerSafety } from '../services/fertilizerSafety.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export async function getFertilizerPlanController(req, res, next) {
  try {
    const { nitrogen, phosphorus, potassium, ph, organicCarbon, crop } = req.body;
    const soilData = { nitrogen, phosphorus, potassium, ph, organicCarbon };
    const result = await getFertilizerPlan(soilData, crop);
    return successResponse(res, result, 'Fertilizer plan generated');
  } catch (error) {
    next(error);
  }
}

export async function getFertilizerSafety(req, res, next) {
  try {
    const { nitrogen, phosphorus, potassium, ph, weatherSummary, crop } = req.body;
    const soilData = { nitrogen, phosphorus, potassium, ph };
    const result = await checkFertilizerSafety(soilData, weatherSummary, crop);
    return successResponse(res, result, 'Fertilizer safety check complete');
  } catch (error) {
    next(error);
  }
}
