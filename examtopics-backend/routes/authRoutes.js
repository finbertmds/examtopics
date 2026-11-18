const express = require('express');
const router = express.Router();
const { passport, authenticateToken } = require('../services/authService');
const authController = require('../controllers/authController');
const getFrontendUrl = require('../utils/frontendUrl');
const isOAuthValue = require('../utils/isOAuthValue');

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

router.get('/google', (req, res, next) => {
  if (!isOAuthValue(req.query.challenge) || req.query.code !== undefined) {
    return res.status(400).json({ success: false, error: 'Valid login challenge required' });
  }
  req.oauthChallenge = req.query.challenge;
  return next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', (req, res, next) => {
  if (!req.query.code && !req.query.error) return res.redirect(getFrontendUrl());
  return next();
}, passport.authenticate('google', {
  failureRedirect: getFrontendUrl(),
  session: false,
}), authController.googleCallback);
function requireSessionRequest(req, res, next) {
  if (req.headers.origin !== new URL(getFrontendUrl()).origin || req.headers['x-examtopics-session'] !== '1') {
    return res.status(403).json({ success: false, error: 'Session request forbidden' });
  }
  return next();
}

router.post('/exchange', requireSessionRequest, express.json({ limit: '4kb', inflate: false }), authController.exchangeLoginCode);
router.post('/session', requireSessionRequest, authController.restoreSession);
router.post('/activity', requireSessionRequest, authController.recordActivity);
router.post('/logout', requireSessionRequest, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
