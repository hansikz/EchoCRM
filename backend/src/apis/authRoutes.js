import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { protect } from '../middleware/authMiddleware.js';
import { getMe } from '../controllers/authController.js'; 
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/google', (req, res, next) => {
    logger.info(`[AUTHROUTES /google] Initiating Google OAuth. Configured callbackURL in strategy: "${config.googleCallbackURL}" (This should include /api)`);
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get(
  '/google/callback',
  (req, res, next) => {
    const failureRedirectUrl = `${config.frontendUrl}/login?error=google_auth_failed_in_callback`;
    logger.info(`[AUTHROUTES /google/callback] Reached. config.frontendUrl for failureRedirect is "${config.frontendUrl}"`);
    logger.info(`[AUTHROUTES /google/callback] Calculated failureRedirect: "${failureRedirectUrl}"`);
    passport.authenticate('google', {
      failureRedirect: failureRedirectUrl,
      session: false,
    })(req, res, next);
  },
  (req, res) => {
    logger.info('[AUTHROUTES /google/callback] Google authentication successful by Passport. User:', req.user ? req.user.displayName : 'req.user IS UNDEFINED/NULL');
    if (!req.user) {
      logger.error('[AUTHROUTES /google/callback] CRITICAL: Google auth success, but req.user is missing!');
      return res.redirect(`${config.frontendUrl}/login?error=auth_failed_critical_missing_user`);
    }

    const payload = { id: req.user.id, name: req.user.displayName, email: req.user.email };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });
    const frontendRedirectUrl = `${config.frontendUrl}/auth/callback?token=${token}&name=${encodeURIComponent(req.user.displayName)}`;
    
    console.log('================ !!! CRITICAL REDIRECT LOG (authRoutes.js) !!! ================');
    logger.info(`[AUTHROUTES /google/callback] FINAL REDIRECT: config.frontendUrl = "${config.frontendUrl}"`);
    logger.info(`[AUTHROUTES /google/callback] FINAL REDIRECT: CONSTRUCTED URL = "${frontendRedirectUrl}"`);
    console.log('======================================================================================');
    
    if (!config.frontendUrl || !config.frontendUrl.startsWith('http') || frontendRedirectUrl.includes('<span')) {
        logger.error(`[AUTHROUTES /google/callback] CRITICAL ERROR: frontendRedirectUrl is malformed: "${frontendRedirectUrl}". ABORTING.`);
        return res.status(500).send('Server error: Malformed frontend redirect URL.');
    }
    
    res.redirect(frontendRedirectUrl);
  }
);

router.get('/me', protect, getMe);
router.post('/logout', protect, (req, res) => { res.status(200).json({ message: 'Logout successful.' }); });

export default router;