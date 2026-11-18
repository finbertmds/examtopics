const sheetsHelper = require('../services/sheetsService');
const getFrontendUrl = require('../utils/frontendUrl');

class ReportController {
  async submitReport(req, res) {
    const { topicNumber, questionNumber, examId, reason, comment = '' } = req.body ?? {};
    if (!Number.isSafeInteger(topicNumber) || topicNumber < 1 ||
        !Number.isSafeInteger(questionNumber) || questionNumber < 1 ||
        typeof examId !== 'string' || typeof reason !== 'string' ||
        (comment !== null && typeof comment !== 'string')) {
      return res.status(400).json({ success: false, error: 'Invalid report fields' });
    }

    const code = examId.trim();
    const summary = reason.trim();
    const notes = comment?.trim() ?? '';
    if (!code || code.length > 128 || code === '.' || code === '..' ||
        !summary || summary.length > 100 || notes.length > 1000) {
      return res.status(400).json({ success: false, error: 'Invalid report fields' });
    }

    // Construct the URL and identity from server configuration and verified claims.
    const query = new URLSearchParams({ topicNumber, questionNumber });
    try {
      await sheetsHelper.appendRow({
        topicNumber,
        questionNumber,
        examId: code,
        reason: summary,
        comment: notes,
        user: typeof req.user?.email === 'string' ? req.user.email : '',
        url: `${getFrontendUrl()}/exam/${encodeURIComponent(code)}?${query}`,
      });
    } catch {
      console.error('Google Sheets report write failed');
      return res.status(500).json({ success: false, error: 'Failed to process report' });
    }

    return res.json({
      success: true,
      message: 'Report submitted successfully',
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = new ReportController();
