const test = require('node:test');
const assert = require('node:assert/strict');
const { Types } = require('mongoose');

const Exam = require('../models/Exam');
const Question = require('../models/Question');
const examService = require('../services/examService');
const examController = require('../controllers/examController');
const progressController = require('../controllers/progressController');
const progressService = require('../services/progressService');

function response() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

// SEC-024: question links are rendered as hrefs.
test('question edits reject non-http(s) links before any write', async (t) => {
  const exam = { _id: new Types.ObjectId(), code: 'sample-exam', createdBy: 'owner' };
  t.mock.method(Exam, 'findOne', async () => exam);
  const transaction = t.mock.method(Exam.db, 'transaction', async (work) => work(Symbol('session')));
  t.mock.method(Exam, 'updateOne', async () => ({ matchedCount: 1 }));
  const writes = [];
  t.mock.method(Question, 'findOneAndUpdate', async (filter, update) => { writes.push(update); return { ...update }; });

  for (const link of ['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,<script>x</script>', 'vbscript:x', '//evil.example', 'not a url', 42, { $ne: null }]) {
    assert.deepEqual(await examService.updateExamQuestion('sample-exam', 1, 1, 'owner', { link }), { error: 'InvalidLink' }, String(link));
  }
  assert.equal(transaction.mock.callCount(), 0);
  assert.equal(writes.length, 0);

  for (const link of ['https://www.examtopics.com/discussions/1', 'http://example.com/x', '']) {
    await examService.updateExamQuestion('sample-exam', 1, 1, 'owner', { link });
  }
  assert.deepEqual(writes.map((update) => update.link), ['https://www.examtopics.com/discussions/1', 'http://example.com/x', '']);
});

test('the question edit endpoint maps an invalid link to 400', async (t) => {
  t.mock.method(examService, 'updateExamQuestion', async () => ({ error: 'InvalidLink' }));
  const res = response();
  await examController.updateQuestion({
    params: { code: 'sample-exam', questionNumber: '1' },
    body: { topic_number: 1, link: 'javascript:alert(1)' },
    user: { userId: 'owner' },
  }, res, (error) => { throw error; });
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /http\(s\)/);
});

test('imported questions keep http(s) links and drop unsafe ones', async (t) => {
  t.mock.method(Exam, 'findOne', async () => null);
  t.mock.method(Exam.db, 'transaction', async (work) => work(Symbol('session')));
  t.mock.method(Exam.prototype, 'save', async () => {});
  const inserted = [];
  t.mock.method(Question, 'insertMany', async (batch) => { inserted.push(...batch); return batch; });

  await examService.createExamWithQuestions({ code: 'links', name: 'N', description: 'D' }, [
    { question_number: 1, link: 'https://www.examtopics.com/discussions/1' },
    { question_number: 2, link: 'javascript:alert(1)' },
    { question_number: 3, link: { $gt: '' } },
    { question_number: 4 },
  ], 'owner');
  assert.deepEqual(inserted.map((question) => question.link), ['https://www.examtopics.com/discussions/1', '', '', '']);
});

// SEC-026: the exam code reaches Exam.findOne({ code }).
test('exam creation requires a bounded slug code when one is given', async (t) => {
  const create = t.mock.method(examService, 'createExamWithQuestions', async (data) => ({ code: data.code }));
  const call = async (body) => {
    const res = response();
    await examController.createExam({ body: { name: 'N', description: 'D', ...body }, user: { userId: 'owner' } }, res, (error) => { throw error; });
    return res;
  };

  for (const code of [{ $ne: null }, ['aws'], 42, '', '   ', 'x'.repeat(129), '../x', 'a/b', 'a\\b', ' aws', 'aws ', 'a\u0000b', '%2e%2e', '.hidden', 'a?b', 'a#b']) {
    assert.equal((await call({ code })).statusCode, 400, JSON.stringify(code));
  }
  assert.equal(create.mock.callCount(), 0);

  for (const code of ['aws-saa-c03', 'pcpp-32-101', 'AWS_SAA.C03', 'x'.repeat(128)]) {
    assert.equal((await call({ code })).statusCode, 201, code);
  }
  assert.equal((await call({})).statusCode, 201);
  assert.equal(create.mock.callCount(), 5);
});

// SEC-025: history queries only read the caller's data but must stay bounded.
test('history limits default, accept 1..100 and reject anything else', async (t) => {
  const calls = [];
  t.mock.method(progressService, 'getUserHistory', async (userId, limit) => { calls.push(['all', limit]); return []; });
  t.mock.method(progressService, 'getUserExamHistory', async (userId, examId, limit) => { calls.push(['exam', limit]); return []; });
  const call = async (method, query) => {
    const res = response();
    await progressController[method]({ query, params: { examId: 'sample-exam' }, user: { userId: 'u1' } }, res);
    return res.statusCode;
  };

  assert.equal(await call('getUserHistory', {}), 200);
  assert.equal(await call('getUserExamHistory', {}), 200);
  assert.equal(await call('getUserHistory', { limit: '100' }), 200);
  assert.equal(await call('getUserExamHistory', { limit: '1' }), 200);
  for (const limit of ['0', '101', '1e9', '-5', '2.5', 'abc', '', ['5', '6']]) {
    assert.equal(await call('getUserHistory', { limit }), 400, JSON.stringify(limit));
    assert.equal(await call('getUserExamHistory', { limit }), 400, JSON.stringify(limit));
  }
  assert.deepEqual(calls, [['all', 50], ['exam', 10], ['all', 100], ['exam', 1]]);
});
