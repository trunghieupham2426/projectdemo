const AppError = require('./appError');

// validationError
const validationError = (err) => {
  const message = err.details[0].message;
  return new AppError(message, 400);
};

// SequelizeUniqueConstraintError
const sequelizeConstraintError = (err) => {
  const message = err.errors[0].message;
  return new AppError(message, 400);
};

//SequelizeValidationError
const sequelizeValidationError = (err) => {
  const message = err.errors[0].message;
  return new AppError(message, 400);
};

const sendError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // err: err,
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;
  if (err.name === 'ValidationError') error = validationError(error);
  if (err.name === 'SequelizeUniqueConstraintError') {
    error = sequelizeConstraintError(error);
  }
  if (err.name === 'SequelizeValidationError') {
    error = sequelizeValidationError(error);
  }

  // send error
  sendError(error, res);
};
