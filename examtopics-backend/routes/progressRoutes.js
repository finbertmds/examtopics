const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../services/authService');
const progressController = require('../controllers/progressController');

router.post('/save', authenticateToken, progressController.saveProgress);
router.get('/load/:examId', authenticateToken, progressController.loadProgress);
router.get('/all', authenticateToken, progressController.getAllProgress);
router.post('/answer', authenticateToken, progressController.addAnswer);
router.post('/training-mark', authenticateToken, progressController.toggleTrainingMark);
router.post('/submit', authenticateToken, progressController.submitProgress);
router.post('/reset', authenticateToken, progressController.resetProgress);
router.get('/history/:examId', authenticateToken, progressController.getUserExamHistory);
router.get('/history', authenticateToken, progressController.getUserHistory);
router.get('/stats/:examId', authenticateToken, progressController.getExamStats);
router.get('/completed-exam-ids', authenticateToken, progressController.getCompletedExamIds);
router.get('/daily-tracking', authenticateToken, progressController.getDailyProgress);

module.exports = router;
