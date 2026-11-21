const getFrontendUrl = require('./frontendUrl');

// SEC-027: browsers may call the API with credentials only from the configured
// frontend. Production trusts exactly FRONTEND_URL's origin, so a staging API
// never accepts the Render production frontend unless it is configured.
function getCorsOrigins() {
  const frontendOrigin = new URL(getFrontendUrl()).origin;
  if (process.env.NODE_ENV === 'production') return [frontendOrigin];
  return [...new Set(['http://localhost:3000', 'http://localhost:3001', frontendOrigin])];
}

module.exports = getCorsOrigins;
