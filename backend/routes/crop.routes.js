import { Router } from 'express';
import { getCropRecommendation } from '../controllers/crop.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { validateSoilData } from '../utils/validators.js';

const router = Router();

router.post('/recommend', validateRequest(validateSoilData), getCropRecommendation);

export default router;
