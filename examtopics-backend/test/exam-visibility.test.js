const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const Exam = require('../models/Exam');
const Question = require('../models/Question');
const examService = require('../services/examService');
const { getUserFromToken } = require('../services/authService');

test('new exams are private by default', () => {
  const exam = new Exam({
    code: 'new-private-exam',
    name: 'New exam',
    description: 'Description',
  });

  assert.equal(exam.isPublished, false);
});

test('read filters expose public and legacy exams plus the current user private exams', async () => {
  const originalFind = Exam.find;
  const capturedFilters = [];

  Exam.find = (filter) => {
    capturedFilters.push(filter);
    return { sort: async () => [] };
  };

  try {
    await examService.getAllExams();
    await examService.getAllExams('owner-1');

    assert.deepEqual(capturedFilters[0], {
      $or: [
        { isPublished: true },
        { isPublished: { $exists: false } },
      ],
    });
    assert.deepEqual(capturedFilters[1], {
      $or: [
        { isPublished: true },
        { isPublished: { $exists: false } },
        { createdBy: 'owner-1' },
      ],
    });
  } finally {
    Exam.find = originalFind;
  }
});

test('a non-owner cannot update or delete an exam', async () => {
  const originalFindOne = Exam.findOne;
  const originalFindOneAndUpdate = Exam.findOneAndUpdate;
  const originalFindOneAndDelete = Exam.findOneAndDelete;
  const originalDeleteMany = Question.deleteMany;
  let mutated = false;

  Exam.findOne = async () => ({ createdBy: 'owner-1' });
  Exam.findOneAndUpdate = async () => {
    mutated = true;
  };
  Exam.findOneAndDelete = async () => {
    mutated = true;
  };
  Question.deleteMany = async () => {
    mutated = true;
  };

  try {
    assert.deepEqual(
      await examService.updateExamWithQuestions('private-exam', { isPublished: true }, null, 'owner-2'),
      { error: 'Forbidden' }
    );
    assert.deepEqual(
      await examService.deleteExam('private-exam', 'owner-2'),
      { error: 'Forbidden' }
    );
    assert.equal(mutated, false);
  } finally {
    Exam.findOne = originalFindOne;
    Exam.findOneAndUpdate = originalFindOneAndUpdate;
    Exam.findOneAndDelete = originalFindOneAndDelete;
    Question.deleteMany = originalDeleteMany;
  }
});

test('optional authentication resolves a valid token before continuing', async () => {
  const token = jwt.sign({ userId: 'owner-1' }, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
  const req = { headers: { authorization: `Bearer ${token}` } };

  await new Promise((resolve) => {
    getUserFromToken(req, {}, () => {
      assert.equal(req.user.userId, 'owner-1');
      resolve();
    });
  });
});

test('optional authentication treats an invalid token as anonymous', async () => {
  const req = { headers: { authorization: 'Bearer invalid-token' } };

  await new Promise((resolve) => {
    getUserFromToken(req, {}, () => {
      assert.equal(req.user, undefined);
      resolve();
    });
  });
});
