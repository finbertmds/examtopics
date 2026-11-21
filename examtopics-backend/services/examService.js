const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');

const LARGE_QUESTION_THRESHOLD = 1000;
const SMALL_BATCH_SIZE = 100;
const LARGE_BATCH_SIZE = 500;

const MAX_QUESTION_PAGE = 1000;
const MAX_QUESTIONS_PER_PAGE = 100;
const QUESTION_QUERY_TIMEOUT_MS = 3000;

function boundedPageNumber(value, maximum) {
  const number = typeof value === 'string' && /^[1-9]\d*$/.test(value) ? Number(value) : value;
  if (!Number.isSafeInteger(number) || number < 1 || number > maximum) {
    throw Object.assign(new Error('Invalid page or limit'), { status: 400, code: 'INVALID_QUESTION_PAGINATION' });
  }
  return number;
}

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

// SEC-024: question links are rendered as hrefs, so only http(s) URLs are stored.
const isSafeLink = (value) => {
  if (value === '' || value === null) return true;
  if (typeof value !== 'string') return false;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
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

const formatQuestion = (q, exam) => ({
  examId: exam._id,
  examCode: exam.code,
  question_number: Question.schema.path('question_number').cast(q.question_number),
  topic_number: Question.schema.path('topic_number').cast(q.topic_number || 1),
  title: q.title || '',
  question_text: q.question_text || '',
  answers: parseAnswersMap(q.answers),
  suggested_answer: q.suggested_answer || '',
  answer: q.answer,
  link: q.link && isSafeLink(q.link) ? q.link : '',
  multiple_choice: q.multiple_choice || false,
  answer_images: q.answer_images || [],
  question_images: q.question_images || [],
});

/**
 * Format + insert questions in adaptive batches to keep memory/latency stable for large payloads.
 * Avoids mapping the entire array up-front (important when length > 1000).
 */
const insertQuestionsInBatches = async (exam, questionsArray, session) => {
  const total = questionsArray.length;
  const batchSize = total > LARGE_QUESTION_THRESHOLD ? LARGE_BATCH_SIZE : SMALL_BATCH_SIZE;
  const seenByTopic = new Map();
  let insertedCount = 0;

  for (let i = 0; i < total; i += batchSize) {
    const batch = [];
    for (const entry of questionsArray.slice(i, i + batchSize)) {
      const question = formatQuestion(entry, exam);
      const topic = question.topic_number ?? null;
      const number = question.question_number ?? null;
      if (!seenByTopic.has(topic)) seenByTopic.set(topic, new Set());
      const seen = seenByTopic.get(topic);
      if (seen.has(number)) continue;
      seen.add(number);
      batch.push(question);
    }
    if (batch.length === 0) continue;

    // Duplicate input positions are handled before insertion. A database error
    // aborts the entire transaction instead of leaving a partially written exam.
    await Question.insertMany(batch, { lean: true, session });
    insertedCount += batch.length;
  }

  return insertedCount;
};

const lockExamForQuestionMutation = async (filter, session) => {
  // A real write takes the same document lock as ownership transfer.
  const result = await Exam.updateOne(filter, { $inc: { questionMutationVersion: 1 } }, {
    session,
    timestamps: false,
  });
  return result.matchedCount === 1;
};

class ExamService {
  async getExamSummaries(userId, codes) {
    if (codes.length === 0) return [];
    return Exam.find(
      { code: { $in: codes }, ...getReadableExamFilter(userId) },
      { _id: 0, code: 1, name: 1 }
    ).lean();
  }

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
      { _id: exam._id, createdBy: currentOwnerId },
      { $set: { createdBy: newOwner._id } },
      { returnDocument: 'after' }
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

    const questions = await Question.find({ examId: exam._id }).sort({ topic_number: 1, question_number: 1 });
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
    const questionCount = questionsArray?.length || 0;
    
    // Create new Exam instance. Default code to slugified name or a random string if not provided.
    const examCode = examData.code || examData.id || examData.name?.en?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || examData.name?.toLowerCase?.().replace(/[^a-z0-9]+/g, '-');
    
    // Check if duplicate code exists
    const existing = await Exam.findOne({ code: examCode });
    if (existing) {
      const err = new Error('Duplicate exam code');
      err.code = 'DUPLICATE_EXAM_CODE';
      throw err;
    }

    const create = async (session) => {
      const exam = new Exam({
        ...examData,
        code: examCode,
        questionCount,
        createdBy: userId,
        isPublished: examData.isPublished === true,
      });
      await exam.save({ session });

      if (questionCount > 0) {
        const insertedCount = await insertQuestionsInBatches(exam, questionsArray, session);
        if (insertedCount !== questionCount) {
          exam.questionCount = insertedCount;
          await exam.save({ session });
        }
      }
      return exam;
    };

    return questionCount > 0 ? Exam.db.transaction(create) : create();
  }

  async updateExamWithQuestions(code, updateData, questionsArray, userId) {
    const existingExam = await Exam.findOne({ code });
    if (!existingExam) return { error: 'ExamNotFound' };
    if (!userId || existingExam.createdBy?.toString() !== userId.toString()) {
      return { error: 'Forbidden' };
    }

    const hasQuestions = Array.isArray(questionsArray) && questionsArray.length > 0;
    const ownedExam = { _id: existingExam._id, createdBy: userId };
    const update = async (session) => {
      let fields = updateData;
      if (hasQuestions) {
        if (!await lockExamForQuestionMutation(ownedExam, session)) return { error: 'Forbidden' };

        await Question.deleteMany({ examId: existingExam._id }, { session });
        const questionCount = await insertQuestionsInBatches(existingExam, questionsArray, session);
        fields = { ...updateData, questionCount };
      }

      const exam = await Exam.findOneAndUpdate(ownedExam, fields, {
        returnDocument: 'after',
        runValidators: true,
        session,
      });
      if (hasQuestions && !exam) throw new Error('Could not update the locked exam');
      return exam || { error: 'Forbidden' };
    };

    return hasQuestions ? Exam.db.transaction(update) : update();
  }

  async deleteExam(code, userId) {
    const existingExam = await Exam.findOne({ code });
    if (!existingExam) return { error: 'ExamNotFound' };
    if (!userId || existingExam.createdBy?.toString() !== userId.toString()) {
      return { error: 'Forbidden' };
    }

    return Exam.db.transaction(async (session) => {
      const exam = await Exam.findOneAndDelete({ _id: existingExam._id, createdBy: userId }, { session });
      if (!exam) return { error: 'Forbidden' };
      await Question.deleteMany({ examId: exam._id }, { session });
      return { exam };
    });
  }

  async getQuestionsByExamCode(examCode, requestedPage = 1, requestedLimit = MAX_QUESTIONS_PER_PAGE, userId) {
    const page = boundedPageNumber(requestedPage, MAX_QUESTION_PAGE);
    const limit = boundedPageNumber(requestedLimit, MAX_QUESTIONS_PER_PAGE);
    const exam = await Exam.findOne(
      { code: examCode, ...getReadableExamFilter(userId) },
      '+questionMutationVersion',
      { maxTimeMS: QUESTION_QUERY_TIMEOUT_MS }
    );
    if (!exam) return null;

    const questionFilter = { examId: exam._id };
    const queryOptions = { maxTimeMS: QUESTION_QUERY_TIMEOUT_MS };
    const query = Question.find(questionFilter, null, queryOptions)
      .sort({ topic_number: 1, question_number: 1 })
      .limit(limit);
    if (page > 1) query.skip((page - 1) * limit);

    const [questions, total] = await Promise.all([query, Question.countDocuments(questionFilter, queryOptions)]);
    const version = exam.questionMutationVersion ?? 0;
    const confirmedExam = await Exam.findOne(
      { _id: exam._id, ...getReadableExamFilter(userId) },
      '+questionMutationVersion',
      queryOptions
    );
    if (!confirmedExam || (confirmedExam.questionMutationVersion ?? 0) !== version) {
      throw Object.assign(new Error('Exam changed during question loading. Reload the exam.'), { status: 409, code: 'QUESTION_PAGE_CHANGED' });
    }
    return {
      count: questions.length,
      data: questions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        revision: `${exam._id}:${version}`,
      }
    };
  }

  async getQuestionByExamAndNumber(examCode, topicNumber, questionNumber, userId) {
    const exam = await Exam.findOne({ code: examCode, ...getReadableExamFilter(userId) });
    if (!exam) return null;
    return await Question.findOne({ examId: exam._id, topic_number: topicNumber, question_number: questionNumber });
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
      if (!isSafeLink(updateFields.link)) return { error: 'InvalidLink' };
      allowedUpdates.link = updateFields.link || '';
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

    const ownedExam = { _id: exam._id, createdBy: userId };
    return Exam.db.transaction(async (session) => {
      if (!await lockExamForQuestionMutation(ownedExam, session)) return { error: 'Forbidden' };

      return Question.findOneAndUpdate(
        { examId: exam._id, topic_number: topicNumber, question_number: questionNumber },
        allowedUpdates,
        { returnDocument: 'after', session }
      );
    });
  }
}

module.exports = new ExamService();
