const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid Token. Please login again', 401);

const handleJWTTokenExpError = () =>
  new AppError('your Token has expired Expired', 401);

const handleDuplicateFieldDB = (err) => {
  const message = `Duplicate field value ${err.keyValue.name}.. please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((item) => item.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const prodError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('🎃 error');
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log('err controller');
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('prod');
    let { error } = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTTokenExpError();
    if (error.name === 'validationError')
      error = handleValidationErrorDB(error);
    prodError(error, res);
  }
};
