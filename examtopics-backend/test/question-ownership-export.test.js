const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { ObjectId } = require('mongoose').Types;
const exportManifest = require('../scripts/export-question-ownership');

function questions(rows) {
  return {
    aggregate(pipeline) {
      assert.deepEqual(pipeline[0], {
        $match: { $expr: { $eq: [{ $type: '$examId' }, 'string'] } },
      });
      assert.deepEqual(pipeline[2].$lookup, {
        from: 'exams', localField: 'examId', foreignField: 'code', as: 'parents',
      });
      return { toArray: async () => rows };
    },
  };
}

test('exports string IDs for a uniquely matched legacy question', async () => {
  const questionId = new ObjectId();
  const examId = new ObjectId();
  const rows = [{ _id: questionId, examId: 'aws-demo', parents: [{ _id: examId }] }];
  assert.deepEqual(await exportManifest(questions(rows)), [{
    questionId: questionId.toHexString(), examId: examId.toHexString(), examCode: 'aws-demo',
  }]);
});

test('refuses the whole export when a parent is missing or ambiguous', async () => {
  for (const parents of [[], [{ _id: new ObjectId() }, { _id: new ObjectId() }]]) {
    const rows = [{ _id: new ObjectId(), examId: 'aws-demo', parents }];
    await assert.rejects(exportManifest(questions(rows)), /1 legacy question/);
  }
});

test('returns an empty manifest when no legacy questions were found', async () => {
  assert.deepEqual(await exportManifest(questions([])), []);
});

test('diagnostics distinguish missing, ambiguous and invalid records grouped by legacy code', async () => {
  const rows = [
    { _id: new ObjectId(), examId: 'orphan-exam', parents: [] },
    { _id: new ObjectId(), examId: 'orphan-exam', parents: [] },
    { _id: new ObjectId(), examId: 'duplicate-exam', parents: [{ _id: new ObjectId() }, { _id: new ObjectId() }] },
    { _id: 'invalid-question-id', examId: 'bad-ids', parents: [{ _id: 'invalid-parent-id' }] },
    { _id: new ObjectId(), examId: '', parents: [] },
    { _id: new ObjectId(), examId: 'matched-exam', parents: [{ _id: new ObjectId() }] },
  ];
  assert.deepEqual(await exportManifest(questions(rows), { diagnose: true }), {
    totalLegacy: 6,
    candidateQuestions: 1,
    blockedQuestions: 5,
    groups: [
      { examCode: 'orphan-exam', questions: 2, issues: { missingParent: 2 } },
      { examCode: 'duplicate-exam', questions: 1, issues: { ambiguousParent: 1 } },
      { examCode: 'bad-ids', questions: 1, issues: { invalidQuestionId: 1, invalidParentId: 1 } },
      { examCode: '', questions: 1, issues: { invalidExamCode: 1, missingParent: 1 } },
    ],
  });
  // Diagnostic mode must not make these same records eligible for backfill.
  await assert.rejects(exportManifest(questions(rows)), /5 legacy question/);
});

test('a blocked export explains how to obtain an ownership diagnostic report', async () => {
  await assert.rejects(exportManifest(questions([
    { _id: new ObjectId(), examId: 'orphan-exam', parents: [] },
  ])), /--diagnose/);
});

function runDiagnosticCli(t, existingOutput) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'ownership-export-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const outputPath = path.join(directory, 'diagnostics.json');
  if (existingOutput !== undefined) writeFileSync(outputPath, existingOutput);
  // Replace external config and database access; run the real CLI and file writer.
  const bootstrap = `
    const fs = require('node:fs/promises');
    const readFile = fs.readFile;
    fs.readFile = (file, ...args) => /[\\\\/]\\.env$/.test(String(file))
      ? Promise.resolve(Buffer.from('MONGO_URI=mongodb://private-user:private-password@private-host/db'))
      : readFile(file, ...args);
    const mongoose = require('mongoose');
    mongoose.connect = async () => {};
    mongoose.disconnect = async () => {};
    mongoose.connection.db = { collection: () => ({ aggregate: () => ({ toArray: async () => [
      { _id: new mongoose.Types.ObjectId(), examId: 'orphan-exam', parents: [] }
    ] }) }) };
    process.argv = [process.execPath, ${JSON.stringify(require.resolve('../scripts/export-question-ownership'))}, ${JSON.stringify(outputPath)}, '--diagnose', '--target=private-host/db'];
    require('node:module').runMain();
  `;
  const result = spawnSync(process.execPath, ['-e', bootstrap], {
    cwd: path.join(__dirname, '..'), encoding: 'utf8', timeout: 10000,
    // Hermetic: ignore the developer's NODE_ENV and migration override.
    env: { ...process.env, NODE_ENV: '', ALLOW_REMOTE_MIGRATION: '' },
  });
  return { result, outputPath };
}

test('diagnostic CLI writes a report instead of a candidate manifest without exposing credentials', (t) => {
  const { result, outputPath } = runDiagnosticCli(t);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(readFileSync(outputPath, 'utf8'));
  assert.equal(report.blockedQuestions, 1);
  assert.deepEqual(report.groups, [{ examCode: 'orphan-exam', questions: 1, issues: { missingParent: 1 } }]);
  assert.match(result.stdout, /diagnostic/i);
  assert.doesNotMatch(result.stdout + result.stderr + JSON.stringify(report), /private-user|private-password|private-host/);
});

test('diagnostic CLI preserves an existing output file', (t) => {
  const { result, outputPath } = runDiagnosticCli(t, 'existing-private-report');
  assert.equal(result.status, 1);
  assert.equal(readFileSync(outputPath, 'utf8'), 'existing-private-report');
  assert.match(result.stderr, /already exists/i);
});
