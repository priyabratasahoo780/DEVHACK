import { findSchemes } from '../services/govScheme.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export async function getSchemes(req, res, next) {
  try {
    const { location, crop, farmerType } = req.body;
    const result = await findSchemes(location, crop, farmerType);
    return successResponse(res, result, 'Government schemes fetched');
  } catch (error) {
    next(error);
  }
}
