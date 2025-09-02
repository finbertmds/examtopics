const mongoose = require('mongoose');
const Progress = require('../models/Progress');
require('dotenv').config();

// Migration script to convert old progress format to new format
async function migrateProgressData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/examtopics');
    console.log('Connected to MongoDB');

    // Get all progress documents
    const allProgress = await Progress.find({});
    console.log(`Found ${allProgress.length} progress documents to migrate`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const progress of allProgress) {
      try {
        let needsUpdate = false;
        const newAnswers = new Map();
        const newMarkedForTraining = [];

        // Migrate answers
        for (const [key, answer] of progress.answers.entries()) {
          if (answer && typeof answer === 'object') {
            // Check if answer already has topicNumber (new format)
            if (answer.topicNumber !== undefined) {
              // Already in new format, keep as is
              newAnswers.set(key, answer);
            } else {
              // Old format - convert to new format
              let topicNumber = 1;
              let questionNumber;
              let newKey;
              
              if (typeof key === 'string' && key.includes('-')) {
                // Key is already in new format (contains dash)
                newKey = key;
                const parts = key.split('-');
                topicNumber = parseInt(parts[0]);
                questionNumber = parseInt(parts[1]);
              } else {
                // Old format - convert to new format
                questionNumber = typeof key === 'string' ? parseInt(key) : key;
                newKey = `1-${questionNumber}`; // Default topic number to 1
              }
              
              newAnswers.set(newKey, {
                topicNumber: topicNumber,
                questionNumber: questionNumber,
                selectedAnswers: answer.selectedAnswers || [],
                isCorrect: answer.isCorrect || false,
                answeredAt: answer.answeredAt || new Date()
              });
              needsUpdate = true;
            }
          }
        }

        // Migrate markedForTraining
        for (const item of progress.markedForTraining) {
          if (typeof item === 'string') {
            if (item.includes('-')) {
              // Already in new format (contains dash)
              newMarkedForTraining.push(item);
            } else {
              // Old format - string without dash, convert to new format
              newMarkedForTraining.push(`1-${item}`);
              needsUpdate = true;
            }
          } else if (typeof item === 'number') {
            // Old format - convert to new format
            newMarkedForTraining.push(`1-${item}`);
            needsUpdate = true;
          }
        }

        // Update document if needed
        if (needsUpdate) {
          progress.answers = newAnswers;
          progress.markedForTraining = newMarkedForTraining;
          await progress.save();
          migratedCount++;
          console.log(`Migrated progress for user ${progress.userId}, exam ${progress.examId}`);
        }
      } catch (error) {
        console.error(`Error migrating progress for user ${progress.userId}, exam ${progress.examId}:`, error);
        errorCount++;
      }
    }

    console.log(`Migration completed: ${migratedCount} documents migrated, ${errorCount} errors`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateProgressData();
  console.log("Migration script executed");
}

module.exports = { migrateProgressData };
