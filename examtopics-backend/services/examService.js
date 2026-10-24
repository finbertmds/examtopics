const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');

const LARGE_QUESTION_THRESHOLD = 1000;
const SMALL_BATCH_SIZE = 100;
const LARGE_BATCH_SIZE = 500;

const getReadableExamFilter = (userId) => {
  const visibilityFilters = [
    { isPublished: true },
    { isPublished: { $exists: false } },
  ];

  if (userId) {
    visibilityFilters.push({ createdBy: userId });
  }

  return { $or: visibilityFilters };
};

const getBulkWriteErrors = (error) => {
  if (Array.isArray(error.writeErrors)) return error.writeErrors;
  if (typeof error.result?.getWriteErrors === 'function') {
    return error.result.getWriteErrors();
  }
  return [];
};

const isDuplicateKeyError = (error) => error?.code === 11000 || error?.err?.code === 11000;

const isOnlyDuplicateKeyError = (error) => {
  const writeErrors = getBulkWriteErrors(error);
  return writeErrors.length > 0
    ? writeErrors.every(isDuplicateKeyError)
    : isDuplicateKeyError(error);
};

const parseAnswersMap = (answers) => {
  if (typeof answers === 'object' && answers !== null) {
    return { ...answers };
  }
  if (typeof answers === 'string') {
    try {
      return JSON.parse(answers);
    } catch (e) {
      return {};
    }
  }
  return {};
};

const formatQuestion = (q, examCode) => ({
  examId: examCode,
  question_number: q.question_number,
  topic_number: q.topic_number || 1,
  title: q.title || '',
  question_text: q.question_text || '',
  answers: parseAnswersMap(q.answers),
  suggested_answer: q.suggested_answer || '',
  answer: q.answer,
  link: q.link || '',
  multiple_choice: q.multiple_choice || false,
  answer_images: q.answer_images || [],
  question_images: q.question_images || [],
});

/**
 * Format + insert questions in adaptive batches to keep memory/latency stable for large payloads.
 * Avoids mapping the entire array up-front (important when length > 1000).
 */
const insertQuestionsInBatches = async (examCode, questionsArray) => {
  if (!Array.isArray(questionsArray) || questionsArray.length === 0) return 0;

  const total = questionsArray.length;
  const batchSize = total > LARGE_QUESTION_THRESHOLD ? LARGE_BATCH_SIZE : SMALL_BATCH_SIZE;
  let insertedCount = 0;

  for (let i = 0; i < total; i += batchSize) {
    const batch = questionsArray.slice(i, i + batchSize).map((q) => formatQuestion(q, examCode));
    try {
      const insertedQuestions = await Question.insertMany(batch, {
        ordered: false,
        lean: true,
        rawResult: false,
      });
      insertedCount += insertedQuestions.length;
    } catch (error) {
      if (Array.isArray(error.insertedDocs)) {
        insertedCount += error.insertedDocs.length;
      }
      if (!isOnlyDuplicateKeyError(error)) {
        console.error(`Error inserting questions for exam ${examCode}:`, error);
        throw error;
      }
      console.warn(
        `Skipped duplicate questions for exam ${examCode}:`,
        getBulkWriteErrors(error).length
      );
    }
  }

  console.log(`Inserted ${insertedCount}/${total} questions for exam ${examCode}`);
  return insertedCount;
};

class ExamService {
  async getAllExams(userId) {
    return await Exam.find(getReadableExamFilter(userId)).sort({ createdAt: -1 });
  }

  async getExamByCode(code, userId) {
    return await Exam.findOne({ code, ...getReadableExamFilter(userId) });
  }

  async getCategories(userId) {
    const categories = await Exam.distinct('category', getReadableExamFilter(userId));
    return categories.filter(Boolean);
  }

  async getMyExams(userId) {
    return await Exam.find({ createdBy: userId }).sort({ createdAt: -1 });
  }

  async transferExamOwnership(code, currentOwnerId, email) {
    const exam = await Exam.findOne({ code });
    if (!exam) return { error: 'ExamNotFound' };
    if (!currentOwnerId || exam.createdBy?.toString() !== currentOwnerId.toString()) {
      return { error: 'Forbidden' };
    }

    const newOwner = await User.findByEmail(email.trim().toLowerCase());
    if (!newOwner) return { error: 'UserNotFound' };
    if (newOwner._id.toString() === currentOwnerId.toString()) {
      return { error: 'AlreadyOwner' };
    }

    const updatedExam = await Exam.findOneAndUpdate(
      { code, createdBy: currentOwnerId },
      { $set: { createdBy: newOwner._id } },
      { new: true }
    );
    if (!updatedExam) return { error: 'Forbidden' };

    return { exam: updatedExam };
  }

