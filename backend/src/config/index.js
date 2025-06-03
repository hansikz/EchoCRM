import dotenv from 'dotenv';
dotenv.config(); 

const config = {
  port: process.env.PORT || 5001,
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/echo_crm',
  jwtSecret: process.env.JWT_SECRET || 'VERY_DEFAULT_FALLBACK_JWT_SECRET_CHANGE_THIS',
  
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackURL: process.env.GOOGLE_CALLBACK_URL || `http://localhost:${process.env.PORT || 5001}/api/auth/google/callback`,
  
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  openaiApiKey: process.env.OPENAI_API_KEY,
  HUGGING_FACE_API_TOKEN: process.env.HUGGING_FACE_API_TOKEN,
  HUGGING_FACE_MODEL_ID: process.env.HUGGING_FACE_MODEL_ID || 'google/flan-t5-base',

  dataIngestionQueue: process.env.DATA_INGESTION_QUEUE || 'echo_data_ingestion_queue',
  deliveryReceiptQueue: process.env.DELIVERY_RECEIPT_QUEUE || 'echo_delivery_receipt_queue',
  campaignProcessingQueue: process.env.CAMPAIGN_PROCESSING_QUEUE || 'echo_campaign_processing_queue',
};

console.log('--- [CONFIG/INDEX.JS: RAW .ENV VALUES AT STARTUP] ---');
console.log(`ENV: GOOGLE_CLIENT_ID="${process.env.GOOGLE_CLIENT_ID}"`);
console.log(`ENV: GOOGLE_CLIENT_SECRET="${process.env.GOOGLE_CLIENT_SECRET ? 'SET (masked)' : '!!! NOT SET !!!'}"`);
console.log(`ENV: GOOGLE_CALLBACK_URL (raw from .env) = "${process.env.GOOGLE_CALLBACK_URL}"`); // CRITICAL TO CHECK THIS
console.log(`ENV: FRONTEND_URL (raw from .env) = "${process.env.FRONTEND_URL}"`);
console.log('--- [CONFIG/INDEX.JS: FINAL CONFIG OBJECT VALUES USED BY APP] ---');
console.log(`CONFIG: config.googleClientID = "${config.googleClientID}"`);
console.log(`CONFIG: config.googleCallbackURL = "${config.googleCallbackURL}"`); // CRITICAL TO CHECK THIS
console.log(`CONFIG: config.frontendUrl = "${config.frontendUrl}"`);
console.log('----------------------------------------------------');

if (!config.googleClientID || !config.googleClientSecret) {
  console.error('CRITICAL CONFIG ERROR: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Google OAuth WILL FAIL.');
}
if (!config.googleCallbackURL || !config.googleCallbackURL.startsWith('http') || !config.googleCallbackURL.includes('/api/auth/google/callback')) {
    console.error(`CRITICAL CONFIG ERROR: config.googleCallbackURL is invalid or doesn't match expected pattern: "${config.googleCallbackURL}"`);
}
if (!config.frontendUrl || !config.frontendUrl.startsWith('http')) {
    console.error(`CRITICAL CONFIG ERROR: config.frontendUrl is invalid: "${config.frontendUrl}"`);
}

export default config;