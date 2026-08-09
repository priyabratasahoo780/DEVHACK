import { Router } from 'express';
import { analyzeSoilController, getSoilHistory } from '../controllers/soil.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { validateSoilData } from '../utils/validators.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/analyze', validateRequest(validateSoilData), analyzeSoilController);
router.post('/upload', upload.single('soilReport'), analyzeSoilController);
router.get('/history', getSoilHistory);

export default router;
