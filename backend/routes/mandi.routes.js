import { Router } from 'express';
import { getMandiComparison } from '../controllers/mandi.controller.js';

const router = Router();

router.post('/compare', getMandiComparison);

export default router;
