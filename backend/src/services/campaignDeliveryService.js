import Customer from '../models/Customer.js';
import CommunicationLog from '../models/CommunicationLog.js';
import { buildMongoQueryFromRules } from './segmentEvaluationService.js';
import { dummyVendorApi } from '../vendor/dummyVendorApi.js'; 
import mongoose from 'mongoose';

export const processAndDeliverCampaign = async (campaignData) => {
  const { campaignId, segmentRules, messageTemplate, campaignObjective } = campaignData;
  console.log(`Processing campaign ${campaignId} (Objective: ${campaignObjective})`);

  try {
    const mongoQuery = buildMongoQueryFromRules(segmentRules);
    const customers = await Customer.find(mongoQuery).select('_id name email').lean(); // .lean() for performance

    if (customers.length === 0) {
      console.log(`Campaign ${campaignId}: No customers found for the segment.`);
      return;
    }

    console.log(`Campaign ${campaignId}: Found ${customers.length} customers. Preparing to send messages.`);

    let successCount = 0;
    let failureCount = 0;

    for (const customer of customers) {
      let personalizedMessage = messageTemplate;
      personalizedMessage = personalizedMessage.replace(/{{name}}/gi, customer.name || 'Valued Customer');
      personalizedMessage = personalizedMessage.replace(/{{email}}/gi, customer.email);

      const logEntry = new CommunicationLog({
        campaignId: new mongoose.Types.ObjectId(campaignId),
        customerId: customer._id,
        message: personalizedMessage,
        status: 'PENDING', 
      });
      await logEntry.save();

      try {
        await dummyVendorApi.sendMessage({
          to: customer.email, 
          message: personalizedMessage,
          messageId: logEntry._id.toString(),
        });
        successCount++;
      } catch (sendError) {
        console.error(`Campaign ${campaignId}: Failed to send message to customer ${customer._id}:`, sendError.message);
        logEntry.status = 'FAILED';
        logEntry.failedReason = sendError.message.substring(0, 255); 
        await logEntry.save();
        failureCount++;
      }
    }

    console.log(`Campaign ${campaignId} processing finished. Attempted sends: ${successCount}, Failures (immediate): ${failureCount}.`);
  } catch (error) {
    console.error(`Critical error processing campaign ${campaignId}:`, error);
  }
};