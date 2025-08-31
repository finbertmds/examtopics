const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: getCallbackURL()
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

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      name: user.name,
      picture: user.picture || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
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

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

module.exports = {
  passport,
  generateToken,
  authenticateToken,
  getUserFromToken
};
