import CommunicationLog from '../models/CommunicationLog.js';
import config from '../config/index.js';

export const startDeliveryReceiptConsumer = async (channel) => {
  if (!channel) {
    console.error('Delivery Receipt Consumer: RabbitMQ channel not available. Consumer not started.');
    return;
  }
  const queueName = config.deliveryReceiptQueue;
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(10); // Process up to 10 receipts 

  console.log(`[*] Delivery Receipt Consumer: Waiting for messages in ${queueName}.`);

  let messageBatch = [];
  const batchSize = 20; // Number of messages to batch for DB update
  const batchInterval = 5000; // Max time to wait before processing a batch

  let batchTimeout = null;

  const processBatch = async () => {
    if (messageBatch.length === 0) return;
    const currentBatch = [...messageBatch]; // Copy and clear
    messageBatch = [];

    const bulkOps = currentBatch.map(msgData => {
      const { messageId, status, timestamp, failureReason } = msgData.payload; 
      
      const updateFields = { status: status.toUpperCase() }; 
      if (timestamp) {
        if (status.toUpperCase() === 'DELIVERED') updateFields.deliveredAt = new Date(timestamp);
        else if (status.toUpperCase() === 'SENT') updateFields.sentAt = new Date(timestamp);
      }
      if (status.toUpperCase() === 'FAILED' && failureReason) {
        updateFields.failedReason = failureReason.substring(0,255);
      }

      return {
        updateOne: {
          filter: { _id: messageId },
          update: { $set: updateFields },
        }
      };
    });

    try {
      if (bulkOps.length > 0) {
        const result = await CommunicationLog.bulkWrite(bulkOps, { ordered: false }); 
      }
    } catch (dbError) {
      console.error('Delivery Receipt Consumer: Error during batch DB update:', dbError);
    }
  };


  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      try {
        const messageContent = JSON.parse(msg.content.toString());
        if (messageContent.type === 'delivery_receipt_update') {
          messageBatch.push(messageContent);

          if (messageBatch.length >= batchSize) {
            clearTimeout(batchTimeout); // Clear existing timeout if batch size is met
            await processBatch();
          } else if (!batchTimeout) { // Start timeout if not already running for this new item
            batchTimeout = setTimeout(async () => {
              await processBatch();
              batchTimeout = null; // Reset timeout id
            }, batchInterval);
          }
        } else {
            console.warn(`Delivery Receipt Consumer: Unknown message type: ${messageContent.type}`);
        }
        channel.ack(msg);
      } catch (error) {
        console.error('Delivery Receipt Consumer: Error processing message:', error.message, msg.content.toString());
        channel.nack(msg, false, false); 
      }
    }
  }, { noAck: false });
};