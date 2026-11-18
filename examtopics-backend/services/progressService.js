const mongoose = require('mongoose');
const Progress = require('../models/Progress');
const History = require('../models/History');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Debouncer = require('../utils/debounce');

class ProgressService {
  constructor() {
    this.debouncer = new Debouncer(1000); // 1 second delay
  }
  // Save progress for a user
  async saveProgress(userId, examId, progressData) {
    // Use safe update method with retry logic
    const updateData = {
      answers: new Map(Object.entries(progressData.answers || {})),
      markedForTraining: progressData.markedForTraining || [],
      currentTopic: progressData.currentTopic,
      currentQuestion: progressData.currentQuestion || 1,
      isRandomized: progressData.isRandomized || false
    };

    await Progress.safeUpdateProgress(userId, examId, updateData);
    return true;
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
    const progress = await Progress.findByUserAndExam(userId, examId);

    const historyMarkedForTraining = await History.findAllByUserAndExam(userId, examId);
    const mergedMarkedForTraining = [
      ...(progress?.markedForTraining || []),
      ...historyMarkedForTraining.flatMap(item => item.markedForTraining || [])
    ];
    const markedForTraining = Array.from(new Set(mergedMarkedForTraining));

    if (progress) {
      const result = Object.create(null);
      // Convert Map to object for JSON serialization
      const progressData = {
        examId: progress.examId,
        answers: Object.fromEntries(progress.answers),
        markedForTraining: markedForTraining,
        currentTopic: progress.currentTopic,
        currentQuestion: progress.currentQuestion,
        isRandomized: progress.isRandomized,
        lastUpdated: progress.updatedAt
      };
      result[examId] = progressData;
      return result;
    }

    return null;
  }

  // Get all progress for a user
  async getAllProgress(userId) {
    const progressList = await Progress.findAllByUser(userId);
    const result = Object.create(null);

    for (const progress of progressList) {
      const historyMarkedForTraining = await History.findAllByUserAndExam(userId, progress.examId);
      const mergedMarkedForTraining = [
        ...(progress?.markedForTraining || []),
        ...historyMarkedForTraining.flatMap(item => item.markedForTraining || [])
      ];
      const markedForTraining = Array.from(new Set(mergedMarkedForTraining));
      result[progress.examId] = {
        examId: progress.examId,
        answers: Object.fromEntries(progress.answers),
        markedForTraining: markedForTraining,
        currentTopic: progress.currentTopic,
        currentQuestion: progress.currentQuestion,
        isRandomized: progress.isRandomized,
        lastUpdated: progress.updatedAt,
        score: progress.score
      };
    }

    return result;
  }

  // Delete progress for a user
  async deleteProgress(userId, examId) {
    const result = await Progress.deleteOne({ userId, examId });
    const deleted = result.deletedCount > 0;


    return deleted;
  }

  // Delete all progress for a user
  async deleteAllProgress(userId) {
    const result = await Progress.deleteMany({ userId });
    const deleted = result.deletedCount > 0;


    return deleted;
  }

  // Add single answer (atomic operation)
  async addAnswer(userId, examId, topicNumber, questionNumber, selectedAnswers, isCorrect) {
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
          currentTopic: topicNumber,
          currentQuestion: questionNumber + 1
        }
      },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    // Update score separately
    await this.updateScore(userId, examId);
    return progress;
  }

  // Toggle training mark (atomic operation)
  async toggleTrainingMark(userId, examId, topicNumber, questionNumber, isMarkedForTraining) {
    const key = `${topicNumber}-${questionNumber}`;
    const progress = await Progress.findOne({ userId, examId });
    if (!progress) {
      throw new Error('Progress not found');
    }

    if (isMarkedForTraining || progress.markedForTraining.includes(key)) {
      await Progress.findOneAndUpdate(
        { userId, examId },
        { $set: { markedForTraining: isMarkedForTraining ? [...progress.markedForTraining, key] : progress.markedForTraining.filter(q => q !== key) } },
        { returnDocument: 'after' }
      );
    }

    if (!isMarkedForTraining) {
      await History.updateMany({ userId, examId }, { $pull: { markedForTraining: key } });
    }

  }

  // Update score only (atomic operation)
  async updateScore(userId, examId) {
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
  }

  // Save to history using History model
  async saveToHistory(userId, examId, progress, score, totalQuestions, answeredCount) {
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
  }

  // Get user's exam history
  async getUserExamHistory(userId, examId, limit = 10) {
    return await History.getUserExamHistory(userId, examId, limit);
  }

  // Get user's all history
  async getUserHistory(userId, limit = 50) {
    return await History.getUserHistory(userId, limit);
  }

  // Get exam statistics
  async getExamStats(userId, examId) {
    return await History.getExamStats(userId, examId);
  }

  // Get completed exam IDs for a user
  async getCompletedExamIds(userId) {
    return await History.getCompletedExamIds(userId);
  }

  // Get daily progress tracking
  async getDailyProgress(userId, examId) {
    let historyDailyProgress = await History.getDailyProgress(userId, examId == 'all' ? null : examId);
    let progressDailyProgress = await Progress.getDailyProgress(userId, examId == 'all' ? null : examId);

    const normalizeDailyProgress = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (data instanceof Map) {
        return Array.from(data.entries()).map(([date, count]) => ({ date, count }));
      }
      if (typeof data === 'object') {
        return Object.entries(data).map(([date, count]) => ({ date, count }));
      }
      return [];
    };

    const historyArray = normalizeDailyProgress(historyDailyProgress);
    const progressArray = normalizeDailyProgress(progressDailyProgress);

    const mergedByDate = new Map();

    for (const { date, count } of [...historyArray, ...progressArray]) {
      if (!date) continue;
      const currentCount = mergedByDate.get(date) || 0;
      mergedByDate.set(date, currentCount + (count || 0));
    }

    const result = Array.from(mergedByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;
  }

  // Reset progress
  async resetProgress(userId, examId) {
    const result = await Progress.findOneAndUpdate(
      { userId, examId },
      {
        $set: {
          answers: new Map(),
          markedForTraining: [],
          currentTopic: 1,
          currentQuestion: 1,
          isRandomized: false,
          score: {
            totalQuestions: 0,
            correctAnswers: 0,
            accuracy: 0
          }
        }
      },
      { returnDocument: 'after' }
    );

    return result;
  }

  // Get database-wide document counts and physical storage statistics.
  async getStats() {
    const [
      totalUsers,
      totalExams,
      totalQuestions,
      totalProgressRecords,
      totalSubmissions,
    ] = await Promise.all([
      User.countDocuments(),
      Exam.countDocuments(),
      Question.countDocuments(),
      Progress.countDocuments(),
      History.countDocuments(),
    ]);

    let dataSizeBytes = null;
    let storageSizeBytes = null;
    let indexSizeBytes = null;

    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      try {
        const databaseStats = await mongoose.connection.db.command({ dbStats: 1, scale: 1 });
        dataSizeBytes = databaseStats.dataSize ?? null;
        storageSizeBytes = databaseStats.storageSize ?? null;
        indexSizeBytes = databaseStats.indexSize ?? null;
      } catch {
        // Some managed MongoDB roles do not grant dbStats. Counts remain authoritative.
        console.warn('Database size stats unavailable');
      }
    }

    return {
      totalUsers,
      totalExams,
      totalQuestions,
      totalProgressRecords,
      totalSubmissions,
      dataSizeBytes,
      storageSizeBytes,
      indexSizeBytes,
    };
  }
}

module.exports = new ProgressService();
