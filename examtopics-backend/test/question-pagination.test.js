const test = require('node:test');
const assert = require('node:assert/strict');
const { Types } = require('mongoose');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const controller = require('../controllers/examController');
const service = require('../services/examService');

async function list(query) {
  const response = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; },
  };
  await controller.getQuestionsByExamCode({ params: { code: 'fixture-exam' }, query }, response, (error) => { throw error; });
  return response;
}

test('question list rejects out-of-range or ambiguous pagination before querying MongoDB', async (t) => {
  t.mock.method(Exam, 'findOne', async () => assert.fail('Invalid pagination must not query MongoDB'));
  for (const query of [{ limit: '0' }, { limit: '101' }, { page: '1001' }, { page: '-1' },
    { limit: ['2', '3'] }, { limit: '1.5' }]) {
    const result = await list(query);
    assert.equal(result.statusCode, 400);
  }
});

test('question list limits the default query and reports the authorized exam version', async (t) => {
  const exam = { _id: new Types.ObjectId(), questionMutationVersion: 2 };
  t.mock.method(Exam, 'findOne', async () => exam);
  let requestedLimit;
  t.mock.method(Question, 'find', () => ({
    sort() { return this; },
    limit(limit) { requestedLimit = limit; return Promise.resolve([]); },
  }));
  t.mock.method(Question, 'countDocuments', async () => 0);

  const result = await list({});
  assert.equal(result.statusCode, 200);
  assert.equal(requestedLimit, 100);
  assert.equal(result.body.pagination.revision, `${exam._id}:2`);
});

test('service callers cannot request an unbounded question query', async (t) => {
  t.mock.method(Exam, 'findOne', async () => assert.fail('Invalid pagination must not query MongoDB'));
  await assert.rejects(service.getQuestionsByExamCode('fixture-exam', 1, 0), { status: 400 });
});

test('question list rejects a page read across a committed question change', async (t) => {
  const exam = { _id: new Types.ObjectId(), questionMutationVersion: 1 };
  let reads = 0;
  t.mock.method(Exam, 'findOne', async () => ({ ...exam, questionMutationVersion: ++reads }));
  t.mock.method(Question, 'find', () => ({
    sort() { return this; },
    limit() { return Promise.resolve([]); },
  }));
  t.mock.method(Question, 'countDocuments', async () => 0);

  assert.equal((await list({})).statusCode, 409);
});
