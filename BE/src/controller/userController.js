require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/ErrorHandler/appError');
const helperFn = require('../utils/helperFn');
const cloudinary = require('../utils/imageUpload');
const catchAsync = require('../utils/ErrorHandler/catchAsync');

const uploadAvatar = helperFn.upload.single('avatar');
const isTest = process.env.NODE_ENV === 'test';

//====================

const updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: { exclude: ['password', 'role', 'countLogin', 'isActive'] },
  });
  const { phone, age } = req.body;
  if (req.file) {
    const img = await cloudinary.uploader.upload(req.file.path, {
      public_id: req.file.filename, // define filename
      folder: isTest ? 'DEVtest' : 'DEV',
    });
    user.avatarPath = await img.url;
  }
  if (phone) user.phone = phone;
  if (age) user.age = age;
  res.status(200).json({
    status: 'success',
    data: user,
  });
  user.save();
});

const getMe = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ['password', 'role', 'countLogin', 'isActive'] },
  });
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPwd, newPwd } = req.body;
  const user = await User.findOne({
    where: { id: req.user.id },
  });
  const checkPwd = await helperFn.comparePassword(oldPwd, user.password);
  if (!checkPwd) {
    return next(new AppError('please insert correct old password', 400));
  }
  const hashPWD = await bcrypt.hash(newPwd, 8);
  user.password = hashPWD;
  user.save();
  res.status(200).json({
    status: 'success',
  });
});

const signup = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body;
  await User.create({
    email,
    username,
    password: password,
  });

  const token = helperFn.generaToken({ email }, '3m');
  helperFn.sendEmail(
    email,
    'Verify Your Email',
    'click here to verify your email',
    '/api/users/verify/',
    token
  );
  res.status(200).json({
    status: 'success',
    message: 'please check your email to confirm within 3 minutes ',
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email: inputEmail, password: inputPassword } = req.body;
  if (!inputEmail || !inputPassword) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ where: { email: inputEmail } });
  if (!user) {
    return next(new AppError('your email not correct', 400));
  }
  const { email, password, isActive, countLogin, avatarPath, username, id } =
    user;
  if (countLogin >= 3 || !isActive) {
    return next(
      new AppError(
        'your account has been disabled or not active yet , please contact admin',
        400
      )
    );
  }
  const isCorrect = await helperFn.comparePassword(inputPassword, password);
  if (!isCorrect) {
    await user.increment('countLogin');
    user.save();
    return next(new AppError('your password not correct', 400));
  }

  const token = helperFn.generaToken({ id: user.id, role: user.role }, '1d');
  user.countLogin = 0;
  user.save();
  res.status(200).json({
    status: 'success',
    token: token,
    data: {
      user: {
        email: email,
        username: username,
        avatarPath: avatarPath,
        id: id,
      },
    },
  });
});

const verifyUserEmail = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    attributes: ['id', 'isActive'],
    where: {
      email: decoded.email,
    },
  });
  if (!user) {
    return next(new AppError('this email not available', 401));
  }
  user.isActive = true;
  user.save();
  res.status(200).json({
    status: 'success',
  });
});

module.exports = {
  signup: signup,
  login: login,
  updatePassword: updatePassword,
  updateMe: updateMe,
  uploadAvatar: uploadAvatar,
  verifyUserEmail: verifyUserEmail,
  getMe: getMe,
};
