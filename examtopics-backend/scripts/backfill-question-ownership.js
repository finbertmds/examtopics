const path = require('path');
const { readFile } = require('node:fs/promises');
const mongoose = require('mongoose');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class BackfillError extends Error {}
const BATCH_SIZE = 500;

function* batches(items) {
  for (let index = 0; index < items.length; index += BATCH_SIZE) {
    yield items.slice(index, index + BATCH_SIZE);
  }
}

function destinationKey(row) {
  return JSON.stringify({
    examId: row.examId,
    topic_number: row.topic_number ?? null,
    question_number: row.question_number ?? null,
  });
}

function validateManifest(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new BackfillError('The manifest must contain a nonempty array of verified question assignments.');
  }
}

// The operator verifies provenance before supplying the manifest. A legacy code
// alone cannot establish which exam originally owned a question.
async function backfillQuestionOwnership(entries, { apply = false } = {}) {
  validateManifest(entries);

  const examIds = new Map();
  const questionIds = new Set();
  // Normalize and validate the entire manifest before querying or writing.
  const assignments = entries.map((entry, index) => {
    const label = `Manifest entry ${index + 1}`;
    const { examId, examCode, questionId } = entry ?? {};
    if (typeof examId !== 'string' || !mongoose.isObjectIdOrHexString(examId) ||
        typeof questionId !== 'string' || !mongoose.isObjectIdOrHexString(questionId) ||
        typeof examCode !== 'string' || examCode.length === 0) {
      throw new BackfillError(`${label} must specify valid examId, examCode and questionId fields.`);
    }

    const parentId = new mongoose.Types.ObjectId(examId);
    const rowId = new mongoose.Types.ObjectId(questionId);
    const questionKey = rowId.toHexString();
    if (questionIds.has(questionKey)) throw new BackfillError(`${label} repeats a question ID.`);
    questionIds.add(questionKey);

    examIds.set(parentId.toHexString(), parentId);
    return { label, parentId, rowId, examCode };
  });

  const examCodes = new Map();
  for (const ids of batches([...examIds.values()])) {
    const parents = await Exam.collection.find({ _id: { $in: ids } }, { projection: { code: 1 } }).toArray();
    for (const parent of parents) examCodes.set(parent._id.toHexString(), parent.code);
  }
  const questions = new Map();
  for (const batch of batches(assignments)) {
    const rows = await Question.collection.find({ _id: { $in: batch.map(({ rowId }) => rowId) } }, {
      projection: { examId: 1, examCode: 1, topic_number: 1, question_number: 1 },
    }).toArray();
    for (const row of rows) questions.set(row._id.toHexString(), row);
  }

  const targetQuestions = new Set();
  const pending = [];
  let alreadyLinked = 0;
  for (const assignment of assignments) {
    const { label, parentId, rowId, examCode } = assignment;
    if (examCodes.get(parentId.toHexString()) !== examCode) {
      throw new BackfillError(`${label} does not match the current exam identity and code.`);
    }

    const row = questions.get(rowId.toHexString());
    if (!row) throw new BackfillError(`${label} references a question that no longer exists.`);
    if (row.examId instanceof mongoose.Types.ObjectId && row.examId.equals(parentId) && row.examCode === examCode) {
      alreadyLinked += 1;
      continue;
    }
    if (row.examId !== examCode) {
      throw new BackfillError(`${label} conflicts with the question's stored ownership.`);
    }

    const target = {
      examId: parentId,
      topic_number: row.topic_number ?? null,
      question_number: row.question_number ?? null,
    };
    const targetKey = destinationKey(target);
    if (targetQuestions.has(targetKey)) {
      throw new BackfillError(`${label} conflicts with another question at the destination exam position.`);
    }
    targetQuestions.add(targetKey);
    pending.push({ ...assignment, target });
  }

  // Check every destination, including rows outside the manifest, before any write.
  for (const batch of batches(pending)) {
    const destinations = await Question.collection.find({ $or: batch.map(({ target }) => target) }, {
      projection: { _id: 1 },
      limit: 1,
    }).toArray();
    // Trust MongoDB matching semantics, including legacy array-valued fields.
    if (destinations.length) {
      throw new BackfillError(`The batch starting at ${batch[0].label} conflicts with another question at the destination exam position.`);
    }
  }

  let updated = 0;
  if (apply) {
    for (const batch of batches(pending)) {
      let result;
      try {
        result = await Question.collection.bulkWrite(batch.map(({ rowId, parentId, examCode, target }) => ({
          updateOne: {
            filter: { _id: rowId, examId: examCode, topic_number: target.topic_number, question_number: target.question_number },
            update: { $set: { examId: parentId, examCode } },
            upsert: false,
          },
        })), { ordered: true });
      } catch {
        // Ordered bulk failures can leave partial progress; never expose raw errors.
        throw new BackfillError(`The batch starting at ${batch[0].label} failed. Some rows may already be updated. Verify the target before retrying.`);
      }
      if (result.matchedCount !== batch.length) {
        throw new BackfillError(`Questions changed during backfill in the batch starting at ${batch[0].label}. Some rows may already be updated. Verify the target before retrying.`);
      }
      updated += result.matchedCount;
    }
  }
  return { pending: pending.length, alreadyLinked, updated };
}

async function main() {
  const [, , manifestPath, option, ...extras] = process.argv;
  if (!manifestPath || manifestPath.startsWith('-') || (option !== undefined && option !== '--apply') || extras.length) {
    throw new BackfillError('Usage: node scripts/backfill-question-ownership.js <verified-manifest.json> [--apply]');
  }
  if (!process.env.MONGO_URI) throw new BackfillError('Set MONGO_URI explicitly for the approved database.');
  let content;
  try {
    content = await readFile(manifestPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new BackfillError('Manifest file not found. Relative paths use the current working directory; supply an absolute path to the verified manifest.');
    }
    if (error.code === 'EACCES' || error.code === 'EPERM') {
      throw new BackfillError('Cannot read the manifest file. Check file permissions.');
    }
    throw new BackfillError('Cannot read the manifest file. Supply a readable JSON file.');
  }
  let entries;
  try {
    entries = JSON.parse(content);
  } catch {
    throw new BackfillError('The manifest must be valid JSON. Check its syntax without sharing private contents.');
  }
  validateManifest(entries);
  try {
    // Dry-run must use read privileges only and must never initialize model indexes.
    await mongoose.connect(process.env.MONGO_URI, { autoCreate: false, autoIndex: false });
    console.log(await backfillQuestionOwnership(entries, { apply: option === '--apply' }));
  } catch (error) {
    if (error instanceof BackfillError) throw error;
    if (error.code === 18) {
      throw new BackfillError('MongoDB authentication failed. Check the credentials and authSource in MONGO_URI.');
    }
    if (error.code === 13) {
      throw new BackfillError('MongoDB permission denied. Check database permissions for this operation.');
    }
    if (error.name === 'MongooseServerSelectionError' || error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      throw new BackfillError('Could not connect to MongoDB. Check that the server is running and the host, port, network access and TLS settings in MONGO_URI are correct.');
    }
    if (error.name === 'MongoParseError') {
      throw new BackfillError('Invalid MONGO_URI format. Check the connection string and URL-encode credentials.');
    }
    throw new BackfillError('MongoDB operation failed. Verify the target database, connection settings and permissions before retrying.');
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    // Connection errors may contain sensitive details. Print only controlled messages.
    console.error(error instanceof BackfillError ? error.message : 'Question ownership backfill failed.');
    process.exitCode = 1;
  });
}

module.exports = backfillQuestionOwnership;
