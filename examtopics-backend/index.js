const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
const { passport } = require('./services/authService');
const errorHandler = require('./middleware/errorHandler');
const getFrontendUrl = require('./utils/frontendUrl');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
// CORS configuration with environment-based origins
const frontendOrigin = new URL(getFrontendUrl()).origin;
const corsOrigins = process.env.NODE_ENV === 'production'
  ? ['https://examtopics-practice.onrender.com', frontendOrigin]
  : ['http://localhost:3000', 'http://localhost:3001', frontendOrigin];

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-ExamTopics-Session'],
  credentials: true
}));
// Initialize passport
app.use(passport.initialize());

// Domain Routes
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');
const reportRoutes = require('./routes/reportRoutes');
const examRoutes = require('./routes/examRoutes');
const healthRoutes = require('./routes/healthRoutes');

app.use('/auth', authRoutes);
app.use('/progress', progressRoutes);
app.use('/report', reportRoutes);
app.use('/api', examRoutes);
app.use('/health', healthRoutes);

// 404 handler
app.use( (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use(errorHandler);

if (require.main === module) {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Report endpoint: POST http://localhost:${PORT}/report`);
  });
}

module.exports = app;
