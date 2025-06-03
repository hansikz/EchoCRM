import express from 'express';
import { createCampaign, getCampaignHistory, getCampaignDetails } from '../controllers/campaignController.js';
import { generateCampaignInsights } from '../controllers/campaignInsightsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createCampaign);
router.get('/history', protect, getCampaignHistory);
router.get('/:campaignId', protect, getCampaignDetails);
router.get('/:campaignId/insights', protect, generateCampaignInsights); 

export default router;