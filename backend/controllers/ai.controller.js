import { masterAdvisor, recoveryAdvisor, getAgroforestryAdvice as generateAgroforestry, getBioInputIntelligence as generateBioInput, detectDisease as identifyDisease } from '../services/ai.service.js';
import { generateFarmingCalendar } from '../services/calendar.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export async function getMasterAdvice(req, res, next) {
  try {
    const result = await masterAdvisor(req.body);
    return successResponse(res, result, 'Master advice generated');
  } catch (error) {
    next(error);
  }
}

export async function getRecoveryAdvice(req, res, next) {
  try {
    const { problem, soilData } = req.body;
    const result = await recoveryAdvisor(problem, soilData);
    return successResponse(res, result, 'Recovery advice generated');
  } catch (error) {
    next(error);
  }
}

export async function getCalendar(req, res, next) {
  try {
    const { crop, season, location } = req.body;
    const result = await generateFarmingCalendar(crop, season, location);
    return successResponse(res, result, 'Farming calendar generated');
  } catch (error) {
    next(error);
  }
}

export async function getAgroforestry(req, res, next) {
  try {
    const { location } = req.body;
    const result = await generateAgroforestry(location);
    return successResponse(res, result, 'Agroforestry advice generated');
  } catch (error) {
    next(error);
  }
}

export async function getBioInput(req, res, next) {
  try {
    const { crop } = req.body;
    const result = await generateBioInput(crop);
    return successResponse(res, result, 'Bio-input intelligence generated');
  } catch (error) {
    next(error);
  }
}

export async function getDiseaseDetection(req, res, next) {
  try {
    if (!req.file) throw new Error('Image file is missing');
    const result = await identifyDisease(req.file.buffer, req.file.mimetype);
    return successResponse(res, result, 'Disease detection complete');
  } catch (error) {
    next(error);
  }
}
