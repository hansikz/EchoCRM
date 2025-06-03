import { publishToQueue } from '../services/messageBrokerService.js';
import config from '../config/index.js';
import logger from '../utils/logger.js'; 

export const handleDeliveryReceipt = async (req, res, next) => {
  try {
    const receiptData = req.body; 
    logger.info('[DeliveryReceiptController] Received delivery receipt webhook:', JSON.stringify(receiptData, null, 2));

    if (!receiptData.messageId || !receiptData.status) {
      logger.warn('[DeliveryReceiptController] Invalid delivery receipt payload. MessageId and status are required.', receiptData);
      return res.status(400).json({ message: 'Invalid receipt data. MessageId and status are required.' });
    }

    const messagePayload = {
      type: 'delivery_receipt_update', 
      payload: {
        messageId: receiptData.messageId, 
        status: receiptData.status.toUpperCase(), 
        timestamp: receiptData.timestamp || new Date().toISOString(), 
        failureReason: receiptData.failureReason || null,
        vendorSpecificDetails: receiptData.vendorSpecificDetails || null, 
      }
    };

    const success = publishToQueue(config.deliveryReceiptQueue, messagePayload);

    if (success) {
      logger.info(`[DeliveryReceiptController] Delivery receipt for ${receiptData.messageId} acknowledged and queued.`);
      res.status(202).json({ message: 'Delivery receipt acknowledged and queued.' });
    } else {
      logger.error(`[DeliveryReceiptController] CRITICAL: Failed to queue delivery receipt for ${receiptData.messageId}.`);
      res.status(500).json({ message: 'Internal Server Error: Could not queue receipt for processing.' });
    }
  } catch (error) {
    logger.error('[DeliveryReceiptController] Error handling delivery receipt webhook:', error);
    next(error); 
  }
}; 

