require('dotenv').config();
const User = require('../model/userModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const getAllUsers = async (req, res, next) => {
  const allUser = await User.findAll();

  res.send(JSON.stringify(allUser));

  //not finish test only
};

const protectingRoutes = async (req, res) => {
  // console.log(req.headers.authorization);
  const token =
    req.headers.authorization.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.send(`you're not login`);
  }
};

const updatePassword = async (req, res) => {};

const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashPWD = await bcrypt.hash(password, 8);
    const user = await User.create({ email, username, password: hashPWD });
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
    console.log(err);
    res.send('something went wrong');
  }
};

const login = async (req, res) => {
  try {
    const { email: inputEmail, password: inputPassword } = req.body;
    const user = await User.findOne({ where: { email: inputEmail } });
    if (!user) {
      return res.send('your email not correct');
    }
    const { email, password, isActive, countLogin, avatar_path, username } =
      user;
    if (countLogin >= 3 || !isActive) {
      return res.send(
        'your account has been disabled or not active yet , please contact admin '
      );
    }
    const isCorrect = await comparePassword(inputPassword, password);
    if (!isCorrect) {
      user.countLogin++;
      user.save();
      return res.send('invalid password');
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
    res.send('login fail bla bla');
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
    res.send('try again later');
  }
};

module.exports = {
  signup: signup,
  login: login,
  updatePassword: updatePassword,
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
