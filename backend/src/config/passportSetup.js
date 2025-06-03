import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import config from './index.js'; 

export default function initializePassport(passport) {
  console.log('--- [PASSPORTSETUP.JS: INITIALIZING GOOGLE STRATEGY WITH] ---');
  console.log(`PASSPORT_CLIENT_ID: "${config.googleClientID || '!!! UNDEFINED IN CONFIG !!!'}"`);
  console.log(`PASSPORT_CALLBACK_URL: "${config.googleCallbackURL || '!!! UNDEFINED IN CONFIG !!!'}"`); 
  console.log('----------------------------------------------------------');

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallbackURL, //  http://localhost:5001/api/auth/google/callback
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile.emails || !profile.emails.length) {
            return done(new Error("No email found in Google profile"), null);
          }
          const email = profile.emails[0].value;
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            user.displayName = profile.displayName;
            user.avatarUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : user.avatarUrl;
            await user.save(); return done(null, user);
          }
          user = await User.findOne({ email: email });
          if (user) {
            user.googleId = profile.id;
            user.displayName = user.displayName || profile.displayName;
            user.avatarUrl = user.avatarUrl || (profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null);
            await user.save(); return done(null, user);
          }
          user = await User.create({
            googleId: profile.id, displayName: profile.displayName, email: email,
            avatarUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          });
          return done(null, user);
        } catch (err) { console.error("Error in Google OAuth Strategy:", err); return done(err, null); }
      }
    )
  );

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
  };
  passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try { const user = await User.findById(payload.id).select('-password'); if (user) { return done(null, user); } return done(null, false); }
    catch (error) { console.error("Error in JWT Strategy:", error); return done(error, false); }
  }));

  passport.serializeUser((user, done) => { done(null, user.id); });
  passport.deserializeUser(async (id, done) => {
    try { const user = await User.findById(id); done(null, user); }
    catch (err) { console.error("Error in deserializeUser:", err); done(err, null); }
  });
}