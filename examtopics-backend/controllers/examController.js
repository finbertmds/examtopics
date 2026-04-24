const examService = require('../services/examService');

class ExamController {
  async getAllExams(req, res, next) {
    try {
      const exams = await examService.getAllExams();
      res.json({ success: true, count: exams.length, exams });
    } catch (error) {
      next(error);
    }
  }

  async getMetadata(req, res, next) {
    try {
      const categories = await examService.getCategories();
      const tags = await examService.getTags();
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
      const exam = await examService.getExamByCode(req.params.code);
      if (!exam) {
        return res.status(404).json({ success: false, error: 'Exam not found' });
      }
      res.json({ success: true, exam });
    } catch (error) {
      next(error);
    }
  }

  async createExam(req, res, next) {
    try {
      // Expecting metadata in `req.body` and questions under `req.body.questions` 
      // where `questions` is an array of question JSON objects
      const { questions, ...examData } = req.body;
      
      let parsedQuestions = questions;
      if (typeof questions === 'string') {
          try {
              parsedQuestions = JSON.parse(questions);
          } catch(e) {
              return res.status(200).json({ success: false, message: 'Invalid JSON format in questions array' });
          }
      }

      if (!examData.name || !examData.description) {
        return res.status(200).json({ success: false, message: 'Name and description are required' });
      }

      const userId = req.user ? req.user.userId : null;
      const exam = await examService.createExamWithQuestions(examData, parsedQuestions, userId);
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
      const { questions, ...updateData } = req.body;
      
      let parsedQuestions = questions;
      if (typeof questions === 'string') {
          try {
              parsedQuestions = JSON.parse(questions);
          } catch(e) {
              return res.status(200).json({ success: false, message: 'Invalid JSON format in questions array' });
          }
      }

      const exam = await examService.updateExamWithQuestions(req.params.code, updateData, parsedQuestions);
      if (!exam) {
        return res.status(404).json({ success: false, error: 'Exam not found' });
      }
      res.json({ success: true, exam });
    } catch (error) {
      next(error);
    }
  }

  async deleteExam(req, res, next) {
    try {
      const exam = await examService.deleteExam(req.params.code);
      if (!exam) {
        return res.status(404).json({ success: false, error: 'Exam not found' });
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
      
      const result = await examService.getQuestionsByExamCode(req.params.code, page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExamController();
