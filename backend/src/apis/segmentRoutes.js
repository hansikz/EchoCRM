import express from 'express';
import { createSegment, getSegments, getSegmentById, updateSegment, deleteSegment, previewSegmentAudience } from '../controllers/segmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, authorize('admin', 'editor'), createSegment);
router.get('/', protect, getSegments);
router.post('/preview', protect, previewSegmentAudience);
router.get('/:id', protect, getSegmentById);
router.put('/:id', protect, authorize('admin', 'editor'), updateSegment);
router.delete('/:id', protect, authorize('admin'), deleteSegment);

export default router;