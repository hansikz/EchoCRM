import express from 'express';
import { ingestOrder, getOrdersByCustomer, getOrderById } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', protect, authorize('admin', 'editor'), ingestOrder);
router.get('/customer/:customerId', protect, getOrdersByCustomer);
router.get('/:id', protect, getOrderById);
export default router;