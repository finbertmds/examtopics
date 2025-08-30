const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const sheetsHelper = require('./sheets');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const sheetsConnected = await sheetsHelper.testConnection();
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        googleSheets: sheetsConnected ? 'connected' : 'disconnected'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error.message
    });
  }
});

// Report endpoint
app.post('/report', async (req, res) => {
  try {
    const { questionId, examId, reason, comment, user } = req.body;

    // Validate required fields
    if (!questionId || !examId || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: questionId, examId, and reason are required'
      });
    }

    // Validate data types
    if (typeof questionId !== 'string' || typeof examId !== 'string' || typeof reason !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data types: questionId, examId, and reason must be strings'
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
      questionId: questionId.trim(),
      examId: examId.trim(),
      reason: reason.trim(),
      comment: comment ? comment.trim() : '',
      user: user ? user.trim() : ''
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Report endpoint: POST http://localhost:${PORT}/report`);
});

module.exports = app;
