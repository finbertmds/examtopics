const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  examId: {
    type: String,
    required: true,
    index: true
  },
  progress: {
    type: Map,
    of: {
      topicNumber: Number,
      questionNumber: Number,
      selectedAnswers: [String],
      isCorrect: Boolean,
      answeredAt: Date
    },
    default: new Map()
  },
  markedForTraining: {
    type: [String],
    default: [],
    // Used for: Training mode, personalized learning, progress tracking
    // Future features: Review marked questions, create study plans
  },
  score: {
    totalQuestions: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0
    }
  },
  answeredCount: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
historySchema.index({ userId: 1, examId: 1, submittedAt: -1 });

// Static method to save history
historySchema.statics.saveHistory = async function(userId, examId, progress, score, totalQuestions, answeredCount) {
  try {
    const history = new this({
      userId,
      examId,
      progress: new Map(Object.entries(progress.answers || {})),
      markedForTraining: progress.markedForTraining || [],
      score: {
        totalQuestions: score.totalQuestions || totalQuestions,
        correctAnswers: score.correctAnswers || 0,
        accuracy: score.accuracy || 0
      },
      answeredCount
    });

    await history.save();
    console.log(`History saved for user ${userId}, exam ${examId}`);
    return history;
  } catch (error) {
    console.error('Error saving history:', error);
    throw error;
  }
};

// Static method to get user's exam history
historySchema.statics.getUserExamHistory = async function(userId, examId, limit = 10) {
  try {
    const history = await this.find({ userId, examId })
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();

    // Convert Map to object for JSON serialization
    return history.map(item => {
      let progressData = {};
      if (item.progress) {
        if (item.progress instanceof Map) {
          progressData = Object.fromEntries(item.progress);
        } else if (typeof item.progress === 'object') {
          progressData = item.progress;
        }
      }
      return {
        ...item,
        progress: progressData
      };
    });
  } catch (error) {
    console.error('Error getting user exam history:', error);
    throw error;
  }
};

// Static method to get user's all history
historySchema.statics.getUserHistory = async function(userId, limit = 50) {
  try {
    const history = await this.find({ userId })
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();

    // Convert Map to object for JSON serialization
    return history.map(item => {
      let progressData = {};
      if (item.progress) {
        if (item.progress instanceof Map) {
          progressData = Object.fromEntries(item.progress);
        } else if (typeof item.progress === 'object') {
          progressData = item.progress;
        }
      }
      return {
        ...item,
        progress: progressData
      };
    });
  } catch (error) {
    console.error('Error getting user history:', error);
    throw error;
  }
};

// Static method to get exam statistics
historySchema.statics.getExamStats = async function(examId) {
  try {
    const stats = await this.aggregate([
      { $match: { examId } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          avgAccuracy: { $avg: '$score.accuracy' },
          avgAnsweredCount: { $avg: '$answeredCount' },
          maxAccuracy: { $max: '$score.accuracy' },
          minAccuracy: { $min: '$score.accuracy' }
        }
      }
    ]);

    return stats[0] || {
      totalSubmissions: 0,
      avgAccuracy: 0,
      avgAnsweredCount: 0,
      maxAccuracy: 0,
      minAccuracy: 0
    };
  } catch (error) {
    console.error('Error getting exam stats:', error);
    throw error;
  }
};

module.exports = mongoose.model('History', historySchema);
