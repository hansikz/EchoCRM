import express from 'express';
import { handleDeliveryReceipt } from '../controllers/deliveryReceiptController.js'; 

const router = express.Router();
router.post('/webhook', handleDeliveryReceipt); 

export default router;