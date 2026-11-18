const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECONDS } = require('../config/auth');
const User = require('../models/User');
const getAuthSecret = require('../utils/authSecrets');
const createOAuthStateStore = require('../utils/oauthStateStore');
require('dotenv').config();
const sessions = require('./authSessionService');
const isOAuthValue = require('../utils/isOAuthValue');

const JWT_SECRET = getAuthSecret('JWT_SECRET');
const oauthStateSecret = getAuthSecret('SESSION_SECRET');

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

function generateToken(user, session) {
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign({
    sid: session._id,
    userId: String(user._id),
    email: user.email,
    name: user.name,
    picture: user.picture || null,
    iat: now,
    exp: Math.min(now + ACCESS_TOKEN_SECONDS, Math.floor(session.expiresAt.getTime() / 1000)),
  }, JWT_SECRET, { algorithm: 'HS256' });
}

function readBearer(req, { ignoreExpiration = false } = {}) {
  const token = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization)?.[1];
  if (!token) return null;
  try {
    const claims = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'], ignoreExpiration });
    if (!isOAuthValue(claims.sid) || typeof claims.userId !== 'string' || !Number.isSafeInteger(claims.exp)) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

async function authenticatedClaims(req) {
  const claims = readBearer(req);
  if (!claims) return null;
  const session = await sessions.findActive(claims.sid);
  return session && String(session.userId) === claims.userId ? claims : null;
}

async function authenticateToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }
  const claims = await authenticatedClaims(req);
  if (!claims) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
  req.user = claims;
  return next();
}

async function getUserFromToken(req, res, next) {
  const claims = await authenticatedClaims(req);
  if (claims) req.user = claims;
  return next();
}

module.exports = {
  passport,
  generateToken,
  readBearer,
  authenticateToken,
  getUserFromToken,
};
