const getFrontendUrl = () => {
  const defaultUrl = process.env.NODE_ENV === 'production'
    ? 'https://examtopics-practice.onrender.com'
    : 'http://localhost:3000';

  return (process.env.FRONTEND_URL || defaultUrl).replace(/\/+$/, '');
};

module.exports = getFrontendUrl;
