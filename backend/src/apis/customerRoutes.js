import express from 'express';
import { ingestCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'editor'), ingestCustomer);

router.get('/', protect, getCustomers);

router.get('/:id', protect, getCustomerById);

router.put('/:id', protect, authorize('admin', 'editor'), updateCustomer);

router.delete('/:id', protect, authorize('admin'), deleteCustomer);


export default router;