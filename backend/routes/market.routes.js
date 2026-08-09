import { Router } from 'express';
import { getMarketPrediction } from '../controllers/market.controller.js';

const router = Router();

router.post('/predict', getMarketPrediction);

export default router;
