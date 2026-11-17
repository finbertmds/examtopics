const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, writeFileSync, rmSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Types } = require('mongoose');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

const examId = new Types.ObjectId();
const legacyCode = 'sample-exam';
const questionId = new Types.ObjectId();
const manifestEntry = {
  examId: examId.toHexString(),
  examCode: legacyCode,
  questionId: questionId.toHexString(),
};

function runCli(t, { manifest, connectionError } = {}) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'ownership-backfill-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const manifestPath = path.join(directory, 'manifest.json');
  if (manifest !== undefined) writeFileSync(manifestPath, manifest);
  // Replace only the external connection; file parsing and CLI reporting stay real.
  const bootstrap = `
    const mongoose = require('mongoose');
    mongoose.connect = async () => {
      throw Object.assign(new Error('private-error mongodb://private-user:private-password@private-host/db'),
        ${JSON.stringify(connectionError || { name: 'UnexpectedConnectionAttempt' })});
    };
    mongoose.disconnect = async () => {};
    process.argv = [process.execPath, ${JSON.stringify(require.resolve('../scripts/backfill-question-ownership'))}, ${JSON.stringify(manifestPath)}];
    require('node:module').runMain();
  `;
  return spawnSync(process.execPath, ['-e', bootstrap], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    timeout: 10000,
    env: { ...process.env, MONGO_URI: 'mongodb://private-user:private-password@private-host/db' },
  });
}

test('CLI explains a missing manifest without attempting a database connection', (t) => {
  const result = runCli(t);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /manifest.*not found/i);
  assert.match(result.stderr, /working directory|absolute path/i);
});

