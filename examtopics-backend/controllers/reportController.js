const sheetsHelper = require('../services/sheetsService');

class ReportController {
  async submitReport(req, res) {
    try {
      const { topicNumber, questionNumber, examId, reason, comment, user, url } = req.body;

      // Validate required fields
      if (topicNumber === undefined || questionNumber === undefined || !examId || !reason) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: topicNumber, questionNumber, examId, and reason are required'
        });
      }

      // Validate data types
      if (typeof topicNumber !== 'number' || typeof questionNumber !== 'number' || typeof examId !== 'string' || typeof reason !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid data types: topicNumber and questionNumber must be numbers, examId and reason must be strings'
        });
      }

      // Validate optional fields
      if (comment && typeof comment !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid data type: comment must be a string'
        });
      }

      if (user !== null && user !== undefined && typeof user !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid data type: user must be a string or null'
        });
      }

      // Prepare data for Google Sheets
      const reportData = {
        topicNumber: topicNumber,
        questionNumber: questionNumber,
        examId: examId.trim(),
        reason: reason.trim(),
        comment: comment ? comment.trim() : '',
        user: user ? user.trim() : '',
        url: url ? url.trim() : ''
      };

      // Append to Google Sheets
      await sheetsHelper.appendRow(reportData);

      res.json({
        success: true,
        message: 'Report submitted successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error processing report:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to process report',
        details: error.message
      });
    }
  }
}

module.exports = new ReportController();
