const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific errors
  if (err.message.includes('not found')) {
    statusCode = 404;
    message = err.message;
  } else if (err.message.includes('required') || 
             err.message.includes('Invalid') ||
             err.message.includes('already voted')) {
    statusCode = 400;
    message = err.message;
  } else if (err.message.includes('not active')) {
    statusCode = 403;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;