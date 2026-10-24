const examService = require('../services/examService');

/**
 * Normalize `questions` from request body.
 * Supports array or JSON string; rejects invalid shapes early for large payloads.
 */
function parseQuestionsPayload(questions) {
  if (questions === undefined || questions === null) {
    return { questions: null };
  }

  let parsed = questions;
  if (typeof questions === 'string') {
    try {
      parsed = JSON.parse(questions);
    } catch (e) {
      return { error: 'Invalid JSON format in questions array' };
    }
  }

  if (!Array.isArray(parsed)) {
    return { error: 'Questions must be an array' };
  }

  return { questions: parsed };
}

const EXAM_FIELDS = [
  'code',
  'name',
  'slug',
  'file',
  'description',
  'category',
  'difficulty',
  'estimatedTime',
  'tags',
  'isPublished',
];

function pickExamFields(body, { allowCode = false } = {}) {
  return EXAM_FIELDS.reduce((result, field) => {
    if ((allowCode || field !== 'code') && Object.prototype.hasOwnProperty.call(body, field)) {
      result[field] = body[field];
    }
    return result;
  }, {});
}

function hasInvalidPublishValue(body) {
  return Object.prototype.hasOwnProperty.call(body, 'isPublished') &&
    typeof body.isPublished !== 'boolean';
}

class ExamController {
  async getAllExams(req, res, next) {
    try {
      const exams = await examService.getAllExams(req.user?.userId);
      res.json({ success: true, count: exams.length, exams });
    } catch (error) {
      next(error);
    }
  }

  async getMetadata(req, res, next) {
    try {
      const categories = await examService.getCategories(req.user?.userId);
      const tags = await examService.getTags(req.user?.userId);
      res.json({ success: true, categories, tags });
    } catch (error) {
      next(error);
    }
  }

  async getMyExams(req, res, next) {
    try {
      const userId = req.user.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const exams = await examService.getMyExams(userId);
      res.json({ success: true, count: exams.length, exams });
    } catch (error) {
      next(error);
    }
  }

  async getExamByCode(req, res, next) {
    try {
      const exam = await examService.getExamByCode(req.params.code, req.user?.userId);
      if (!exam) {
        return res.status(404).json({ success: false, error: 'Exam not found' });
      }
      res.json({ success: true, exam });
    } catch (error) {
      next(error);
    }
  }

  async exportExam(req, res, next) {
    try {
      const result = await examService.exportExamQuestions(req.params.code, req.user?.userId);
      if (result && result.error === 'ExamNotFound') {
        return res.status(404).json({ success: false, error: 'Exam not found' });
      }
      if (result && result.error === 'Forbidden') {
        return res.status(403).json({ success: false, error: 'Forbidden' });
      }

      const filename = `${String(req.params.code).replace(/[^a-z0-9._-]/gi, '_')}.json`;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(JSON.stringify(result, null, 2));
    } catch (error) {
      next(error);
    }
  }

  async getQuestionByExamAndNumber(req, res, next) {
    try {
      const questionNumber = parseInt(req.params.questionNumber, 10);
      const topicNumber = parseInt(req.query.topicNumber, 10);
      if (Number.isNaN(questionNumber) || Number.isNaN(topicNumber) || topicNumber < 1) {
        return res.status(400).json({ success: false, error: 'Valid topic and question numbers are required' });
      }

      const question = await examService.getQuestionByExamAndNumber(
        req.params.code,
        topicNumber,
        questionNumber,
        req.user?.userId
      );
      if (!question) {
        return res.status(404).json({ success: false, error: 'Question not found' });
      }
      res.json({ success: true, question });
    } catch (error) {
      next(error);
    }
  }

  async createExam(req, res, next) {
    try {
      // Expecting metadata in `req.body` and questions under `req.body.questions` 
      // where `questions` is an array of question JSON objects
      const { questions } = req.body;
      const parsed = parseQuestionsPayload(questions);
      if (parsed.error) {
        return res.status(200).json({ success: false, message: parsed.error });
      }

      if (hasInvalidPublishValue(req.body)) {
        return res.status(400).json({ success: false, error: 'isPublished must be a boolean' });
      }

      const examData = pickExamFields(req.body, { allowCode: true });
      if (!examData.name || !examData.description) {
        return res.status(200).json({ success: false, message: 'Name and description are required' });
      }

      const userId = req.user ? req.user.userId : null;
      const exam = await examService.createExamWithQuestions(examData, parsed.questions, userId);
      res.status(201).json({ success: true, exam });
    } catch (error) {
      if (error.code === 'DUPLICATE_EXAM_CODE' || (error.code === 11000 && error.keyPattern && error.keyPattern.code)) {
        return res.status(200).json({ success: false, message: 'Exam code already exists. Please use a different code or name.' });
      }
      next(error);
    }
  }

