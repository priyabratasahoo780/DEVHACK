import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(`${err.message} | ${req.method} ${req.originalUrl}`);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Validation Error', errors: err.errors });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: `File Upload Error: ${err.message}` });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
