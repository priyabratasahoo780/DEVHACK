import express from 'express';
import { fetchSubsidyTracker } from '../services/subsidy.service.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.post('/track', async (req, res) => {
  try {
    const { location, farmerType } = req.body;
    const data = await fetchSubsidyTracker(location, farmerType);
    return successResponse(res, data, 'Transparency tracking data fetched successfully');
  } catch (error) {
    logger.error('Transparency Route Error: ' + error.message);
    return errorResponse(res, 'Failed to fetch transparency tracking data');
  }
});

// A mock route to report grievances
router.post('/report', (req, res) => {
  const { schemeName, issueDescription } = req.body;
  logger.info(`Grievance Reported - Scheme: ${schemeName}, Issue: ${issueDescription}`);
  // In a real database, we'd save this to MongoDB/Supabase.
  return successResponse(res, { trackingId: 'GRV-' + Date.now() }, 'Complaint Registered Successfully. It will be escalated to the Nodal Officer.');
});

export default router;
