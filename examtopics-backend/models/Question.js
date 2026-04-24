const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true,
    index: true,
  },
  question_number: {
    type: Number,
    required: true,
  },
  topic_number: {
    type: Number,
    default: 1,
  },
  title: {
    type: String,
  },
  question_text: {
    type: String,
    required: true,
  },
  answers: {
    type: Map,
    of: String, // Store like {"A": "First answer", "B": "Second answer"}
    required: true,
  },
  suggested_answer: {
    type: String,
    required: true, // "A, B" or "A"
  },
  answer: {
    type: String, // If not provided, typically same as suggested_answer, otherwise "B"
  },
  link: {
    type: String,
  },
  multiple_choice: {
    type: Boolean,
    default: false,
  },
  answer_images: {
    type: [String],
    default: [],
  },
  question_images: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

// Ensure question number is unique within a topic for an exam
questionSchema.index({ examId: 1, topic_number: 1, question_number: 1 }, { unique: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
