import express from 'express';
import cors from 'cors';
import passport from 'passport';
import config from './config/index.js';
import connectDB from './config/db.js';
import initializePassport from './config/passportSetup.js';
import logger from './utils/logger.js';

import authRoutes from './apis/authRoutes.js';
import customerRoutes from './apis/customerRoutes.js';
import campaignRoutes from './apis/campaignRoutes.js';


const app = express();
connectDB();

app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
initializePassport(passport);

app.use('/api/auth', authRoutes); 
app.use('/api/customers', customerRoutes);
app.use('/api/campaigns', campaignRoutes);


app.get('/api', (req, res) => res.send('EchoCRM API is healthy!'));
app.get('/', (req, res) => res.send('Welcome to EchoCRM Backend. API at /api.'));

app.use((err, req, res, next) => {
  logger.error("Global Error Handler:", err.stack || err.message || err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error occurred.',
  });
});

app.use('/api/*', (req, res, next) => { 
    res.status(404).json({ message: `API endpoint not found: ${req.originalUrl}` });
});

export default app;