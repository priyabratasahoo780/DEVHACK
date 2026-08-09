import { recommendCrops } from '../services/cropRecommendation.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export async function getCropRecommendation(req, res, next) {
  try {
    const { nitrogen, phosphorus, potassium, ph, organicCarbon, location, season } = req.body;
    const soilData = { nitrogen, phosphorus, potassium, ph, organicCarbon };
    const result = await recommendCrops(soilData, location, season);
    return successResponse(res, result, 'Crop recommendation generated');
  } catch (error) {
    next(error);
  }
}
