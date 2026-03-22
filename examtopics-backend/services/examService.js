const Exam = require('../models/Exam');
const Question = require('../models/Question');

class ExamService {
  async getAllExams() {
    return await Exam.find().sort({ createdAt: -1 });
  }

  async getExamByCode(code) {
    return await Exam.findOne({ code });
  }

  async getCategories() {
    const categories = await Exam.distinct('category');
    return categories.filter(Boolean);
  }

  async getMyExams(userId) {
    return await Exam.find({ createdBy: userId }).sort({ createdAt: -1 });
  }

  async getTags() {
    const tags = await Exam.distinct('tags');
    return tags.filter(Boolean);
  }

  async createExamWithQuestions(examData, questionsArray, userId) {
    // Determine question count
    const questionCount = questionsArray ? questionsArray.length : 0;
    
    // Create new Exam instance. Default code to slugified name or a random string if not provided.
    const examCode = examData.code || examData.id || examData.name?.en?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || examData.name?.toLowerCase?.().replace(/[^a-z0-9]+/g, '-');
    
    // Check if duplicate code exists
    const existing = await Exam.findOne({ code: examCode });
    if (existing) {
      const err = new Error('Duplicate exam code');
      err.code = 'DUPLICATE_EXAM_CODE';
      throw err;
    }

    const exam = new Exam({
      ...examData,
      code: examCode,
      questionCount,
      createdBy: userId,
    });
    
    await exam.save();

    if (questionsArray && questionsArray.length > 0) {
      // Format questions for bulk insert
      const formattedQuestions = questionsArray.map((q) => {
        // Handle answers mapping safely
        let answersMap = {};
        if (typeof q.answers === 'object' && q.answers !== null) {
          answersMap = { ...q.answers };
        } else if (typeof q.answers === 'string') {
          // If for some reason it's stringified JSON
          try {
            answersMap = JSON.parse(q.answers);
          } catch(e) {}
        }

        return {
          examId: exam.code,
          question_number: q.question_number,
          topic_number: q.topic_number || 1,
          title: q.title || '',
          question_text: q.question_text || '',
          answers: answersMap,
          suggested_answer: q.suggested_answer || '',
          answer: q.answer,
          link: q.link || '',
          multiple_choice: q.multiple_choice || false,
          answer_images: q.answer_images || [],
          question_images: q.question_images || [],
        };
      });

      // Avoid duplicates if a number repeats by ignoring duplicates or inserting what's possible
      // Using write errors to safely continue if duplicate
      for (let i = 0; i < formattedQuestions.length; i += 50) {
         const batch = formattedQuestions.slice(i, i + 50);
         await Question.insertMany(batch, { ordered: false }).catch(err => {
             console.error(`Error inserting questions for exam ${exam.code}:`, err);
         });
      }
    }

    return exam;
  }

  async updateExamWithQuestions(code, updateData, questionsArray) {
    if (questionsArray && questionsArray.length > 0) {
      updateData.questionCount = questionsArray.length;
    }

    const exam = await Exam.findOneAndUpdate({ code }, updateData, { new: true });
    if (!exam) return null;

    if (questionsArray && questionsArray.length > 0) {
      // Delete old questions
      await Question.deleteMany({ examId: code });

      // Format questions for bulk insert
      const formattedQuestions = questionsArray.map((q) => {
        let answersMap = {};
        if (typeof q.answers === 'object' && q.answers !== null) {
          answersMap = { ...q.answers };
        } else if (typeof q.answers === 'string') {
          try {
            answersMap = JSON.parse(q.answers);
          } catch(e) {}
        }

        return {
          examId: exam.code,
          question_number: q.question_number,
          topic_number: q.topic_number || 1,
          title: q.title || '',
          question_text: q.question_text || '',
          answers: answersMap,
          suggested_answer: q.suggested_answer || '',
          answer: q.answer,
          link: q.link || '',
          multiple_choice: q.multiple_choice || false,
          answer_images: q.answer_images || [],
          question_images: q.question_images || [],
        };
      });

      for (let i = 0; i < formattedQuestions.length; i += 50) {
         const batch = formattedQuestions.slice(i, i + 50);
         await Question.insertMany(batch, { ordered: false }).catch(err => {
             console.error(`Error inserting questions for exam ${exam.code}:`, err);
         });
      }
    }

    return exam;
  }

  async deleteExam(code) {
    // Delete all associated questions first
    await Question.deleteMany({ examId: code });
    // Delete exam
    return await Exam.findOneAndDelete({ code });
  }

  async getQuestionsByExamCode(examCode, page = 1, limit = 0) {
    const skip = (page - 1) * (limit || 0);

    let query = Question.find({ examId: examCode }).sort({ topic_number: 1, question_number: 1 });
    
    if (skip > 0) query = query.skip(skip);
    if (limit > 0) query = query.limit(limit);

    const questions = await query;
    const total = await Question.countDocuments({ examId: examCode });

    return {
      count: questions.length,
      data: questions,
      pagination: {
        total,
        page,
        limit: limit === 0 ? total : limit,
        totalPages: limit === 0 ? 1 : Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new ExamService();
