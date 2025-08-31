/**
 * Get backend URL based on environment
 * Development: http://localhost:3001
 * Production: https://examtopics-backend-latest.onrender.com
 */
export const getBackendUrl = (): string => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    // Production: Use environment variable or default Render backend URL
    return process.env.REACT_APP_BACKEND_URL || 'https://examtopics-backend-latest.onrender.com';
  } else {
    // Development: Use localhost
    return process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
  }
};

/**
 * Get frontend URL based on environment
 * Development: http://localhost:3000
 * Production: https://examtopics-practice.onrender.com
 */
export const getFrontendUrl = (): string => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    // Production: Use environment variable or default Render frontend URL
    return process.env.REACT_APP_FRONTEND_URL || 'https://examtopics-practice.onrender.com';
  } else {
    // Development: Use localhost
    return process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
  }
};
