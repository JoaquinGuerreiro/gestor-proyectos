const CustomError = require('../utils/CustomError');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log del error en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', err);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler; 