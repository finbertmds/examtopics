require('dotenv').config();
const mongoose = require('mongoose');
const Exam = require('../models/Exam');
const { assertDatabaseTarget, applyDryRunConnectionDefaults } = require('./lib/targetGuard');

async function migrateExamVisibility() {
  const target = assertDatabaseTarget({ uri: process.env.MONGO_URI, argv: process.argv.slice(2), write: true });

  applyDryRunConnectionDefaults(mongoose, target);
  await mongoose.connect(process.env.MONGO_URI);

  const missingBefore = await Exam.countDocuments({ isPublished: { $exists: false } });
  if (!target.apply) {
    console.log(JSON.stringify({ dryRun: true, wouldModify: missingBefore }, null, 2));
    return;
  }
  const result = await Exam.updateMany(
    { isPublished: { $exists: false } },
    { $set: { isPublished: true } }
  );
  const missingAfter = await Exam.countDocuments({ isPublished: { $exists: false } });

  console.log(JSON.stringify({
    missingBefore,
    matched: result.matchedCount,
    modified: result.modifiedCount,
    missingAfter,
  }, null, 2));
}

migrateExamVisibility()
  .catch((error) => {
    if (error.name === 'TargetGuardError') {
      console.error(`Exam visibility migration refused: ${error.message}`);
    } else {
      console.error('Exam visibility migration failed:', error);
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
