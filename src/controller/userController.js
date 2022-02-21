require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const AppError = require('./../utils/appError');
const helperFn = require('../utils/helperFn');
const jwt = require('jsonwebtoken');
const cloudinary = require('./../utils/imageUpload');

const uploadAvatar = helperFn.upload.single('avatar');

//====================

const updateMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const { phone, age } = req.body;
    if (req.file) {
      const img = await cloudinary.uploader.upload(req.file.path, {
        public_id: req.file.filename, // define filename
        folder: 'DEV',
      });
      user.avatar_path = await img.url;
    }
    if (phone) user.phone = phone;
    if (age) user.age = age;
    res.status(200).json({
      status: 'success',
      data: user,
    });
    user.save();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
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
    res.send('password updated');
  } catch (err) {
    next(err);
  }
};

const signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const hashPWD = await bcrypt.hash(password, 8);
    const user = await User.create({
      email,
      username,
      password: hashPWD,
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
  } catch (err) {
    const errMsg = err?.errors ? err.errors[0].message : undefined;
    if (errMsg) {
      return next(new AppError(errMsg, 401));
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email: inputEmail, password: inputPassword } = req.body;
    if (!inputEmail || !inputPassword) {
      return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ where: { email: inputEmail } });
    if (!user) {
      return next(new AppError('your email not correct', 400));
    }
    const { email, password, isActive, countLogin, avatar_path, username } =
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
      user.countLogin++;
      user.save();
      return next(new AppError('invalid password', 400));
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
          avatar_path: avatar_path,
        },
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const verifyUserEmail = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      attributes: ['id', 'isActive'],
      where: {
        email: decoded.email,
      },
    });
    user.isActive = true;
    user.save();
    res.redirect('/api/users');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup: signup,
  login: login,
  updatePassword: updatePassword,
  updateMe: updateMe,
  uploadAvatar: uploadAvatar,
  verifyUserEmail: verifyUserEmail,
};