test('CLI explains malformed JSON without printing manifest contents', (t) => {
  const result = runCli(t, { manifest: '{"private-manifest-content":' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /manifest.*valid JSON/i);
  assert.doesNotMatch(result.stdout + result.stderr, /private-manifest-content/);
});

test('CLI rejects an empty manifest before attempting a database connection', (t) => {
  const result = runCli(t, { manifest: '[]' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /nonempty array/i);
});

for (const [label, connectionError, expected] of [
  ['authentication', { name: 'MongoServerError', code: 18 }, /authentication.*authSource/i],
  ['authorization', { name: 'MongoServerError', code: 13 }, /permission/i],
  ['unreachable server', { name: 'MongooseServerSelectionError' }, /connect.*host.*port/i],
  ['invalid URI', { name: 'MongoParseError' }, /MONGO_URI.*format/i],
  ['unknown database error', { name: 'Error' }, /MongoDB operation failed/i],
]) {
  test(`CLI reports ${label} without leaking connection details`, (t) => {
    const result = runCli(t, { manifest: JSON.stringify([manifestEntry]), connectionError });
    assert.equal(result.status, 1);
    assert.match(result.stderr, expected);
    assert.doesNotMatch(result.stdout + result.stderr, /private-user|private-password|private-host|private-error/);
  });
}

function installStorage(t, rows, { beforeBulk } = {}) {
  const parents = new Map([[examId.toHexString(), { _id: examId, code: legacyCode }]]);
  const storage = new Map(rows.map(row => [row._id.toHexString(), row]));
  const calls = { individualReads: 0, individualWrites: 0, reads: [], bulks: [] };
  const equal = (left, right) => left instanceof Types.ObjectId
    ? right instanceof Types.ObjectId && left.equals(right)
    : left === right || (left == null && right == null);
  const matches = (row, filter) => Object.entries(filter).every(([field, value]) => equal(row[field], value));
  const find = (collection, filter) => {
    calls.reads.push(filter);
    if (filter._id?.$in) {
      return filter._id.$in.map(id => collection.get(id.toHexString())).filter(Boolean).map(row => ({ ...row }));
    }
    assert.ok(Array.isArray(filter.$or));
    // Index by position so the large fixture also has inexpensive collision lookups.
    const key = row => JSON.stringify([row.examId instanceof Types.ObjectId, String(row.examId), row.topic_number ?? null, row.question_number ?? null]);
    const requested = new Set(filter.$or.map(key));
    return [...collection.values()].filter(row => requested.has(key(row))).map(row => ({ ...row }));
  };
  t.mock.method(Exam.collection, 'find', (filter) => ({ toArray: async () => find(parents, filter) }));
  t.mock.method(Question.collection, 'find', (filter) => ({ toArray: async () => find(storage, filter) }));
  const individualRead = async () => {
    calls.individualReads += 1;
    throw new Error('Backfill must read in batches.');
  };
  t.mock.method(Exam.collection, 'findOne', individualRead);
  t.mock.method(Question.collection, 'findOne', individualRead);
  const update = ({ filter, update }) => {
    const row = storage.get(filter._id.toHexString());
    if (!row || !matches(row, filter)) return 0;
    Object.assign(row, update.$set);
    return 1;
  };
  t.mock.method(Question.collection, 'updateOne', async () => {
    calls.individualWrites += 1;
    throw new Error('Backfill must write in batches.');
  });
  t.mock.method(Question.collection, 'bulkWrite', async (operations, options) => {
    calls.bulks.push({ operations, options });
    await beforeBulk?.(operations, calls.bulks.length);
    let matchedCount = 0;
    for (const operation of operations) matchedCount += update(operation.updateOne);
    return { matchedCount, modifiedCount: matchedCount };
  });
  return calls;
}

function installCollections(t, storedExamId = legacyCode) {
  const question = { _id: questionId, examId: storedExamId, topic_number: 1, question_number: 1 };
  installStorage(t, [question]);
  return question;
}

function fixture(count) {
  const rows = Array.from({ length: count }, (_, index) => ({
    _id: new Types.ObjectId(), examId: legacyCode, topic_number: 1, question_number: index + 1,
  }));
  const entries = rows.map(row => ({ ...manifestEntry, questionId: row._id.toHexString() }));
  return { rows, entries };
}

test('dry-run reports verified rows without changing storage, and apply can be retried', async (t) => {
  const question = installCollections(t);
  const backfillQuestionOwnership = require('../scripts/backfill-question-ownership');
  const entries = [manifestEntry];

  assert.deepEqual(await backfillQuestionOwnership(entries), { pending: 1, alreadyLinked: 0, updated: 0 });
  assert.equal(question.examId, legacyCode);
  assert.deepEqual(await backfillQuestionOwnership(entries, { apply: true }), { pending: 1, alreadyLinked: 0, updated: 1 });
  assert.ok(examId.equals(question.examId));
  assert.equal(question.examCode, legacyCode);
  assert.deepEqual(await backfillQuestionOwnership(entries, { apply: true }), { pending: 0, alreadyLinked: 1, updated: 0 });
});

test('the manifest must match current parent records before any writes occur', async (t) => {
  const question = installCollections(t);
  const backfillQuestionOwnership = require('../scripts/backfill-question-ownership');
  await assert.rejects(backfillQuestionOwnership([
    manifestEntry,
    { ...manifestEntry, questionId: new Types.ObjectId().toHexString(), examCode: 'other-code' },
  ], { apply: true }), /entry 2.*exam/i);
  assert.equal(question.examId, legacyCode);
});

test('backfill leaves questions bound to other exam identities untouched', async (t) => {
  const previousExamId = new Types.ObjectId();
  const question = installCollections(t, previousExamId);
  const backfillQuestionOwnership = require('../scripts/backfill-question-ownership');
  await assert.rejects(backfillQuestionOwnership([manifestEntry], { apply: true }), /entry 1.*ownership/i);
  assert.ok(previousExamId.equals(question.examId));
});

test('9944 questions use bounded batch reads and ordered bulk writes, with an idempotent retry', async (t) => {
  const { rows, entries } = fixture(9944);
  const calls = installStorage(t, rows);
  const backfill = require('../scripts/backfill-question-ownership');

  assert.deepEqual(await backfill(entries), { pending: 9944, alreadyLinked: 0, updated: 0 });
  assert.equal(calls.individualReads, 0);
  assert.equal(calls.individualWrites, 0);
  assert.equal(calls.bulks.length, 0);
  assert.ok(calls.reads.length <= 41);
  assert.ok(calls.reads.every(filter => (filter._id?.$in ?? filter.$or).length <= 500));
  assert.ok(rows.every(row => row.examId === legacyCode));

  assert.deepEqual(await backfill(entries, { apply: true }), { pending: 9944, alreadyLinked: 0, updated: 9944 });
  assert.equal(calls.individualWrites, 0);
  assert.equal(calls.bulks.length, 20);
  assert.ok(calls.bulks.every(({ operations, options }) => operations.length <= 500 && options.ordered === true));
  assert.ok(rows.every(row => row.examId instanceof Types.ObjectId && row.examId.equals(examId) && row.examCode === legacyCode));
  assert.deepEqual(await backfill(entries, { apply: true }), { pending: 0, alreadyLinked: 9944, updated: 0 });
  assert.equal(calls.bulks.length, 20);
});

for (const issue of ['missing question', 'wrong parent', 'wrong ownership', 'repeated question', 'repeated destination', 'occupied destination']) {
  test(`a ${issue} in a later batch prevents all writes`, async (t) => {
    const { rows, entries } = fixture(501);
    let expected;
    if (issue === 'missing question') {
      rows.pop();
      expected = /entry 501.*no longer exists/i;
    } else if (issue === 'wrong parent') {
      entries[500].examCode = 'other-code';
      expected = /entry 501.*exam/i;
    } else if (issue === 'wrong ownership') {
      rows[500].examId = new Types.ObjectId();
      expected = /entry 501.*ownership/i;
    } else if (issue === 'repeated question') {
      entries[500].questionId = entries[0].questionId.toUpperCase();
      expected = /entry 501.*repeats/i;
    } else if (issue === 'repeated destination') {
      rows[500].question_number = rows[0].question_number;
      expected = /entry 501.*destination/i;
    } else {
      rows.push({ _id: new Types.ObjectId(), examId, examCode: legacyCode, topic_number: 1, question_number: 501 });
      expected = /entry 501.*destination/i;
    }
    const calls = installStorage(t, rows);
    const before = rows.map(row => ({ ...row }));
    await assert.rejects(require('../scripts/backfill-question-ownership')(entries, { apply: true }), expected);
    assert.deepEqual(rows, before);
    assert.equal(calls.bulks.length, 0);
    assert.equal(calls.individualWrites, 0);
  });
}

for (const changedField of ['examId', 'question_number']) {
  test(`a concurrent ${changedField} change stops subsequent write batches and requests verification`, async (t) => {
    const { rows, entries } = fixture(501);
    const calls = installStorage(t, rows, {
      beforeBulk() { rows[0][changedField] = changedField === 'examId' ? 'other-owner' : 999; },
    });
    await assert.rejects(require('../scripts/backfill-question-ownership')(entries, { apply: true }), /changed.*backfill.*verify/i);
    assert.equal(calls.bulks.length, 1);
    assert.equal(rows[0][changedField], changedField === 'examId' ? 'other-owner' : 999);
    assert.equal(rows[500].examId, legacyCode);
  });
}

test('any MongoDB destination match blocks writes even when legacy fields contain arrays', async (t) => {
  const { rows, entries } = fixture(501);
  const calls = installStorage(t, rows);
  const find = Question.collection.find;
  t.mock.method(Question.collection, 'find', (filter, options) => {
    if (!filter.$or) return find(filter, options);
    // Mongo equality to topic_number: 1 also matches a stored array containing 1.
    return { toArray: async () => [{ _id: new Types.ObjectId(), examId, topic_number: [1], question_number: 1 }] };
  });
  await assert.rejects(require('../scripts/backfill-question-ownership')(entries, { apply: true }), /destination/i);
  assert.equal(calls.bulks.length, 0);
  assert.ok(rows.every(row => row.examId === legacyCode));
});

test('a partially failed bulk stops later batches, hides raw errors and can be retried', async (t) => {
  const { rows, entries } = fixture(501);
  const calls = installStorage(t, rows, {
    beforeBulk(_operations, call) {
      if (call !== 1) return;
      for (const row of rows.slice(0, 250)) Object.assign(row, { examId, examCode: legacyCode });
      throw new Error('private-user:private-password@private-host');
    },
  });
  await assert.rejects(require('../scripts/backfill-question-ownership')(entries, { apply: true }), error => {
    assert.match(error.message, /verify.*retry/i);
    assert.doesNotMatch(error.message, /private-user|private-password|private-host/);
    return true;
  });
  assert.equal(calls.bulks.length, 1);
  assert.equal(rows[500].examId, legacyCode);
  assert.deepEqual(await require('../scripts/backfill-question-ownership')(entries, { apply: true }), {
    pending: 251, alreadyLinked: 250, updated: 251,
  });
  assert.ok(rows.every(row => row.examId.equals(examId) && row.examCode === legacyCode));
});
