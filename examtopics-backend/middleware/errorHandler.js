const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'Request body too large' });
  }
  if (err.type === 'entity.parse.failed' || err.type === 'request.size.invalid' || err.type === 'request.aborted') {
    return res.status(400).json({ success: false, error: 'Invalid request body' });
  }
  if (err.type === 'encoding.unsupported' || err.type === 'charset.unsupported') {
    return res.status(415).json({ success: false, error: 'Unsupported request encoding' });
  }

  // MongoDB specific errors
  if (err.name === 'ParallelSaveError') {
    return res.status(409).json({
      success: false,
      error: 'Concurrent update detected. Please try again.',
      details: 'The document is being updated by another request.'
    });
  }

  if (err.name === 'VersionError') {
    return res.status(409).json({
      success: false,
      error: 'Document version conflict. Please refresh and try again.',
      details: 'The document has been modified by another request.'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed'
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid data format'
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry',
      details: 'A record with this information already exists.'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      details: 'The provided token is invalid.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired',
      details: 'The provided token has expired.'
    });
  }

  console.error('Unhandled request error');
  return res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

module.exports = errorHandler;
