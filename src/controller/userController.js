require('dotenv').config();
const User = require('../model/userModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const userSchemaValidate = require('../validate/validateUser');
const AppError = require('./../utils/appError');
// image upload setting
const multer = require('multer');
const cloudinary = require('./../utils/imageUpload');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/image/user');
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.user.id}-avatar.jpeg`); // override the images
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only images'));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadAvatar = upload.single('avatar');

//====================

const updateMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const { phone, age } = req.body;
    if (req.file) {
      const img = await cloudinary.uploader.upload(req.file.path, {
        public_id: req.file.filename,
        folder: 'DEV',
      });
      user.avatar_path = await img.url;
    }
    if (phone) user.phone = phone;
    if (age) user.age = age;
    res.send(user);
    user.save();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  // const allUser = await User.findAll();

  // res.send(JSON.stringify(allUser));
  res.send('hello');

  //not finish test only
};

const protectingRoutes = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith('Bearer') &&
      req.headers.authorization.split(' ')[1];
    if (!token) {
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

const updatePassword = async (req, res, next) => {
  try {
    const { oldPwd, newPwd } = req.body;
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    const checkPwd = await comparePassword(oldPwd, user.password);
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
    const { email, username, password } =
      await userSchemaValidate.validateAsync(req.body);
    const hashPWD = await bcrypt.hash(password, 8);
    const user = await User.create({
      email,
      username,
      password: hashPWD,
    });
    const token = generaToken({ email }, '3m');
    sendEmail(
      email,
      'Verify Your Email',
      'click here to verify your email',
      'api/users/verify',
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
    const isCorrect = await comparePassword(inputPassword, password);
    if (!isCorrect) {
      user.countLogin++;
      user.save();
      return next(new AppError('invalid password', 400));
    }

    const token = generaToken({ id: user.id, role: user.role }, '1d');
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

const loginLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 5, // 5 request per / 3 minutes
  message: 'Something went wrong , try again after 3 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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
    next();
  } catch (err) {
    res.send('something went wrong , please contact the administrator');
  }
};

module.exports = {
  signup: signup,
  login: login,
  updatePassword: updatePassword,
  updateMe: updateMe,
  uploadAvatar: uploadAvatar,
  loginLimiter: loginLimiter,
  verifyUserEmail: verifyUserEmail,
  protectingRoutes: protectingRoutes,
  getAllUsers: getAllUsers,
};

// helper function

function generaToken(key, time) {
  return jwt.sign(key, process.env.JWT_SECRET, {
    expiresIn: time,
  });
}

async function sendEmail(userEmail, subject, text, endpoint, token) {
  const domain = `http:127.0.0.1:5000`;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOption = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject,
    html: `<a href=${
      domain + '/' + endpoint + '/' + token
    } target="_blank">${text}</a>`,
  };
  await transporter.sendMail(mailOption);
}

async function comparePassword(inputPwd, userPwd) {
  return await bcrypt.compare(inputPwd, userPwd);
}