  async updateExam(req, res, next) {
    try {
      if (hasInvalidPublishValue(req.body)) {
        return res.status(400).json({ success: false, error: 'isPublished must be a boolean' });
      }

      // Destructure questions out so updateData stays small; large arrays stay referenced once
      const { questions } = req.body;
      const updateData = pickExamFields(req.body);
      const parsed = parseQuestionsPayload(questions);
      if (parsed.error) {
        return res.status(200).json({ success: false, message: parsed.error });
      }

      const result = await examService.updateExamWithQuestions(
        req.params.code,
        updateData,
        parsed.questions,
        req.user?.userId
      );
      if (result?.error === 'ExamNotFound') {
        return res.status(404).json({ success: false, error: 'Exam not found' });
      }
      if (result?.error === 'Forbidden') {
        return res.status(403).json({ success: false, error: 'Forbidden' });
      }
      res.json({ success: true, exam: result });
    } catch (error) {
      next(error);
    }
  }

  async transferExamOwnership(req, res, next) {
    try {
      const email = req.body?.email;
      if (
        typeof email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ) {
        return res.status(400).json({ success: false, error: 'InvalidEmail' });
      }

      const result = await examService.transferExamOwnership(
        req.params.code,
        req.user?.userId,
        email
      );
      if (result.error === 'ExamNotFound') {
        return res.status(404).json({ success: false, error: result.error });
      }
      if (result.error === 'UserNotFound') {
        return res.status(404).json({ success: false, error: result.error });
      }
      if (result.error === 'Forbidden') {
        return res.status(403).json({ success: false, error: result.error });
      }
      if (result.error === 'AlreadyOwner') {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.json({ success: true, exam: result.exam });
    } catch (error) {
      next(error);
    }
  }

  async updateQuestion(req, res, next) {
    try {
      const questionNumber = parseInt(req.params.questionNumber, 10);
      const topicNumber = Number(req.body.topic_number);
      if (Number.isNaN(questionNumber) || !Number.isInteger(topicNumber) || topicNumber < 1) {
        return res.status(400).json({ success: false, error: 'Valid topic and question numbers are required' });
      }

      const {
        question_text,
        answers,
        link,
        multiple_choice,
        answer_images,
        question_images,
        suggested_answer,
        answer
      } = req.body;

      if (
        question_text === undefined &&
        answers === undefined &&
        link === undefined &&
        multiple_choice === undefined &&
        answer_images === undefined &&
        question_images === undefined &&
        suggested_answer === undefined &&
        answer === undefined
      ) {
        return res.status(400).json({ success: false, message: 'Provide at least one field to update' });
      }

      const userId = req.user?.userId;
      const result = await examService.updateExamQuestion(req.params.code, topicNumber, questionNumber, userId, {
        question_text,
        answers,
        link,
        multiple_choice,
        answer_images,
        question_images,
        suggested_answer,
        answer,
      });

      if (result && result.error) {
        if (result.error === 'ExamNotFound') {
          return res.status(404).json({ success: false, error: 'Exam not found' });
        }
        if (result.error === 'Forbidden') {
          return res.status(403).json({ success: false, error: 'Forbidden' });
        }
        if (result.error === 'NoUpdates') {
          return res.status(400).json({ success: false, error: 'Nothing to update' });
        }
      }

      if (!result) {
        return res.status(404).json({ success: false, error: 'Question not found' });
      }

      res.json({ success: true, question: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteExam(req, res, next) {
    try {
      const result = await examService.deleteExam(req.params.code, req.user?.userId);
      if (result?.error === 'ExamNotFound') {
        return res.status(404).json({ success: false, error: 'Exam not found' });
      }
      if (result?.error === 'Forbidden') {
        return res.status(403).json({ success: false, error: 'Forbidden' });
      }
      res.json({ success: true, message: 'Exam deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getQuestionsByExamCode(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 0; // Default 0 means return all
      
      const result = await examService.getQuestionsByExamCode(
        req.params.code,
        page,
        limit,
        req.user?.userId
      );
      if (!result) {
        return res.status(404).json({ success: false, error: 'Exam not found' });
      }
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExamController();
