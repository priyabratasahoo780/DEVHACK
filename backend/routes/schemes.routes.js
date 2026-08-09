import { Router } from 'express';
import { getSchemes } from '../controllers/schemes.controller.js';

const router = Router();

router.post('/find', getSchemes);

export default router;
