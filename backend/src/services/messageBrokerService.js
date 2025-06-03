import amqp from 'amqplib';
import config from '../config/index.js';

let channel = null;
let connection = null; // Keep track of the connection

const queuesToAssert = [
    { name: config.dataIngestionQueue, options: { durable: true } },
    { name: config.deliveryReceiptQueue, options: { durable: true } },
    { name: config.campaignProcessingQueue, options: { durable: true } }
];

export const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      connection = await amqp.connect(config.rabbitMQUrl);
      channel = await connection.createChannel();
      console.log('RabbitMQ connected and channel created.');

      connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err.message);
      });
      connection.on('close', () => {
        console.warn('RabbitMQ connection closed. Attempting to reconnect...');
        channel = null; connection = null;
        setTimeout(() => connectRabbitMQ(), delay);
      });

      for (const q of queuesToAssert) {
        await channel.assertQueue(q.name, q.options);
        console.log(`Queue ${q.name} asserted.`);
      }
      
      return channel;
    } catch (error) {
      console.error(`RabbitMQ connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('All RabbitMQ connection attempts failed.');
        return null;
      }
    }
  }
  return null; 
};

export const publishToQueue = (queueName, message) => {
  if (!channel) {
    console.error('RabbitMQ channel not available. Message not published:', message);
    
    return false;
  }
  try {//buffer message
    const messageBuffer = Buffer.from(JSON.stringify(message));
    const published = channel.sendToQueue(queueName, messageBuffer, { persistent: true });
    if (published) {
    } else {
        console.warn(`Message NOT sent to queue ${queueName} (channel buffer full?):`, message);
    }
    return published;
  } catch (error) {
    console.error(`Error publishing to queue ${queueName}:`, error);
    return false;
  }
};

export const getRabbitMQChannel = () => {
  if (!channel) {
    console.warn("Attempted to get RabbitMQ channel, but it's not initialized.");
  }
  return channel;
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing RabbitMQ connection...');
  if (channel) await channel.close();
  if (connection) await connection.close();
  process.exit(0);
});