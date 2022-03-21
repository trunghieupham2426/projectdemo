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

//TokenExpiredError
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired', 401);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const sendError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, message: err.message };

  switch (err.name) {
    case 'ValidationError':
      error = validationError(error);
      break;
    case 'SequelizeUniqueConstraintError':
      error = sequelizeConstraintError(error);
      break;
    case 'SequelizeValidationError':
      error = sequelizeValidationError(error);
      break;
    case 'TokenExpiredError':
      error = handleJWTExpiredError();
      break;
    case 'JsonWebTokenError':
      error = handleJWTError();
      break;
    default:
      error.message = err.message;
  }
  // send error
  sendError(error, res);
};
