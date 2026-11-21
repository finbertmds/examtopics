const express = require('express');
const reportController = require('../controllers/reportController');
const { getUserFromToken } = require('../services/authService');

const WINDOW_MS = 60_000;
const CLIENT_LIMIT = 5;
const PROCESS_LIMIT = 30;

// Each router owns its limiter state, so tests can build isolated instances (QA-006).
function createReportRouter() {
  let windowEndsAt = 0;
  let attempts = 0;
  const attemptsByClient = new Map();

  function limitReportAttempts(req, res, next) {
    const now = Date.now();
    if (now >= windowEndsAt) {
      windowEndsAt = now + WINDOW_MS;
      attempts = 0;
      attemptsByClient.clear();
    }
    // req.ip is the socket peer unless TRUST_PROXY sets a hop count (SEC-022).
    const client = req.ip;
    const clientAttempts = attemptsByClient.get(client) ?? 0;
    if (clientAttempts >= CLIENT_LIMIT || attempts >= PROCESS_LIMIT) {
      res.setHeader('Retry-After', String(Math.ceil((windowEndsAt - now) / 1000)));
      return res.status(429).json({ success: false, error: 'Too many report attempts. Try again later.' });
    }
    attemptsByClient.set(client, clientAttempts + 1);
    attempts += 1;
    return next();
  }

  const router = express.Router();
  router.post('/', limitReportAttempts, express.json({ limit: '4kb', inflate: false }),
    getUserFromToken, reportController.submitReport);
  return router;
}

module.exports = createReportRouter();
module.exports.createReportRouter = createReportRouter;
