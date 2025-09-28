const Progress = require('./models/Progress');
const History = require('./models/History');
const Debouncer = require('./utils/debounce');

class ProgressService {
  constructor() {
    this.debouncer = new Debouncer(1000); // 1 second delay
  }
  // Save progress for a user
  async saveProgress(userId, examId, progressData) {
    try {
      // Use safe update method with retry logic
      const updateData = {
        answers: new Map(Object.entries(progressData.answers || {})),
        markedForTraining: progressData.markedForTraining || [],
        currentQuestion: progressData.currentQuestion || 1,
        isRandomized: progressData.isRandomized || false
      };
      
      await Progress.safeUpdateProgress(userId, examId, updateData);
      console.log(`Progress saved for user ${userId}, exam ${examId}`);
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }

  // Debounced save progress to reduce database calls
  debouncedSaveProgress(userId, examId, progressData) {
    const key = `${userId}-${examId}`;
    
    return new Promise((resolve, reject) => {
      this.debouncer.debounce(key, async () => {
        try {
          await this.saveProgress(userId, examId, progressData);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Load progress for a user
  async loadProgress(userId, examId) {
    try {
      const progress = await Progress.findByUserAndExam(userId, examId);
      
      if (progress) {
        console.log(`Progress loaded for user ${userId}, exam ${examId}`);
        const result = {};
        // Convert Map to object for JSON serialization
        const progressData = {
          examId: progress.examId,
          answers: Object.fromEntries(progress.answers),
          markedForTraining: progress.markedForTraining,
          currentQuestion: progress.currentQuestion,
          isRandomized: progress.isRandomized,
          lastUpdated: progress.updatedAt
        };
        result[examId] = progressData;
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading progress:', error);
      throw error;
    }
  }

  // Get all progress for a user
  async getAllProgress(userId) {
    try {
      const progressList = await Progress.findAllByUser(userId);
      const result = {};
      
      for (const progress of progressList) {
        result[progress.examId] = {
          examId: progress.examId,
          answers: Object.fromEntries(progress.answers),
          markedForTraining: progress.markedForTraining,
          currentQuestion: progress.currentQuestion,
          isRandomized: progress.isRandomized,
          lastUpdated: progress.updatedAt,
          score: progress.score
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error loading all progress:', error);
      throw error;
    }
  }

  // Delete progress for a user
  async deleteProgress(userId, examId) {
    try {
      const result = await Progress.deleteOne({ userId, examId });
      const deleted = result.deletedCount > 0;
      
      if (deleted) {
        console.log(`Progress deleted for user ${userId}, exam ${examId}`);
      }
      
      return deleted;
    } catch (error) {
      console.error('Error deleting progress:', error);
      throw error;
    }
  }

  // Delete all progress for a user
  async deleteAllProgress(userId) {
    try {
      const result = await Progress.deleteMany({ userId });
      const deleted = result.deletedCount > 0;
      
      if (deleted) {
        console.log(`All progress deleted for user ${userId}`);
      }
      
      return deleted;
    } catch (error) {
      console.error('Error deleting all progress:', error);
      throw error;
    }
  }

  // Add single answer (atomic operation)
  async addAnswer(userId, examId, topicNumber, questionNumber, selectedAnswers, isCorrect) {
    try {
      const key = `${topicNumber}-${questionNumber}`;
      const progress = await Progress.findOneAndUpdate(
        { userId, examId },
        {
          $set: {
            [`answers.${key}`]: {
              topicNumber,
              questionNumber,
              selectedAnswers,
              isCorrect,
              answeredAt: new Date()
            },
            currentQuestion: questionNumber + 1
          }
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );

      // Update score separately
      await this.updateScore(userId, examId);
      return progress;
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  }

  // Toggle training mark (atomic operation)
  async toggleTrainingMark(userId, examId, topicNumber, questionNumber) {
    try {
      const key = `${topicNumber}-${questionNumber}`;
      const progress = await Progress.findOne({ userId, examId });
      if (!progress) {
        throw new Error('Progress not found');
      }

      const index = progress.markedForTraining.indexOf(key);
      const update = index > -1
        ? { $pull: { markedForTraining: key } }
        : { $addToSet: { markedForTraining: key } };

      const updatedProgress = await Progress.findOneAndUpdate(
        { userId, examId },
        update,
        { new: true }
      );

      return updatedProgress;
    } catch (error) {
      console.error('Error toggling training mark:', error);
      throw error;
    }
  }

  // Update score only (atomic operation)
  async updateScore(userId, examId) {
    try {
      const progress = await Progress.findOne({ userId, examId });
      if (!progress) return null;

      const totalQuestions = progress.answers.size;
      const correctAnswers = Array.from(progress.answers.values()).filter(answer => answer.isCorrect).length;
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      await Progress.findOneAndUpdate(
        { userId, examId },
        {
          $set: {
            'score.totalQuestions': totalQuestions,
            'score.correctAnswers': correctAnswers,
            'score.accuracy': accuracy
          }
        }
      );

      return { totalQuestions, correctAnswers, accuracy };
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    }
  }

  // Save to history using History model
  async saveToHistory(userId, examId, progress, score, totalQuestions, answeredCount) {
    try {
      // Validate and use the score object directly
      const calculatedScore = {
        totalQuestions: score?.totalQuestions || totalQuestions,
        correctAnswers: score?.correctAnswers || 0,
        accuracy: score?.accuracy || 0
      };

      // Save to History collection
      const history = await History.saveHistory(
        userId, 
        examId, 
        progress, 
        calculatedScore, 
        totalQuestions, 
        answeredCount
      );
      
      return history;
    } catch (error) {
      console.error('Error saving to history:', error);
      throw error;
    }
  }

  // Get user's exam history
  async getUserExamHistory(userId, examId, limit = 10) {
    try {
      return await History.getUserExamHistory(userId, examId, limit);
    } catch (error) {
      console.error('Error getting user exam history:', error);
      throw error;
    }
  }

  // Get user's all history
  async getUserHistory(userId, limit = 50) {
    try {
      return await History.getUserHistory(userId, limit);
    } catch (error) {
      console.error('Error getting user history:', error);
      throw error;
    }
  }

  // Get exam statistics
  async getExamStats(examId) {
    try {
      return await History.getExamStats(examId);
    } catch (error) {
      console.error('Error getting exam stats:', error);
      throw error;
    }
  }

  // Reset progress
  async resetProgress(userId, examId) {
    try {
      const result = await Progress.findOneAndUpdate(
        { userId, examId },
        {
          $set: {
            answers: new Map(),
            markedForTraining: [],
            currentQuestion: 1,
            isRandomized: false,
            score: {
              totalQuestions: 0,
              correctAnswers: 0,
              accuracy: 0
            }
          }
        },
        { new: true }
      );
      
      console.log(`Progress reset for user ${userId}, exam ${examId}`);
      return result;
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  }

  // Get storage stats (for debugging)
  async getStats() {
    try {
      const totalUsers = await Progress.distinct('userId').countDocuments();
      const totalExams = await Progress.countDocuments();
      
      return {
        totalUsers,
        totalExams,
        storageSize: totalExams
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalUsers: 0,
        totalExams: 0,
        storageSize: 0
      };
    }
  }
}

module.exports = new ProgressService();
