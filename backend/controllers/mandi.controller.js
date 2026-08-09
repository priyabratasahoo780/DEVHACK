import { compareMandis } from '../services/mandi.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export async function getMandiComparison(req, res, next) {
  try {
    const { crop, location, mandiPrices } = req.body;
    const result = await compareMandis(crop, location, mandiPrices);
    return successResponse(res, result, 'Mandi comparison generated');
  } catch (error) {
    next(error);
  }
}
