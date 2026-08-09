import { analyzeSoil } from '../services/soilAnalysis.service.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { SoilReportModel } from '../models/SoilReport.js';

export async function analyzeSoilController(req, res, next) {
  try {
    const { nitrogen, phosphorus, potassium, ph, organicCarbon, location } = req.body;
    const result = await analyzeSoil({ nitrogen, phosphorus, potassium, ph, organicCarbon, location });
    SoilReportModel.create({ ...req.body, healthScore: result.healthScore, analysis: result.analysis, soilType: result.soilType });
    return successResponse(res, result, 'Soil analysis complete');
  } catch (error) {
    next(error);
  }
}

export async function getSoilHistory(req, res, next) {
  try {
    const reports = SoilReportModel.findAll();
    return successResponse(res, reports, 'Soil reports fetched');
  } catch (error) {
    next(error);
  }
}
