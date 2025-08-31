const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  examId: {
    type: String,
    required: true,
    trim: true
  },
  answers: {
    type: Map,
    of: {
      questionNumber: Number,
      selectedAnswers: [String],
      isCorrect: Boolean,
      answeredAt: {
        type: Date,
        default: Date.now
      }
    },
    default: new Map()
  },
  markedForTraining: {
    type: [Number],
    default: []
  },
  currentQuestion: {
    type: Number,
    default: 1
  },
  isRandomized: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
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
  // Version field for optimistic locking
  __v: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, examId: 1 }, { unique: true });
progressSchema.index({ userId: 1, updatedAt: -1 });

// Instance methods
progressSchema.methods.updateScore = function() {
  const totalQuestions = this.answers.size;
  const correctAnswers = Array.from(this.answers.values()).filter(answer => answer.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  this.score = {
    totalQuestions,
    correctAnswers,
    accuracy
  };
  
  // Don't call save() here to avoid parallel save issues
  return this;
};

progressSchema.methods.addAnswer = function(questionNumber, selectedAnswers, isCorrect) {
  this.answers.set(questionNumber.toString(), {
    questionNumber,
    selectedAnswers,
    isCorrect,
    answeredAt: new Date()
  });
  
  this.currentQuestion = questionNumber + 1;
  this.updateScore(); // Update score without saving
  return this;
};

progressSchema.methods.toggleTrainingMark = function(questionNumber) {
  const index = this.markedForTraining.indexOf(questionNumber);
  if (index > -1) {
    this.markedForTraining.splice(index, 1);
  } else {
    this.markedForTraining.push(questionNumber);
  }
  return this; // Return this instead of save() to avoid parallel save
};

progressSchema.methods.resetProgress = function() {
  this.answers = new Map();
  this.markedForTraining = [];
  this.currentQuestion = 1;
  this.isRandomized = false;
  this.completedAt = null;
  this.score = {
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0
  };
  return this; // Return this instead of save() to avoid parallel save
};

// Static methods
progressSchema.statics.findByUserAndExam = function(userId, examId) {
  return this.findOne({ userId, examId });
};

progressSchema.statics.findAllByUser = function(userId) {
  return this.find({ userId }).sort({ updatedAt: -1 });
};

progressSchema.statics.findOrCreateProgress = async function(userId, examId) {
  let progress = await this.findByUserAndExam(userId, examId);
  
  if (!progress) {
    progress = new this({
      userId,
      examId
    });
    await progress.save();
  }
  
  return progress;
};

// Safe update method with atomic operations
progressSchema.statics.safeUpdateProgress = async function(userId, examId, updateData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Calculate score from updateData
      const answers = updateData.answers || new Map();
      const totalQuestions = answers.size;
      const correctAnswers = Array.from(answers.values()).filter(answer => answer.isCorrect).length;
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      const scoreData = {
        totalQuestions,
        correctAnswers,
        accuracy
      };
      
      // Use findOneAndUpdate for atomic operation
      const progress = await this.findOneAndUpdate(
        { userId, examId },
        {
          $set: {
            answers: Object.fromEntries(answers),
            markedForTraining: updateData.markedForTraining || [],
            currentQuestion: updateData.currentQuestion || 1,
            isRandomized: updateData.isRandomized || false,
            score: scoreData
          }
        },
        {
          new: true,
          upsert: true, // Create if doesn't exist
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );
      
      return progress;
      
    } catch (error) {
      if ((error.name === 'VersionError' || error.code === 11000) && attempt < maxRetries) {
        // Version conflict or duplicate key, retry
        console.log(`Conflict on attempt ${attempt}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Exponential backoff
        continue;
      }
      
      throw error;
    }
  }
  
  throw new Error(`Failed to update progress after ${maxRetries} attempts`);
};

// Note: Pre-save middleware removed to prevent ParallelSaveError
// Score calculation is now handled in safeUpdateProgress method

module.exports = mongoose.model('Progress', progressSchema);
