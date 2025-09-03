const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
require('dotenv').config();

const connectDB = require('./config/database');
const sheetsHelper = require('./sheets');
const { passport, generateToken, authenticateToken, getUserFromToken } = require('./auth');
const progressService = require('./progress');
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
  methods: ['GET', 'POST', 'DELETE'],
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

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, generate JWT token
    const token = generateToken(req.user);
    
    // Get frontend URL based on environment
    const getFrontendUrl = () => {
      const env = process.env.NODE_ENV || 'development';
      
      if (env === 'production') {
        // Production: Use environment variable or default Render frontend URL
        return process.env.FRONTEND_URL || 'https://examtopics-practice.onrender.com';
      } else {
        // Development: Use localhost
        return process.env.FRONTEND_URL || 'http://localhost:3000';
      }
    };
    
    const frontendUrl = getFrontendUrl();
    console.log(`🔗 Redirecting to frontend: ${frontendUrl}/auth/callback`);
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

// Get current user info
app.get('/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.userId,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture || null
    }
  });
});

// Progress routes
app.post('/progress/save', authenticateToken, async (req, res) => {
  try {
    const { examId, progress } = req.body;
    const userId = req.user.userId;

    if (!examId || !progress) {
      return res.status(400).json({
        success: false,
        error: 'examId and progress are required'
      });
    }

    const saved = await progressService.saveProgress(userId, examId, progress);
    
    res.json({
      success: true,
      message: 'Progress saved successfully',
      saved
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save progress',
      details: error.message
    });
  }
});

app.get('/progress/load/:examId', authenticateToken, async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.userId;

    const progress = await progressService.loadProgress(userId, examId);
    
    res.json({
      success: true,
      progress: progress || null
    });
  } catch (error) {
    console.error('Error loading progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load progress',
      details: error.message
    });
  }
});

app.get('/progress/all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const allProgress = await progressService.getAllProgress(userId);
    
    res.json({
      success: true,
      progress: allProgress
    });
  } catch (error) {
    console.error('Error loading all progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load progress',
      details: error.message
    });
  }
});

// Add single answer endpoint (atomic operation)
app.post('/progress/answer', authenticateToken, async (req, res) => {
  try {
    const { examId, topicNumber, questionNumber, selectedAnswers, isCorrect } = req.body;
    const userId = req.user.userId;

    if (!examId || !topicNumber || !questionNumber || !selectedAnswers || isCorrect === undefined) {
      return res.status(400).json({
        success: false,
        error: 'examId, topicNumber, questionNumber, selectedAnswers, and isCorrect are required'
      });
    }

    const progress = await progressService.addAnswer(userId, examId, topicNumber, questionNumber, selectedAnswers, isCorrect);
    
    res.json({
      success: true,
      message: 'Answer saved successfully',
      progress: {
        examId: progress.examId,
        answers: Object.fromEntries(progress.answers),
        currentQuestion: progress.currentQuestion,
        score: progress.score
      }
    });
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save answer',
      details: error.message
    });
  }
});

// Toggle training mark endpoint (atomic operation)
app.post('/progress/training-mark', authenticateToken, async (req, res) => {
  try {
    const { examId, topicNumber, questionNumber } = req.body;
    const userId = req.user.userId;

    if (!examId || !topicNumber || !questionNumber) {
      return res.status(400).json({
        success: false,
        error: 'examId, topicNumber, and questionNumber are required'
      });
    }

    const progress = await progressService.toggleTrainingMark(userId, examId, topicNumber, questionNumber);
    
    res.json({
      success: true,
      message: 'Training mark toggled successfully',
      markedForTraining: progress.markedForTraining
    });
  } catch (error) {
    console.error('Error toggling training mark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle training mark',
      details: error.message
    });
  }
});

// Submit exam and save to history endpoint
app.post('/progress/submit', authenticateToken, async (req, res) => {
  try {
    const { examId, progress, score, totalQuestions, answeredCount } = req.body;
    const userId = req.user.userId;

    if (!examId || !progress || !score || !totalQuestions || answeredCount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'examId, progress, score object, totalQuestions, and answeredCount are required'
      });
    }

    // Validate score object structure
    if (!score.totalQuestions || score.correctAnswers === undefined || score.accuracy === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Score object must contain totalQuestions, correctAnswers, and accuracy'
      });
    }

    // Save to history (you'll need to implement this in progressService)
    await progressService.saveToHistory(userId, examId, progress, score, totalQuestions, answeredCount);
    
    // Reset progress
    await progressService.resetProgress(userId, examId);
    
    res.json({
      success: true,
      message: 'Exam submitted and progress reset successfully'
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit exam',
      details: error.message
    });
  }
});

// Reset progress endpoint
app.post('/progress/reset', authenticateToken, async (req, res) => {
  try {
    const { examId } = req.body;
    const userId = req.user.userId;

    if (!examId) {
      return res.status(400).json({
        success: false,
        error: 'examId is required'
      });
    }

    await progressService.resetProgress(userId, examId);
    
    res.json({
      success: true,
      message: 'Progress reset successfully'
    });
  } catch (error) {
    console.error('Error resetting progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset progress',
      details: error.message
    });
  }
});

// Get user's exam history endpoint
app.get('/progress/history/:examId', authenticateToken, async (req, res) => {
  try {
    const { examId } = req.params;
    const { limit = 10 } = req.query;
    const userId = req.user.userId;

    const history = await progressService.getUserExamHistory(userId, examId, parseInt(limit));
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error getting exam history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get exam history',
      details: error.message
    });
  }
});

// Get user's all history endpoint
app.get('/progress/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const userId = req.user.userId;

    const history = await progressService.getUserHistory(userId, parseInt(limit));
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error getting user history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user history',
      details: error.message
    });
  }
});

// Get exam statistics endpoint
app.get('/progress/stats/:examId', authenticateToken, async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.userId;

    const stats = await progressService.getExamStats(examId);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting exam stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get exam stats',
      details: error.message
    });
  }
});

// Report endpoint
app.post('/report', async (req, res) => {
  try {
    const { topicNumber, questionNumber, examId, reason, comment, user, url } = req.body;

    // Validate required fields
    if (topicNumber === undefined || questionNumber === undefined || !examId || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topicNumber, questionNumber, examId, and reason are required'
      });
    }

    // Validate data types
    if (typeof topicNumber !== 'number' || typeof questionNumber !== 'number' || typeof examId !== 'string' || typeof reason !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data types: topicNumber and questionNumber must be numbers, examId and reason must be strings'
      });
    }

    // Validate optional fields
    if (comment && typeof comment !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data type: comment must be a string'
      });
    }

    if (user !== null && user !== undefined && typeof user !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data type: user must be a string or null'
      });
    }

    // Prepare data for Google Sheets
    const reportData = {
      topicNumber: topicNumber,
      questionNumber: questionNumber,
      examId: examId.trim(),
      reason: reason.trim(),
      comment: comment ? comment.trim() : '',
      user: user ? user.trim() : '',
      url: url ? url.trim() : ''
    };

    // Append to Google Sheets
    await sheetsHelper.appendRow(reportData);

    res.json({
      success: true,
      message: 'Report submitted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing report:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process report',
      details: error.message
    });
  }
});

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
