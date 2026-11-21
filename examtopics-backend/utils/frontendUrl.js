const getFrontendUrl = () => {
  const defaultUrl = process.env.NODE_ENV === 'production'
    ? 'https://examtopics.onrender.com'
    : 'http://localhost:3000';

  // Trim stray whitespace from the configured value (e.g. 'FRONTEND_URL= https://...')
  // and drop trailing slashes so redirects and the CORS origin are exact.
  return (process.env.FRONTEND_URL?.trim() || defaultUrl).replace(/\/+$/, '');
};

module.exports = getFrontendUrl;
