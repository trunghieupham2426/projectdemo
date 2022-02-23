const { User } = require('../models');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

exports.protectingRoutes = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith('Bearer') &&
      req.headers.authorization.split(' ')[1];

    if (!token || token === 'null') {
      return next(new AppError('You are not logged in', 401));
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      attributes: { exclude: ['password', 'countLogin'] },
      where: { id: decoded.id },
    });
    if (!user) {
      return next(new AppError('this user does not exist', 401));
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.loginLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 5, // 5 request per / 3 minutes
  message: 'Something went wrong , try again after 3 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

exports.checkRole = (role) => {
  if (role === 'admin') role = '1';
  else role = '0';
  return (req, res, next) => {
    if (role !== req.user.role) {
      return next(
        new AppError('you dont have permission to do this action', 403)
      );
    }
    next();
  };
};
