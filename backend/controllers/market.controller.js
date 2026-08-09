import { predictMarketPrice } from '../services/marketPrediction.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export async function getMarketPrediction(req, res, next) {
  try {
    const { crop, location, currentPrice, pastTrend } = req.body;
    const result = await predictMarketPrice(crop, location, currentPrice, pastTrend);
    return successResponse(res, result, 'Market prediction generated');
  } catch (error) {
    next(error);
  }
}
