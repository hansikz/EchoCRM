import axios from 'axios';
import config from '../config/index.js'; 

const VENDOR_SUCCESS_RATE = 0.9; 

export const dummyVendorApi = {
  sendMessage: async ({ to, message, messageId }) => {
    console.log(`[DummyVendorAPI] Attempting to send message to ${to}: "${message.substring(0,30)}..." (Ref ID: ${messageId})`);

    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500)); // 0.5 to 1.5 seconds delay

    const isSuccess = Math.random() < VENDOR_SUCCESS_RATE;
    const status = isSuccess ? 'DELIVERED' : 'FAILED'; 
    const timestamp = new Date().toISOString();
    let failureReason = null;

    if (isSuccess) {
      console.log(`[DummyVendorAPI] Message to ${to} (Ref ID: ${messageId}) supposedly SENT/DELIVERED by vendor.`);
    } else {
      failureReason = `VendorSim: Random failure (Code: ${Math.floor(Math.random() * 100) + 500})`;
      console.warn(`[DummyVendorAPI] Message to ${to} (Ref ID: ${messageId}) FAILED to send by vendor. Reason: ${failureReason}`);
    }
    try {
      // IMPORTANT: The URL for delivery receipt should be configurable and point to the backend.
      const deliveryReceiptUrl = `${config.backendBaseUrl || `http://localhost:${config.port}`}/api/delivery-receipt/webhook`;
    
      axios.post(deliveryReceiptUrl, {
        messageId: messageId, // This should be your CommunicationLog._id
        status: status,
        timestamp: timestamp,
        ...(failureReason && { failureReason: failureReason }),
        vendorSpecificId: `vendor_${Date.now()}_${Math.random().toString(36).substring(7)}` // A dummy vendor ID
      }).catch(receiptError => {
        console.error(`[DummyVendorAPI] CRITICAL: Failed to send delivery receipt to webhook for ${messageId}:`, 
          receiptError.response ? receiptError.response.data : receiptError.message);
      });

    } catch (e) {
        console.error(`[DummyVendorAPI] Error constructing/calling delivery receipt webhook for ${messageId}`, e.message);
    }

    if (isSuccess || Math.random() < 0.98) { 
        return { vendorMessageId: `sim_vendor_${messageId}`, ackStatus: 'QUEUED_BY_VENDOR' };
    } else {
        throw new Error("VendorSim: API call failed immediately (e.g., invalid recipient, auth error).");
    }
  },
};