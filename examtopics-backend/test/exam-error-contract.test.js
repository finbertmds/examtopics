const test = require('node:test');
const assert = require('node:assert/strict');

const examService = require('../services/examService');
const examController = require('../controllers/examController');

// ARCH-003: every failure uses a 4xx status and an `error` field, never HTTP 200 with success:false.

function response() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

async function call(handler, req) {
  const res = response();
  await examController[handler]({ params: {}, user: { userId: 'owner-1' }, ...req }, res, (error) => { throw error; });
  return res;
}

function assertFailure(res, status, pattern) {
  assert.equal(res.statusCode, status);
  assert.equal(res.body.success, false);
  assert.match(res.body.error, pattern);
  assert.equal(res.body.message, undefined);
}

test('exam creation validation failures return 400 with an error field', async (t) => {
  const create = t.mock.method(examService, 'createExamWithQuestions', async () => ({ code: 'x' }));

  assertFailure(await call('createExam', { body: { name: 'N', description: 'D', questions: '{not json' } }), 400, /Invalid JSON/);
  assertFailure(await call('createExam', { body: { name: 'N', description: 'D', questions: { a: 1 } } }), 400, /must be an array/);
  assertFailure(await call('createExam', { body: { description: 'D' } }), 400, /Name and description are required/);
  assertFailure(await call('createExam', { body: { name: 'N' } }), 400, /Name and description are required/);
  assertFailure(await call('createExam', { body: { name: 'N', description: 'D', isPublished: 'yes' } }), 400, /isPublished/);
  assert.equal(create.mock.callCount(), 0);

  const ok = await call('createExam', { body: { name: 'N', description: 'D', questions: [] } });
  assert.equal(ok.statusCode, 201);
  assert.equal(ok.body.success, true);
});

test('a duplicate exam code returns 409', async (t) => {
  t.mock.method(examService, 'createExamWithQuestions', async () => {
    throw Object.assign(new Error('Duplicate exam code'), { code: 'DUPLICATE_EXAM_CODE' });
  });
  assertFailure(await call('createExam', { body: { name: 'N', description: 'D' } }), 409, /already exists/);

  t.mock.restoreAll();
  t.mock.method(examService, 'createExamWithQuestions', async () => {
    throw Object.assign(new Error('E11000'), { code: 11000, keyPattern: { code: 1 } });
  });
  assertFailure(await call('createExam', { body: { name: 'N', description: 'D' } }), 409, /already exists/);
});

test('exam update and question update validation failures return 400 with an error field', async (t) => {
  const update = t.mock.method(examService, 'updateExamWithQuestions', async () => ({ code: 'x' }));
  const updateQuestion = t.mock.method(examService, 'updateExamQuestion', async () => ({ question_number: 1 }));

  assertFailure(await call('updateExam', { params: { code: 'x' }, body: { questions: '[' } }), 400, /Invalid JSON/);
  assertFailure(await call('updateExam', { params: { code: 'x' }, body: { questions: 'true' } }), 400, /must be an array/);
  assert.equal(update.mock.callCount(), 0);

  assertFailure(await call('updateQuestion', { params: { code: 'x', questionNumber: '1' }, body: { topic_number: 1 } }), 400, /at least one field/);
  assert.equal(updateQuestion.mock.callCount(), 0);

  const ok = await call('updateExam', { params: { code: 'x' }, body: { questions: [] } });
  assert.equal(ok.statusCode, 200);
  assert.deepEqual(ok.body, { success: true, exam: { code: 'x' } });
});
