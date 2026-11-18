const test = require('node:test');
const assert = require('node:assert/strict');
const controller = require('../controllers/progressController');
const service = require('../services/progressService');

async function invoke(method, body, query = {}, params = {}) {
  const req = { body, query, params, user: { userId: 'signed-in-user' } };
  const res = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
  await controller[method](req, res);
  return res;
}

test('progress writes require a nonblank scalar exam ID', async (t) => {
  const calls = [];
  t.mock.method(service, 'resetProgress', (...args) => calls.push(args));
  assert.equal((await invoke('resetProgress', { examId: ['sample-exam'] })).statusCode, 400);
  assert.equal((await invoke('resetProgress', { examId: '  ' })).statusCode, 400);
  assert.equal((await invoke('resetProgress', { examId: 'sample-exam' })).statusCode, 200);
  assert.deepEqual(calls, [['signed-in-user', 'sample-exam']]);
});

test('answer and training paths require positive safe integer question references', async (t) => {
  const calls = [];
  t.mock.method(service, 'addAnswer', (...args) => {
    calls.push(args);
    return { answers: new Map() };
  });
  t.mock.method(service, 'toggleTrainingMark', (...args) => calls.push(args));
  const input = {
    examId: 'sample-exam', topicNumber: 1, questionNumber: 2,
    selectedAnswers: ['A'], isCorrect: false, isMarkedForTraining: false,
  };
  for (const method of ['addAnswer', 'toggleTrainingMark']) {
    for (const invalid of ['2', 0, -1, 2.5, Number.MAX_SAFE_INTEGER + 1]) {
      assert.equal((await invoke(method, { ...input, questionNumber: invalid })).statusCode, 400);
    }
    assert.equal((await invoke(method, { ...input, topicNumber: [] })).statusCode, 400);
    assert.equal((await invoke(method, input)).statusCode, 200);
  }
  assert.deepEqual(calls, [
    ['signed-in-user', 'sample-exam', 1, 2, ['A'], false],
    ['signed-in-user', 'sample-exam', 1, 2, false],
  ]);
});

test('bulk saves and submissions require well-formed question keys', async (t) => {
  const saves = [];
  const submissions = [];
  t.mock.method(service, 'saveProgress', (...args) => saves.push(args));
  t.mock.method(service, 'saveToHistory', (...args) => submissions.push(args));
  t.mock.method(service, 'resetProgress', async () => {});
  const answer = { topicNumber: 1, questionNumber: 2, selectedAnswers: ['A'], isCorrect: true };
  const progress = { answers: { '1-2': answer }, markedForTraining: ['1-2'] };
  const body = {
    examId: 'sample-exam', progress,
    score: { totalQuestions: 2, correctAnswers: 1, accuracy: 50 },
    totalQuestions: 2, answeredCount: 1,
  };
  for (const method of ['saveProgress', 'submitProgress']) {
    for (const badProgress of [
      { answers: { '0-2': answer } },
      { answers: { '1-2': { ...answer, topicNumber: 2 } } },
      { markedForTraining: ['1-0'] },
      { currentTopic: 1.5 },
    ]) {
      assert.equal((await invoke(method, { ...body, progress: badProgress })).statusCode, 400);
    }
    assert.equal((await invoke(method, body)).statusCode, 200);
  }
  assert.deepEqual(saves, [['signed-in-user', 'sample-exam', progress]]);
  assert.deepEqual(submissions, [['signed-in-user', 'sample-exam', progress, body.score, 2, 1]]);
});

test('daily tracking accepts all exams or one scalar exam ID', async (t) => {
  const calls = [];
  t.mock.method(service, 'getDailyProgress', (...args) => { calls.push(args); return []; });
  assert.equal((await invoke('getDailyProgress', undefined, { examId: ['sample-exam'] })).statusCode, 400);
  assert.equal((await invoke('getDailyProgress', undefined)).statusCode, 200);
  assert.equal((await invoke('getDailyProgress', undefined, { examId: 'all' })).statusCode, 200);
  assert.equal((await invoke('getDailyProgress', undefined, { examId: 'sample-exam' })).statusCode, 200);
  assert.deepEqual(calls, [['signed-in-user', undefined], ['signed-in-user', 'all'], ['signed-in-user', 'sample-exam']]);
});

test('progress reads reject blank exam IDs before querying', async (t) => {
  for (const method of ['loadProgress', 'getUserExamHistory', 'getExamStats']) {
    t.mock.method(service, method, () => assert.fail('Invalid exam ID must not query MongoDB'));
    assert.equal((await invoke(method, undefined, {}, { examId: '  ' })).statusCode, 400);
  }
});
