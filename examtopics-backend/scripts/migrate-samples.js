const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Exam = require('../models/Exam');
const Question = require('../models/Question');
const connectDB = require('../config/database');

const SAMPLES_DIR = path.join(__dirname, '../../examtopics-practice/public/exams');
const EXAMS_JSON_PATH = path.join(SAMPLES_DIR, 'exams.json');

async function migrate() {
  try {
    // Override MongoDB URI for local dev if not defined
    if (!process.env.MONGO_URI) {
      process.env.MONGO_URI = 'mongodb://root:root@127.0.0.1:27017/examtopics?authSource=admin';
    }

    await connectDB();
    console.log('Connected to MongoDB');

    if (!fs.existsSync(EXAMS_JSON_PATH)) {
      console.error(`Exams metadata file not found at ${EXAMS_JSON_PATH}`);
      process.exit(1);
    }

    const examsMetadata = JSON.parse(fs.readFileSync(EXAMS_JSON_PATH, 'utf8'));
    console.log(`Found ${examsMetadata.length} exams in metadata.`);

    for (const examData of examsMetadata) {
      console.log(`\nMigrating Exam: ${examData.name?.en || examData.name || 'Unknown'}`);
      
      // Check if it exists and remove it to keep it idempotent
      let deleteTarget = await Exam.findOne({ code: examData.id });
      
      if (!deleteTarget) {
          // Fallback to name-based query for older imports that lacked code
          const queryName = typeof examData.name === 'object' ? examData.name.en : examData.name;
          deleteTarget = await Exam.findOne({ "name.en": queryName }) || await Exam.findOne({ name: queryName });
      }

      if (deleteTarget) {
        console.log(`Exam already exists. Deleting legacy records...`);
        await Question.deleteMany({ examId: deleteTarget._id });
        await Exam.findByIdAndDelete(deleteTarget._id);
      }

      // Create new exam document
      const newExam = new Exam({
        code: examData.id,
        name: examData.name,
        slug: examData.slug,
        file: examData.file,
        description: examData.description,
        category: examData.category || 'General',
        difficulty: examData.difficulty || 'Intermediate',
        estimatedTime: parseInt(examData.estimatedTime) || 120,
        tags: examData.tags || [],
        questionCount: examData.questionCount || 0,
        createdBy: 'admin'
      });

      await newExam.save();
      console.log(`Exam saved with ID: ${newExam._id}`);

      // Now insert questions
      // Extract basename just in case path is like 'exams/aws_sap_c02.json'
      const basename = path.basename(examData.file);
      const questionFilePath = path.join(SAMPLES_DIR, basename);

      if (!fs.existsSync(questionFilePath)) {
         console.warn(`Question data file not found at ${questionFilePath}. Skipping questions.`);
         continue;
      }

      const questionsJSON = JSON.parse(fs.readFileSync(questionFilePath, 'utf8'));
      console.log(`Found ${questionsJSON.length} questions to import.`);

      const formattedQuestions = questionsJSON.map((q) => {
        let answersMap = {};
        if (typeof q.answers === 'object' && q.answers !== null) {
          answersMap = { ...q.answers };
        } else if (typeof q.answers === 'string') {
          try {
            answersMap = JSON.parse(q.answers);
          } catch(e) {}
        }

        return {
          examId: newExam.code,
          question_number: q.question_number,
          topic_number: q.topic_number || 1,
          title: q.title || '',
          question_text: q.question_text || q.title || '',
          answers: answersMap,
          suggested_answer: q.suggested_answer || '',
          answer: q.answer,
          link: q.link || '',
          multiple_choice: q.multiple_choice || false,
          answer_images: q.answer_images || [],
          question_images: q.question_images || [],
        };
      });

      // Insert in batches
      let insertedCount = 0;
      for (let i = 0; i < formattedQuestions.length; i += 100) {
         const batch = formattedQuestions.slice(i, i + 100);
         try {
           const result = await Question.insertMany(batch, { ordered: false });
           insertedCount += result.length;
           process.stdout.write(`\rInserted ${insertedCount}/${formattedQuestions.length} questions`);
         } catch(err) {
           // InsertManyError contains insertedDocs
           if (err.insertedDocs) {
              insertedCount += err.insertedDocs.length;
           }
           process.stdout.write(`\rInserted ${insertedCount}/${formattedQuestions.length} questions (some duplicates)`);
         }
      }
      
      // Update actual question count
      newExam.questionCount = insertedCount;
      await newExam.save();
      console.log(`\nImport completed for ${newExam.code} with ${newExam.questionCount} questions`);
    }

    console.log('\nMigration fully completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
