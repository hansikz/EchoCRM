import express from 'express';
import { getMessageSuggestionsController } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/suggest-messages', protect, getMessageSuggestionsController);

export default router;