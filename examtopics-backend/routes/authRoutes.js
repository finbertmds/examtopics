const express = require('express');
const router = express.Router();
const { passport, authenticateToken } = require('../services/authService');
const authController = require('../controllers/authController');
const getFrontendUrl = require('../utils/frontendUrl');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: getFrontendUrl() }), authController.googleCallback);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.post('/refresh', authController.refreshToken);

module.exports = router;
