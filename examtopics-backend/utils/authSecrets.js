const { randomBytes } = require('node:crypto');

const placeholders = {
  JWT_SECRET: [
    'your-secret-key-change-in-production',
    'your-jwt-secret-key-change-in-production',
    'your-jwt-secret-key',
    'your_production_jwt_secret',
  ],
  SESSION_SECRET: [
    'your-session-secret',
    'your-session-secret-key',
    'your_production_session_secret',
  ],
};

function getAuthSecret(name) {
  const configured = process.env[name];
  if (configured?.trim() && !placeholders[name].includes(configured.trim())) {
    return configured;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} must be configured with a private value in production`);
  }
  return randomBytes(32);
}

module.exports = getAuthSecret;
