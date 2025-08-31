const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

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
      error: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid data format',
      details: `Invalid ${err.path}: ${err.value}`
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

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
