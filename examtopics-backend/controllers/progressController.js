const { sendInternalError } = require('../utils/requestFailure');
const progressService = require('../services/progressService');

const isExamId = (value) => typeof value === 'string' && value.trim().length > 0;
const isPosition = (value) => Number.isSafeInteger(value) && value > 0;
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function parseQuestionKey(key) {
  if (typeof key !== 'string') return null;
  const [topic, question, extra] = key.split('-');
  const topicNumber = Number(topic);
  const questionNumber = Number(question);
  if (extra !== undefined || !isPosition(topicNumber) || !isPosition(questionNumber) ||
      key !== `${topicNumber}-${questionNumber}`) {
    return null;
  }
  return { topicNumber, questionNumber };
}

function validProgressPositions(progress) {
  if (!isRecord(progress)) return false;
  const { currentTopic, currentQuestion, markedForTraining, answers } = progress;
  if ((currentTopic !== undefined && !isPosition(currentTopic)) ||
      (currentQuestion !== undefined && !isPosition(currentQuestion)) ||
      (markedForTraining !== undefined &&
        (!Array.isArray(markedForTraining) || !markedForTraining.every(parseQuestionKey)))) {
    return false;
  }
  if (answers === undefined) return true;
  return isRecord(answers) && Object.entries(answers).every(([key, answer]) => {
    const position = parseQuestionKey(key);
    return position && isRecord(answer) &&
      (answer.topicNumber === undefined || answer.topicNumber === position.topicNumber) &&
      (answer.questionNumber === undefined || answer.questionNumber === position.questionNumber);
  });
}

class ProgressController {
  async saveProgress(req, res) {
    try {
      const { examId, progress } = req.body ?? {};
      const userId = req.user.userId;

      if (!isExamId(examId) || !validProgressPositions(progress)) {
        return res.status(400).json({
          success: false,
          error: 'Valid examId and progress are required'
        });
      }

      const saved = await progressService.saveProgress(userId, examId, progress);
      
      res.json({
        success: true,
        message: 'Progress saved successfully',
        saved
      });
    } catch {
      return sendInternalError(res, 'progress.save_failed', 'Failed to save progress');
    }
  }

  async loadProgress(req, res) {
    try {
      const { examId } = req.params;
      if (!isExamId(examId)) return res.status(400).json({ success: false, error: 'A valid examId is required' });
      const userId = req.user.userId;

      const progress = await progressService.loadProgress(userId, examId);
      
      res.json({
        success: true,
        progress: progress || null
      });
    } catch {
      return sendInternalError(res, 'progress.load_failed', 'Failed to load progress');
    }
  }

  async getAllProgress(req, res) {
    try {
      const userId = req.user.userId;
      const allProgress = await progressService.getAllProgress(userId);
      
      res.json({
        success: true,
        progress: allProgress
      });
    } catch {
      return sendInternalError(res, 'progress.load_all_failed', 'Failed to load progress');
    }
  }

  async addAnswer(req, res) {
    try {
      const { examId, topicNumber, questionNumber, selectedAnswers, isCorrect } = req.body ?? {};
      const userId = req.user.userId;

      if (!isExamId(examId) || !isPosition(topicNumber) || !isPosition(questionNumber) ||
          !isPosition(questionNumber + 1) || !selectedAnswers || isCorrect === undefined) {
        return res.status(400).json({
          success: false,
          error: 'examId, topicNumber, questionNumber, selectedAnswers, and isCorrect are required'
        });
      }

      const progress = await progressService.addAnswer(userId, examId, topicNumber, questionNumber, selectedAnswers, isCorrect);
      
      res.json({
        success: true,
        message: 'Answer for question ' + questionNumber + ' in topic ' + topicNumber + ' saved successfully',
        progress: {
          examId: progress.examId,
          answers: Object.fromEntries(progress.answers),
          currentTopic: progress.currentTopic,
          currentQuestion: progress.currentQuestion,
          score: progress.score
        }
      });
    } catch {
      return sendInternalError(res, 'progress.answer_failed', 'Failed to save answer');
    }
  }

