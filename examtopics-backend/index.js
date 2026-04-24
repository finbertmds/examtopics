const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
require('dotenv').config();

const connectDB = require('./config/database');
const sheetsHelper = require('./services/sheetsService');
const { passport, generateToken, authenticateToken, getUserFromToken } = require('./services/authService');
const progressService = require('./services/progressService');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
// CORS configuration with environment-based origins
const getCorsOrigins = () => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    // Production: Allow specific origins
    const origins = [
      'https://examtopics-practice.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    return origins.length > 0 ? origins : ['https://examtopics-practice.onrender.com'];
  } else {
    // Development: Allow localhost
    return ['http://localhost:3000', 'http://localhost:3001'];
  }
};

app.use(cors({
  origin: getCorsOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const sheetsConnected = await sheetsHelper.testConnection();
    const progressStats = await progressService.getStats();
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        googleSheets: sheetsConnected ? 'connected' : 'disconnected',
        mongodb: 'connected'
      },
      stats: progressStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error.message
    });
  }
});

// Domain Routes
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');
const reportRoutes = require('./routes/reportRoutes');
const examRoutes = require('./routes/examRoutes');

app.use('/auth', authRoutes);
app.use('/progress', progressRoutes);
app.use('/report', reportRoutes);
app.use('/api', examRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Report endpoint: POST http://localhost:${PORT}/report`);
});

module.exports = app;
