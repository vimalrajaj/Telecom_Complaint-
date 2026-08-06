const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack);
  
  if (err.name === 'ValidationError') {
    return sendError(res, 400, 'Validation failed.', err.errors || []);
  }
  
  if (err.name === 'UnauthorizedError') {
    return sendError(res, 401, 'Unauthorized.');
  }
  
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 409, 'Duplicate entry. Resource already exists.');
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error.';
  
  return sendError(res, statusCode, message);
};

module.exports = errorHandler;
