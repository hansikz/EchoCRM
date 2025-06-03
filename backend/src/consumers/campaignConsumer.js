import { processAndDeliverCampaign } from '../services/campaignDeliveryService.js';
import config from '../config/index.js';

export const startCampaignProcessingConsumer = async (channel) => {
  if (!channel) {
    console.error('Campaign Consumer: RabbitMQ channel not available. Consumer not started.');
    return;
  }
  const queueName = config.campaignProcessingQueue;
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  console.log(`[*] Campaign Consumer: Waiting for messages in ${queueName}.`);

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      let campaignData;
      try {
        campaignData = JSON.parse(msg.content.toString());
        console.log(`Campaign Consumer: Received campaign to process:`, campaignData.campaignId);
        
        await processAndDeliverCampaign(campaignData); // This function contains the core logic
        
        console.log(`Campaign Consumer: Finished processing campaign:`, campaignData.campaignId);
        channel.ack(msg);
      } catch (error) {
        console.error(`Campaign Consumer: Error processing campaign ${campaignData?.campaignId}:`, error.message);
        channel.nack(msg, false, false); 
      }
    }
  }, { noAck: false });
};