import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import config from '../config/index.js'; // To get queue name

export const startDataPersistenceConsumer = async (channel) => {
  if (!channel) {
    console.error('Data Persistence Consumer: RabbitMQ channel not available. Consumer not started.');
    return;
  }

  const queueName = config.dataIngestionQueue;
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(5); // Process up to 5 messages concurrently

  console.log(`[*] Data Persistence Consumer: Waiting for messages in ${queueName}. To exit press CTRL+C`);

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      let messageContent;
      try {
        messageContent = JSON.parse(msg.content.toString());

        if (messageContent.type === 'customer_ingest') {
          const { email, ...updateData } = messageContent.payload;
          await Customer.findOneAndUpdate(
            { email: email.toLowerCase() }, 
            { $set: updateData, $setOnInsert: { email: email.toLowerCase(), createdAt: new Date() } }, 
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
          );
        } else if (messageContent.type === 'order_ingest') {
          const orderPayload = messageContent.payload;
          if (!mongoose.Types.ObjectId.isValid(orderPayload.customerId)) {
              console.warn(`Invalid customerId for order ${orderPayload.orderNumber}. Skipping.`);
              channel.ack(msg);
              return;
          }

          // Check if orderNumber already exists to prevent duplicates
          const existingOrder = await Order.findOne({ orderNumber: orderPayload.orderNumber });
          if (existingOrder) {
              console.warn(`Order ${orderPayload.orderNumber} already exists. Skipping ingestion.`);
              channel.ack(msg);
              return;
          }

          const order = new Order(orderPayload);
          await order.save();

          await Customer.findByIdAndUpdate(order.customerId, {
            $inc: { totalSpends: order.totalAmount, visitCount: 1 },
            $set: { lastPurchaseDate: order.orderDate || new Date(), lastSeen: order.orderDate || new Date() }
          });
        } else {
          console.warn(`Unknown message type in ${queueName}: ${messageContent.type}`);
        }
        channel.ack(msg); 
      } catch (error) {
        console.error('Error processing message from data_ingestion_queue:', error.message, messageContent || msg.content.toString());
        channel.nack(msg, false, false); }
    }
  }, { noAck: false }); // Manual acknowledgment
};