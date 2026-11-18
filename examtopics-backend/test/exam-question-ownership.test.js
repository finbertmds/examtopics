const test = require('node:test');
const assert = require('node:assert/strict');
const { Types } = require('mongoose');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const examService = require('../services/examService');

const currentExam = {
  _id: new Types.ObjectId(),
  code: 'sample-exam',
  createdBy: 'owner',
  isPublished: true,
};
const olderQuestion = {
  examId: new Types.ObjectId(),
  topic_number: 1,
  question_number: 1,
  question_text: 'Older exam question',
};
const legacyQuestion = {
  examId: currentExam.code,
  topic_number: 1,
  question_number: 1,
  question_text: 'Legacy question pending attribution',
};
const visibleQuestion = {
  examId: currentExam._id,
  topic_number: 1,
  question_number: 1,
  question_text: 'Current exam question',
};
const storedQuestions = [olderQuestion, legacyQuestion, visibleQuestion];

function useTestTransaction(t) {
  const session = Symbol('fixture session');
  t.mock.method(Exam.db, 'transaction', async (work) => work(session));
  return session;
}

function matchesFilter(record, filter) {
  return Object.entries(filter).every(([field, value]) => {
    const storedValue = record[field];
    return storedValue instanceof Types.ObjectId && value instanceof Types.ObjectId
      ? storedValue.equals(value)
      : storedValue === value;
  });
}

test('all question reads are scoped to the authorized exam record', async (t) => {
  t.mock.method(Exam, 'findOne', async () => currentExam);
  t.mock.method(Question, 'find', (filter) => ({
    sort: () => Object.assign(Promise.resolve(storedQuestions.filter((question) => matchesFilter(question, filter))), {
      limit() { return this; },
    }),
  }));
  t.mock.method(Question, 'findOne', async (filter) =>
    storedQuestions.find((question) => matchesFilter(question, filter)));
  t.mock.method(Question, 'countDocuments', async (filter) =>
    storedQuestions.filter((question) => matchesFilter(question, filter)).length);

  const list = await examService.getQuestionsByExamCode(currentExam.code);
  assert.deepEqual(list.data, [visibleQuestion]);
  assert.equal(list.pagination.total, 1);
  assert.equal(await examService.getQuestionByExamAndNumber(currentExam.code, 1, 1), visibleQuestion);
  const exported = await examService.exportExamQuestions(currentExam.code, currentExam.createdBy);
  assert.deepEqual(exported.map((question) => question.question_text), ['Current exam question']);
});

test('new question records use the exam ObjectId while the API serializes its public code', async (t) => {
  const session = useTestTransaction(t);
  t.mock.method(Exam, 'findOne', async () => null);
  t.mock.method(Exam.prototype, 'save', async function (options) {
    assert.equal(options?.session, session);
    return this;
  });
  let inserted;
  t.mock.method(Question, 'insertMany', async (questions, options) => {
    assert.equal(options.session, session);
    inserted = questions.map((question) => new Question(question));
    return inserted;
  });

  const exam = await examService.createExamWithQuestions(
    { code: currentExam.code, name: 'Sample', description: 'Fixture' },
    [{ question_number: 1, question_text: 'Prompt', answers: { A: 'Answer' } }],
    currentExam.createdBy,
  );

  assert.ok(inserted[0].examId instanceof Types.ObjectId);
  assert.ok(inserted[0].examId.equals(exam._id));
  const payload = JSON.parse(JSON.stringify(inserted[0]));
  assert.equal(payload.examId, currentExam.code);
  assert.equal(Object.hasOwn(payload, 'examCode'), false);
});

test('an exam deletion removes questions belonging to the deleted identity only', async (t) => {
  const session = useTestTransaction(t);
  t.mock.method(Exam, 'findOne', async () => currentExam);
  t.mock.method(Exam, 'findOneAndDelete', async (filter, options) => {
    assert.equal(options?.session, session);
    assert.ok(matchesFilter(currentExam, filter));
    assert.ok(Object.hasOwn(filter, '_id'));
    return currentExam;
  });
  let removed;
  t.mock.method(Question, 'deleteMany', async (filter, options) => {
    assert.equal(options?.session, session);
    removed = storedQuestions.filter((question) => matchesFilter(question, filter));
  });

  assert.deepEqual(await examService.deleteExam(currentExam.code, currentExam.createdBy), { exam: currentExam });
  assert.deepEqual(removed, [visibleQuestion]);
});

test('replacing or editing questions affects only the authorized identity', async (t) => {
  const session = useTestTransaction(t);
  t.mock.method(Exam, 'findOne', async () => currentExam);
  let hasParentLock = false;
  t.mock.method(Exam, 'updateOne', async (filter, update, options) => {
    assert.deepEqual(filter, { _id: currentExam._id, createdBy: currentExam.createdBy });
    assert.equal(options.session, session);
    assert.ok(update.$inc);
    hasParentLock = true;
    return { matchedCount: 1 };
  });
  t.mock.method(Exam, 'findOneAndUpdate', async (filter, fields, options) => {
    assert.equal(options.session, session);
    assert.ok(matchesFilter(currentExam, filter));
    assert.ok(Object.hasOwn(filter, '_id'));
    return { ...currentExam, ...fields };
  });
  let removed;
  t.mock.method(Question, 'deleteMany', async (filter, options) => {
    assert.equal(options.session, session);
    assert.ok(hasParentLock);
    removed = storedQuestions.filter((question) => matchesFilter(question, filter));
  });
  t.mock.method(Question, 'insertMany', async (questions, options) => {
    assert.equal(options.session, session);
    assert.ok(hasParentLock);
    assert.equal(questions.length, 1);
    assert.ok(questions[0].examId instanceof Types.ObjectId);
    assert.ok(questions[0].examId.equals(currentExam._id));
    return questions;
  });
  t.mock.method(Question, 'findOneAndUpdate', async (filter, fields, options) => {
    assert.equal(options.session, session);
    assert.ok(hasParentLock);
    const question = storedQuestions.find((row) => matchesFilter(row, filter));
    return { ...question, ...fields };
  });

  const edited = await examService.updateExamQuestion(currentExam.code, 1, 1, currentExam.createdBy, {
    question_text: 'Updated prompt',
  });
  assert.equal(edited.examId, currentExam._id);
  assert.equal(edited.question_text, 'Updated prompt');
  hasParentLock = false;
  const exam = await examService.updateExamWithQuestions(currentExam.code, { name: 'Updated' }, [
    { question_number: 1, question_text: 'First' },
    { topic_number: '1', question_number: '1', question_text: 'Duplicate' },
  ], currentExam.createdBy);
  assert.equal(exam.questionCount, 1);
  assert.deepEqual(removed, [visibleQuestion]);
});

test('a question edit stops when the current owner no longer matches the parent write', async (t) => {
  const session = useTestTransaction(t);
  t.mock.method(Exam, 'findOne', async () => currentExam);
  t.mock.method(Exam, 'updateOne', async (filter, _update, options) => {
    assert.deepEqual(filter, { _id: currentExam._id, createdBy: currentExam.createdBy });
    assert.equal(options.session, session);
    return { matchedCount: 0 };
  });
  t.mock.method(Question, 'findOneAndUpdate', async () => assert.fail('Child must remain untouched'));

  const result = await examService.updateExamQuestion(currentExam.code, 1, 1, currentExam.createdBy, {
    question_text: 'Updated prompt',
  });
  assert.deepEqual(result, { error: 'Forbidden' });
});
