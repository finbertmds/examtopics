const test = require('node:test');
const assert = require('node:assert/strict');

const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Progress = require('../models/Progress');
const History = require('../models/History');
const progressService = require('../services/progressService');

test('health stats count documents from the correct collections', async () => {
  const models = [User, Exam, Question, Progress, History];
  const originalCountDocuments = models.map((model) => model.countDocuments);
  const counts = [7, 11, 1300, 19, 43];

  models.forEach((model, index) => {
    model.countDocuments = async () => counts[index];
  });

  try {
    const stats = await progressService.getStats();

    assert.deepEqual(stats, {
      totalUsers: 7,
      totalExams: 11,
      totalQuestions: 1300,
      totalProgressRecords: 19,
      totalSubmissions: 43,
      dataSizeBytes: null,
      storageSizeBytes: null,
      indexSizeBytes: null,
    });
  } finally {
    models.forEach((model, index) => {
      model.countDocuments = originalCountDocuments[index];
    });
  }
});
