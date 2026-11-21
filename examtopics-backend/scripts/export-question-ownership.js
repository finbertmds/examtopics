const path = require('node:path');
const { readFile, writeFile } = require('node:fs/promises');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { assertDatabaseTarget, stripGuardArgs } = require('./lib/targetGuard');

class ExportError extends Error {}

async function exportManifest(questions, { diagnose = false } = {}) {
  const rows = await questions.aggregate([
    { $match: { $expr: { $eq: [{ $type: '$examId' }, 'string'] } } },
    { $project: { examId: 1 } },
    {
      $lookup: {
        from: 'exams', localField: 'examId', foreignField: 'code', as: 'parents',
      },
    },
    { $project: { examId: 1, 'parents._id': 1 } },
  ]).toArray();

  const groups = new Map();
  let blockedQuestions = 0;
  for (const row of rows) {
    const issues = [];
    if (!row.examId) issues.push('invalidExamCode');
    if (row.parents.length === 0) issues.push('missingParent');
    if (row.parents.length > 1) issues.push('ambiguousParent');
    if (!(row._id instanceof mongoose.Types.ObjectId)) issues.push('invalidQuestionId');
    if (row.parents.some(parent => !(parent._id instanceof mongoose.Types.ObjectId))) issues.push('invalidParentId');
    if (!issues.length) continue;

    blockedQuestions += 1;
    if (!groups.has(row.examId)) {
      groups.set(row.examId, { examCode: row.examId, questions: 0, issues: {} });
    }
    const group = groups.get(row.examId);
    group.questions += 1;
    for (const issue of issues) group.issues[issue] = (group.issues[issue] || 0) + 1;
  }

  if (diagnose) {
    return {
      totalLegacy: rows.length,
      candidateQuestions: rows.length - blockedQuestions,
      blockedQuestions,
      groups: [...groups.values()],
    };
  }
  if (blockedQuestions) {
    throw new ExportError(`${blockedQuestions} legacy question(s) have a missing or ambiguous parent or an invalid ID. No manifest was written. Run with a separate report path and --diagnose to see counts by exam code and reason.`);
  }

  return rows.map(row => ({
    questionId: row._id.toHexString(),
    examId: row.parents[0]._id.toHexString(),
    examCode: row.examId,
  }));
}

async function main() {
  const args = process.argv.slice(2);
  const [outputPath, option, ...extras] = stripGuardArgs(args);
  if (!outputPath || outputPath.startsWith('-') || (option !== undefined && option !== '--diagnose') || extras.length) {
    throw new ExportError('Usage: node scripts/export-question-ownership.js <output.json> [--diagnose] [--target=<hosts>/<db>]');
  }
  const diagnose = option === '--diagnose';

  const envPath = path.join(__dirname, '../.env');
  const { MONGO_URI } = dotenv.parse(await readFile(envPath).catch(() => {
    throw new ExportError('Cannot read examtopics-backend/.env.');
  }));
  if (!MONGO_URI) throw new ExportError('Set MONGO_URI in examtopics-backend/.env.');
  try {
    assertDatabaseTarget({ uri: MONGO_URI, argv: args, env: process.env, write: false });
  } catch (error) {
    throw new ExportError(error.message);
  }

  let output;
  try {
    await mongoose.connect(MONGO_URI, { autoCreate: false, autoIndex: false, serverSelectionTimeoutMS: 10000 });
    output = await exportManifest(mongoose.connection.db.collection('questions'), { diagnose });
  } finally {
    await mongoose.disconnect();
  }

  if (!diagnose && !output.length) {
    console.log('No legacy questions found. No manifest was written.');
    return;
  }

  await writeFile(outputPath, JSON.stringify(output, null, 2) + '\n', {
    flag: 'wx',
    mode: 0o600,
  });
  if (diagnose) {
    console.log(`Wrote ownership diagnostics to ${path.resolve(outputPath)}. ${output.blockedQuestions}/${output.totalLegacy} legacy questions blocked. No manifest was written.`);
  } else {
    console.log(`Exported ${output.length} candidates to ${path.resolve(outputPath)}.`);
  }
}

if (require.main === module) {
  main().catch(error => {
    const message = error instanceof ExportError ? error.message :
      error.code === 'EEXIST' ? 'Output file already exists. Choose a new path.' :
        'Export failed. Check the database connection, read permissions and output path.';
    console.error(message);
    process.exitCode = 1;
  });
}

module.exports = exportManifest;
