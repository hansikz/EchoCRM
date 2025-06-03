import User from '../models/User.js';
import logger from '../utils/logger.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password

    if (!user) {
      logger.warn(`[AuthController] /me - User not found in DB for ID: ${req.user.id}`);
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isSubscribed: user.isSubscribed,
      campaignCount: user.campaignCount,
      createdAt: user.createdAt, // For "My Journey" join date
    });
  } catch (error) {
    logger.error('[AuthController] /me - Error fetching user details:', error);
    next(error);
  }
};