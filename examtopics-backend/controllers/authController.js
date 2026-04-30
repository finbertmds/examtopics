const { generateToken, refreshAccessToken } = require('../services/authService');

class AuthController {
  googleCallback(req, res) {
    // Successful authentication, generate JWT token
    const token = generateToken(req.user);
    
    // Get frontend URL based on environment
    const getFrontendUrl = () => {
      const env = process.env.NODE_ENV || 'development';
      
      if (env === 'production') {
        // Production: Use environment variable or default Render frontend URL
        return process.env.FRONTEND_URL || 'https://examtopics-practice.onrender.com';
      } else {
        // Development: Use localhost
        return process.env.FRONTEND_URL || 'http://localhost:3000';
      }
    };
    
    const frontendUrl = getFrontendUrl();
    console.log(`🔗 Redirecting to frontend: ${frontendUrl}/auth/callback`);
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  getCurrentUser(req, res) {
    res.json({
      success: true,
      user: {
        id: req.user.userId,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture || null
      }
    });
  }

  refreshToken(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const newToken = refreshAccessToken(token);
    if (!newToken) {
      return res.status(403).json({
        success: false,
        error: 'Invalid token'
      });
    }

    return res.json({
      success: true,
      token: newToken
    });
  }
}

module.exports = new AuthController();
