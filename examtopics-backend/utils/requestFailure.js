function logFailure(event, requestId) {
  console.error(JSON.stringify({ event, requestId }));
}

function sendInternalError(res, event, message = 'Internal server error') {
  const requestId = res.locals?.requestId;
  logFailure(event, requestId);
  return res.status(500).json({ success: false, error: message, requestId });
}

module.exports = { logFailure, sendInternalError };
