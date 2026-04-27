const progressService = require('../services/progressService');

class ProgressController {
  async saveProgress(req, res) {
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
  }

  async loadProgress(req, res) {
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
  }

  async getAllProgress(req, res) {
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
  }

  async addAnswer(req, res) {
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
  }

  async toggleTrainingMark(req, res) {
    try {
      const { examId, topicNumber, questionNumber, isMarkedForTraining } = req.body;
      const userId = req.user.userId;

      if (!examId || !topicNumber || !questionNumber) {
        return res.status(400).json({
          success: false,
          error: 'examId, topicNumber, and questionNumber are required'
        });
      }

      await progressService.toggleTrainingMark(userId, examId, topicNumber, questionNumber, isMarkedForTraining);
      
      res.json({
        success: true,
        message: 'Training mark toggled successfully',
      });
    } catch (error) {
      console.error('Error toggling training mark:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle training mark',
        details: error.message
      });
    }
  }

  async submitProgress(req, res) {
    try {
      const { examId, progress, score, totalQuestions, answeredCount } = req.body;
      const userId = req.user.userId;

      if (!examId || !progress || !score || !totalQuestions || answeredCount === undefined) {
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
  }

  async resetProgress(req, res) {
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
  }

  async getUserExamHistory(req, res) {
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
    } catch (error) {
      console.error('Error getting user history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user history',
        details: error.message
      });
    }
  }

  async getExamStats(req, res) {
    try {
      const { examId } = req.params;
      const userId = req.user.userId;

      const stats = await progressService.getExamStats(userId, examId);
      
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
  }

  async getCompletedExamIds(req, res) {
    try {
      const userId = req.user.userId;

      const examIds = await progressService.getCompletedExamIds(userId);
      
      res.json({
        success: true,
        examIds
      });
    } catch (error) {
      console.error('Error getting completed exam IDs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get completed exam IDs',
        details: error.message
      });
    }
  }

  async getDailyProgress(req, res) {
    try {
      const { examId } = req.query;
      const userId = req.user.userId;

      const dailyProgress = await progressService.getDailyProgress(userId, examId);
      
      res.json({
        success: true,
        dailyProgress: dailyProgress
      });
    } catch (error) {
      console.error('Error getting daily progress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get daily progress',
        details: error.message
      });
    }
  }
}

module.exports = new ProgressController();
