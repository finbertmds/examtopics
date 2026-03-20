const express = require('express');
const router = express.Router();
const { passport, authenticateToken } = require('../services/authService');
const authController = require('../controllers/authController');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.googleCallback);
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
