import { Router } from 'express';
import { getFertilizerPlanController, getFertilizerSafety } from '../controllers/fertilizer.controller.js';

const router = Router();

router.post('/plan', getFertilizerPlanController);
router.post('/safety', getFertilizerSafety);

export default router;
