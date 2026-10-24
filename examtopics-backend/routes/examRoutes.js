const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticateToken, getUserFromToken } = require('../services/authService');

// Note: In an ideal world, create/update/delete endpoints should be 
// protected by an Admin middleware, but for now we protect using authenticateToken

// Public endpoints (or protected, based on requirements, let's keep GET public/open)
router.get('/exams', getUserFromToken, examController.getAllExams);
router.get('/exams/metadata/info', getUserFromToken, examController.getMetadata);
router.get('/exams/me/created', authenticateToken, examController.getMyExams);
router.get('/exams/:code/export', authenticateToken, examController.exportExam);
router.get('/exams/:code', getUserFromToken, examController.getExamByCode);
router.get('/questions/:code/:questionNumber', getUserFromToken, examController.getQuestionByExamAndNumber);
router.get('/questions/:code', getUserFromToken, examController.getQuestionsByExamCode);

// Admin-level endpoints (protected by user token)
router.post('/exams', authenticateToken, examController.createExam);
router.put('/exams/:code', authenticateToken, examController.updateExam);
router.put('/exams/:code/owner', authenticateToken, examController.transferExamOwnership);
router.put('/exams/:code/questions/:questionNumber', authenticateToken, examController.updateQuestion);
router.delete('/exams/:code', authenticateToken, examController.deleteExam);

module.exports = router;
