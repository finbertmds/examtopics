const test = require('node:test');
const assert = require('node:assert/strict');
const History = require('../models/History');
const Exam = require('../models/Exam');
const controller = require('../controllers/progressController');

const name = { en: 'Solutions Architect', vi: 'Kiến trúc sư giải pháp', ja: 'ソリューションアーキテクト' };
const summary = { code: 'SAA-C03', name };
const row = { _id: 'history-1', examId: 'SAA-C03', progress: {}, markedForTraining: [], score: { accuracy: 100 }, answeredCount: 1 };

async function invoke(method) {
  const req = { user: { userId: 'owner-1' }, params: { examId: 'SAA-C03' }, query: {} };
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; } };
  await controller[method](req, res);
  assert.equal(res.statusCode, 200);
  return res.body;
}

for (const [endpoint, source] of [['getUserHistory', 'getUserHistory'], ['getUserExamHistory', 'getUserExamHistory']]) {
  test(`${endpoint} includes exam code and multilingual name using one scoped batch query`, async t => {
    t.mock.method(History, source, async (userId) => {
      assert.equal(userId, 'owner-1');
      return [row, { ...row, _id: 'history-2' }, { ...row, _id: 'history-3', examId: 'missing' }];
    });
    const queries = [];
    t.mock.method(Exam, 'find', (filter, projection) => {
      queries.push({ filter, projection });
      return { lean: async () => [summary] };
    });
    const body = await invoke(endpoint);
    assert.deepEqual(body.history.map(item => item.exam), [summary, summary, { code: 'missing', name: 'missing' }]);
    assert.equal(body.history[0].answeredCount, 1);
    assert.deepEqual(queries, [{
      filter: { code: { $in: ['SAA-C03', 'missing'] }, $or: [{ isPublished: true }, { isPublished: { $exists: false } }, { createdBy: 'owner-1' }] },
      projection: { _id: 0, code: 1, name: 1 },
    }]);
  });
}

test('completed exams return only exam summaries without a duplicate ID list', async t => {
  t.mock.method(History, 'getCompletedExamIds', async userId => { assert.equal(userId, 'owner-1'); return ['SAA-C03', 'missing']; });
  t.mock.method(Exam, 'find', () => ({ lean: async () => [summary] }));
  assert.deepEqual(await invoke('getCompletedExamIds'), {
    success: true, exams: [summary, { code: 'missing', name: 'missing' }],
  });
});

test('empty history and completed exams do not query the exam collection', async t => {
  t.mock.method(History, 'getUserHistory', async () => []);
  t.mock.method(History, 'getCompletedExamIds', async () => []);
  t.mock.method(Exam, 'find', () => { throw new Error('Unexpected exam query'); });
  assert.deepEqual((await invoke('getUserHistory')).history, []);
  assert.deepEqual(await invoke('getCompletedExamIds'), { success: true, exams: [] });
});
