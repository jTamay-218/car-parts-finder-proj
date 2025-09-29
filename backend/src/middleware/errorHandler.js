// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Database errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error = {
          message: 'Resource already exists',
          status: 409,
          details: 'A record with this information already exists'
        };
        break;
      case '23503': // Foreign key violation
        error = {
          message: 'Referenced resource not found',
          status: 400,
          details: 'The referenced resource does not exist'
        };
        break;
      case '23502': // Not null violation
        error = {
          message: 'Required field missing',
          status: 400,
          details: 'A required field is missing or null'
        };
        break;
      case '42P01': // Undefined table
        error = {
          message: 'Database table not found',
          status: 500,
          details: 'The requested table does not exist'
        };
        break;
      case '42703': // Undefined column
        error = {
          message: 'Database column not found',
          status: 500,
          details: 'The requested column does not exist'
        };
        break;
      default:
        error = {
          message: 'Database error',
          status: 500,
          details: err.message
        };
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401,
      details: 'The provided token is invalid'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401,
      details: 'The provided token has expired'
    };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation failed',
      status: 400,
      details: err.message
    };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'File too large',
      status: 400,
      details: 'The uploaded file exceeds the maximum allowed size'
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      message: 'Unexpected file field',
      status: 400,
      details: 'An unexpected file field was provided'
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    error = {
      message: 'Too many requests',
      status: 429,
      details: 'Rate limit exceeded. Please try again later.'
    };
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && error.status === 500) {
    error.message = 'Internal Server Error';
    error.details = 'An unexpected error occurred';
  }

  // Log error details
  console.error('Error details:', {
    message: error.message,
    status: error.status,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(error.status).json({
    error: error.message,
    details: error.details,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
