import express from 'express';
import { scanReport } from '../controllers/ocr.controller.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/ocr/scan
// Uses uploadMiddleware to accept a single file named 'document'
router.post('/scan', optionalAuth, upload.single('document'), scanReport);

export default router;