  async exportExamQuestions(code, userId) {
    const exam = await Exam.findOne({ code });
    if (!exam) return { error: 'ExamNotFound' };
    if (!userId || exam.createdBy?.toString() !== userId.toString()) {
      return { error: 'Forbidden' };
    }

    const questions = await Question.find({ examId: code }).sort({ topic_number: 1, question_number: 1 });
    return questions.map((question) => ({
      topic_number: question.topic_number || 1,
      question_number: question.question_number,
      title: question.title || '',
      answers: question.answers || {},
      suggested_answer: question.suggested_answer || '',
      answer: question.answer || '',
      link: question.link || '',
      multiple_choice: !!question.multiple_choice,
      question_text: question.question_text || '',
      answer_images: question.answer_images || [],
      question_images: question.question_images || [],
    }));
  }

  async getTags(userId) {
    const tags = await Exam.distinct('tags', getReadableExamFilter(userId));
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
      isPublished: examData.isPublished === true,
    });
    
    await exam.save();

    if (questionsArray && questionsArray.length > 0) {
      await insertQuestionsInBatches(exam.code, questionsArray);
    }

    return exam;
  }

  async updateExamWithQuestions(code, updateData, questionsArray, userId) {
    const existingExam = await Exam.findOne({ code });
    if (!existingExam) return { error: 'ExamNotFound' };
    if (!userId || existingExam.createdBy?.toString() !== userId.toString()) {
      return { error: 'Forbidden' };
    }

    const hasQuestions = Array.isArray(questionsArray) && questionsArray.length > 0;
    if (hasQuestions) {
      updateData.questionCount = questionsArray.length;
    }

    const exam = await Exam.findOneAndUpdate(
      { code, createdBy: userId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!exam) return { error: 'Forbidden' };

    if (hasQuestions) {
      // Replace questions: delete first, then insert in adaptive batches
      await Question.deleteMany({ examId: code });
      await insertQuestionsInBatches(exam.code, questionsArray);
    }

    return exam;
  }

  async deleteExam(code, userId) {
    const existingExam = await Exam.findOne({ code });
    if (!existingExam) return { error: 'ExamNotFound' };
    if (!userId || existingExam.createdBy?.toString() !== userId.toString()) {
      return { error: 'Forbidden' };
    }

    const exam = await Exam.findOneAndDelete({ code, createdBy: userId });
    if (!exam) return { error: 'Forbidden' };
    await Question.deleteMany({ examId: code });
    return { exam };
  }

  async getQuestionsByExamCode(examCode, page = 1, limit = 0, userId) {
    const exam = await Exam.findOne({ code: examCode, ...getReadableExamFilter(userId) });
    if (!exam) return null;

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

  async getQuestionByExamAndNumber(examCode, topicNumber, questionNumber, userId) {
    const exam = await Exam.findOne({ code: examCode, ...getReadableExamFilter(userId) });
    if (!exam) return null;
    return await Question.findOne({ examId: examCode, topic_number: topicNumber, question_number: questionNumber });
  }

  async updateExamQuestion(code, topicNumber, questionNumber, userId, updateFields) {
    const exam = await Exam.findOne({ code });
    if (!exam) {
      return { error: 'ExamNotFound' };
    }

    if (!userId || exam.createdBy?.toString() !== userId.toString()) {
      return { error: 'Forbidden' };
    }

    const allowedUpdates = {};
    if (updateFields.question_text !== undefined) {
      allowedUpdates.question_text = updateFields.question_text;
    }
    if (updateFields.answers !== undefined) {
      let answers = updateFields.answers;
      if (typeof answers === 'string') {
        try {
          answers = JSON.parse(answers);
        } catch (e) {
          answers = null;
        }
      }
      if (answers && typeof answers === 'object') {
        let sanitizedAnswers = Object.entries(answers).sort(([a], [b]) => a.localeCompare(b)).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        allowedUpdates.answers = { ...sanitizedAnswers };
      }
    }
    if (updateFields.link !== undefined) {
      allowedUpdates.link = updateFields.link;
    }
    if (updateFields.multiple_choice !== undefined) {
      allowedUpdates.multiple_choice = updateFields.multiple_choice;
    }
    if (updateFields.answer_images !== undefined) {
      allowedUpdates.answer_images = Array.isArray(updateFields.answer_images)
        ? updateFields.answer_images
        : [];
    }
    if (updateFields.question_images !== undefined) {
      allowedUpdates.question_images = Array.isArray(updateFields.question_images)
        ? updateFields.question_images
        : [];
    }
    if (updateFields.suggested_answer !== undefined) {
      allowedUpdates.suggested_answer = updateFields.suggested_answer;
    }
    if (updateFields.answer !== undefined) {
      allowedUpdates.answer = updateFields.answer;
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return { error: 'NoUpdates' };
    }

    const question = await Question.findOneAndUpdate(
      { examId: code, topic_number: topicNumber, question_number: questionNumber },
      allowedUpdates,
      { new: true }
    );

    return question;
  }
}

module.exports = new ExamService();
