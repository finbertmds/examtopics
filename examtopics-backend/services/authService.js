const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const getAuthSecret = require('../utils/authSecrets');
const createOAuthStateStore = require('../utils/oauthStateStore');
require('dotenv').config();

const JWT_SECRET = getAuthSecret('JWT_SECRET');
const oauthStateSecret = getAuthSecret('SESSION_SECRET');
const DAY_SECONDS = 24 * 60 * 60;
const ACCESS_TOKEN_LIFETIME = 7 * DAY_SECONDS;
const SESSION_LIFETIME = 30 * DAY_SECONDS;
const REFRESH_WINDOW = DAY_SECONDS;

// Configure Google OAuth Strategy with environment-based callback URL
const getCallbackURL = () => {
  const env = process.env.NODE_ENV || 'development';
  const port = process.env.PORT || 3001;
  
  if (env === 'production') {
    // Production: Use Render URL or custom domain
    return process.env.GOOGLE_CALLBACK_URL || `https://examtopics-backend-latest.onrender.com/auth/google/callback`;
  } else {
    // Development: Use localhost
    return `http://localhost:${port}/auth/google/callback`;
  }
};

const callbackURL = getCallbackURL();
const secureStateCookie = process.env.NODE_ENV === 'production' || new URL(callbackURL).protocol === 'https:';
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL,
    store: createOAuthStateStore(oauthStateSecret, secureStateCookie),
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Find or create user in MongoDB
      const user = await User.findOrCreateUser(profile);
      return cb(null, user);
    } catch (error) {
      console.error('Error in Google OAuth strategy:', error);
      return cb(error, null);
    }
  }
));

const nowInSeconds = () => Math.floor(Date.now() / 1000);

const signAccessToken = ({ userId, email, name, picture }, now, sessionExpiresAt) => jwt.sign({
  userId,
  email,
  name,
  picture: picture || null,
  iat: now,
  exp: Math.min(now + ACCESS_TOKEN_LIFETIME, sessionExpiresAt),
  sessionExpiresAt,
}, JWT_SECRET);

const generateToken = (user) => {
  const now = nowInSeconds();
  return signAccessToken({ userId: user._id, email: user.email, name: user.name, picture: user.picture },
    now, now + SESSION_LIFETIME);
};

const refreshAccessToken = (token) => {
  try {
    const now = nowInSeconds();
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'], clockTimestamp: now });
    const { exp, sessionExpiresAt } = decoded;
    if (!Number.isSafeInteger(exp) || !Number.isSafeInteger(sessionExpiresAt) ||
        exp >= sessionExpiresAt || exp - now > REFRESH_WINDOW) {
      return null;
    }
    return signAccessToken(decoded, now, sessionExpiresAt);
  } catch (error) {
    return null;
  }
};

// Verify JWT token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Get user from token (without requiring authentication)
const getUserFromToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};

module.exports = {
  passport,
  generateToken,
  refreshAccessToken,
  authenticateToken,
  getUserFromToken
};
