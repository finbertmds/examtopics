const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  slug: {
    type: String,
  },
  file: {
    type: String,
  },
  description: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  category: {
    type: String,
  },
  difficulty: {
    type: String,
  },
  estimatedTime: {
    type: Number,
  },
  tags: [{
    type: String,
  }],
  questionCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: String,
    required: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
});

// Create index on name for quick search
examSchema.index({ name: 1 });
examSchema.index({ isPublished: 1, createdBy: 1, createdAt: -1 });

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
