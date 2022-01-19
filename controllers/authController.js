const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_secret, {
    expiresIn: process.env.JWT_expiresIn,
  });
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if the email password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) check if user exists
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) if everything ok, sent jwt to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) we need to get the token & check whether it really exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError('you are not logged in. please log in to get access', 401)
    );
  }
  //2) validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_secret);
  console.log(decoded);

  //3) need to check whether the user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );
  }
  //4) check if user changed password after the jwt was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('user recently changed password... please log in again', 401)
    );
  }

  //grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles is an array
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permisson to perform this action', 403)
      );
    }
    next();
  };
