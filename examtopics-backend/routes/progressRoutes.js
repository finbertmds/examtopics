const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../services/authService');
const progressController = require('../controllers/progressController');
const progressBody = express.json({ limit: '2mb', inflate: false });
const answerBody = express.json({ limit: '32kb', inflate: false });
const smallBody = express.json({ limit: '4kb', inflate: false });

router.post('/save', authenticateToken, progressBody, progressController.saveProgress);
router.get('/load/:examId', authenticateToken, progressController.loadProgress);
router.get('/all', authenticateToken, progressController.getAllProgress);
router.post('/answer', authenticateToken, answerBody, progressController.addAnswer);
router.post('/training-mark', authenticateToken, smallBody, progressController.toggleTrainingMark);
router.post('/submit', authenticateToken, progressBody, progressController.submitProgress);
router.post('/reset', authenticateToken, smallBody, progressController.resetProgress);
router.get('/history/:examId', authenticateToken, progressController.getUserExamHistory);
router.get('/history', authenticateToken, progressController.getUserHistory);
router.get('/stats/:examId', authenticateToken, progressController.getExamStats);
router.get('/completed-exam-ids', authenticateToken, progressController.getCompletedExamIds);
router.get('/daily-tracking', authenticateToken, progressController.getDailyProgress);

module.exports = router;
