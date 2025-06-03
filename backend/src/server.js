import app from './app.js';
import config from './config/index.js';
import { connectRabbitMQ } from './services/messageBrokerService.js';
import { startDataPersistenceConsumer } from './consumers/dataPersistenceConsumer.js';
import { startDeliveryReceiptConsumer } from './consumers/deliveryReceiptConsumer.js';
import { startCampaignProcessingConsumer } from './consumers/campaignConsumer.js'; 
import logger from './utils/logger.js';


const startServer = async () => {
  try {
    const channel = await connectRabbitMQ();

    if (channel) {
      logger.info('Attempting to start message consumers...');
      await startDataPersistenceConsumer(channel);
      await startDeliveryReceiptConsumer(channel);
      await startCampaignProcessingConsumer(channel); 
      logger.info('Message consumers started successfully.');
    } else {
      logger.error('CRITICAL: Failed to obtain RabbitMQ channel. Consumers not started. Application might not function correctly.');
    }

    app.listen(config.port, () => {
      logger.info(`EchoCRM API Server running on port ${config.port}`);
      
      let mongoHostInfo = 'MongoDB URI NOT SET or invalid';
      if (config.mongoURI && typeof config.mongoURI === 'string') {
        mongoHostInfo = config.mongoURI.split('@')[1] ? config.mongoURI.split('@')[1].split('/')[0] : config.mongoURI;
      }
      logger.info(`Connected to MongoDB: ${mongoHostInfo}`);
      
      if (channel) {
        let rabbitMQHostInfo = config.rabbitMQUrl || 'RabbitMQ URL NOT SET';
        if (config.rabbitMQUrl && typeof config.rabbitMQUrl === 'string') {
          const parts = config.rabbitMQUrl.split('@');
          rabbitMQHostInfo = parts.length > 1 ? parts[1] : parts[0]; 
          if (rabbitMQHostInfo.includes('/')) {
            rabbitMQHostInfo = rabbitMQHostInfo.substring(0, rabbitMQHostInfo.indexOf('/'));
          }
        }
        logger.info(`RabbitMQ connection established to: ${rabbitMQHostInfo}`);
      }
    });

  } catch (error) {
    logger.error('Failed to start the server:', error);
    process.exit(1); 
  }
};

startServer();