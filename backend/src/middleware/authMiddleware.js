import passport from 'passport';

export const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err); 
    }
    if (!user) {
      let message = 'Unauthorized';
      if (info && info.message) {
        message = info.message;
      } else if (info && info instanceof Error && info.name === 'TokenExpiredError') {
        message = 'Token expired. Please log in again.';
      } else if (info && info instanceof Error && info.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please log in again.';
      }
      return res.status(401).json({ message });
    }
    req.user = user; 
    return next();
  })(req, res, next);
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) { 
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
    }
    next();
  };
};