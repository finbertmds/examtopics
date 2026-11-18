const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { getUserFromToken } = require('../services/authService');

const WINDOW_MS = 60_000;
const CLIENT_LIMIT = 5;
const PROCESS_LIMIT = 30;
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
  const client = req.socket.remoteAddress;
  const clientAttempts = attemptsByClient.get(client) ?? 0;
  if (clientAttempts >= CLIENT_LIMIT || attempts >= PROCESS_LIMIT) {
    res.setHeader('Retry-After', String(Math.ceil((windowEndsAt - now) / 1000)));
    return res.status(429).json({ success: false, error: 'Too many report attempts. Try again later.' });
  }
  attemptsByClient.set(client, clientAttempts + 1);
  attempts += 1;
  return next();
}

router.post('/', limitReportAttempts, express.json({ limit: '4kb', inflate: false }),
  getUserFromToken, reportController.submitReport);

module.exports = router;
