require('dotenv').config();
const mongoose = require('mongoose');
const Exam = require('../models/Exam');

async function migrateExamVisibility() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const missingBefore = await Exam.countDocuments({ isPublished: { $exists: false } });
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
    console.error('Exam visibility migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