  async toggleTrainingMark(req, res) {
    try {
      const { examId, topicNumber, questionNumber, isMarkedForTraining } = req.body ?? {};
      const userId = req.user.userId;

      if (!isExamId(examId) || !isPosition(topicNumber) || !isPosition(questionNumber)) {
        return res.status(400).json({
          success: false,
          error: 'examId, topicNumber, and questionNumber are required'
        });
      }

      await progressService.toggleTrainingMark(userId, examId, topicNumber, questionNumber, isMarkedForTraining);
      
      res.json({
        success: true,
        message: 'Training mark for question ' + questionNumber + ' in topic ' + topicNumber + ' ' + (isMarkedForTraining ? 'added' : 'removed') + ' successfully',
      });
    } catch {
      return sendInternalError(res, 'progress.training_mark_failed', 'Failed to toggle training mark');
    }
  }

  async submitProgress(req, res) {
    try {
      const { examId, progress, score, totalQuestions, answeredCount } = req.body ?? {};
      const userId = req.user.userId;

      if (!isExamId(examId) || !validProgressPositions(progress) || !score || !totalQuestions || answeredCount === undefined) {
        return res.status(400).json({
          success: false,
          error: 'examId, progress, score object, totalQuestions, and answeredCount are required'
        });
      }

      if (!score.totalQuestions || score.correctAnswers === undefined || score.accuracy === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Score object must contain totalQuestions, correctAnswers, and accuracy'
        });
      }

      await progressService.saveToHistory(userId, examId, progress, score, totalQuestions, answeredCount);
      await progressService.resetProgress(userId, examId);
      
      res.json({
        success: true,
        message: 'Exam ' + examId + ' submitted and progress reset successfully'
      });
    } catch {
      return sendInternalError(res, 'progress.submit_failed', 'Failed to submit exam');
    }
  }

  async resetProgress(req, res) {
    try {
      const { examId } = req.body ?? {};
      const userId = req.user.userId;

      if (!isExamId(examId)) {
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
    } catch {
      return sendInternalError(res, 'progress.reset_failed', 'Failed to reset progress');
    }
  }

  async getUserExamHistory(req, res) {
    try {
      const { examId } = req.params;
      if (!isExamId(examId)) return res.status(400).json({ success: false, error: 'A valid examId is required' });
      const { limit = 10 } = req.query;
      const userId = req.user.userId;

      const history = await progressService.getUserExamHistory(userId, examId, parseInt(limit));
      
      res.json({
        success: true,
        history
      });
    } catch {
      return sendInternalError(res, 'progress.exam_history_failed', 'Failed to get exam history');
    }
  }

  async getUserHistory(req, res) {
    try {
      const { limit = 50 } = req.query;
      const userId = req.user.userId;

      const history = await progressService.getUserHistory(userId, parseInt(limit));
      
      res.json({
        success: true,
        history
      });
    } catch {
      return sendInternalError(res, 'progress.user_history_failed', 'Failed to get user history');
    }
  }

  async getExamStats(req, res) {
    try {
      const { examId } = req.params;
      if (!isExamId(examId)) return res.status(400).json({ success: false, error: 'A valid examId is required' });
      const userId = req.user.userId;

      const stats = await progressService.getExamStats(userId, examId);
      
      res.json({
        success: true,
        stats
      });
    } catch {
      return sendInternalError(res, 'progress.exam_stats_failed', 'Failed to get exam stats');
    }
  }

  async getCompletedExamIds(req, res) {
    try {
      const userId = req.user.userId;

      const examIds = await progressService.getCompletedExamIds(userId);
      
      res.json({
        success: true,
        examIds
      });
    } catch {
      return sendInternalError(res, 'progress.completed_exams_failed', 'Failed to get completed exam IDs');
    }
  }

  async getDailyProgress(req, res) {
    try {
      const { examId } = req.query;
      const userId = req.user.userId;

      if (examId !== undefined && !isExamId(examId)) {
        return res.status(400).json({ success: false, error: 'Invalid examId' });
      }

      const dailyProgress = await progressService.getDailyProgress(userId, examId);
      
      res.json({
        success: true,
        dailyProgress: dailyProgress
      });
    } catch {
      return sendInternalError(res, 'progress.daily_failed', 'Failed to get daily progress');
    }
  }
}

module.exports = new ProgressController();
