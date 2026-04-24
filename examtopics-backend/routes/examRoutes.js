const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticateToken } = require('../services/authService');

// Note: In an ideal world, create/update/delete endpoints should be 
// protected by an Admin middleware, but for now we protect using authenticateToken

// Public endpoints (or protected, based on requirements, let's keep GET public/open)
router.get('/exams', examController.getAllExams);
router.get('/exams/metadata/info', examController.getMetadata);
router.get('/exams/me/created', authenticateToken, examController.getMyExams);
router.get('/exams/:code', examController.getExamByCode);
router.get('/questions/:code', examController.getQuestionsByExamCode);

// Admin-level endpoints (protected by user token)
router.post('/exams', authenticateToken, examController.createExam);
router.put('/exams/:code', authenticateToken, examController.updateExam);
router.delete('/exams/:code', authenticateToken, examController.deleteExam);

module.exports = router;
