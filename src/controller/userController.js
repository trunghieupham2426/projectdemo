require('dotenv').config();
const User = require('../model/userModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const getAllUsers = async (req, res, next) => {
  const allUser = await User.findAll();

  res.send(JSON.stringify(allUser));

  //not finish test only
};

const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashPWD = await bcrypt.hash(password, 8);
    const user = await User.create({ email, username, password: hashPWD });
    const token = generaToken(user.id);
    sendEmail(
      email,
      'Verify Your Email',
      'click here to verify your email',
      'verify',
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

const verifyUserEmail = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      attributes: ['id', 'isActive'],
      where: {
        id: decoded.id,
      },
    });
    user.isActive = true;
    user.save();
    res.redirect('/users');
    next();
  } catch (err) {
    res.send('try again later');
  }
};

// helper function

function generaToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '3m',
  });
}

async function sendEmail(userEmail, subject, text, endpoint, token) {
  const url = `http:127.0.0.1:5000`;
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
      url + '/api/users/' + endpoint + '/' + token
    } target="_blank">${text}</a>`,
  };
  await transporter.sendMail(mailOption);
}

module.exports = {
  signup: signup,
  verifyUserEmail: verifyUserEmail,
  getAllUsers: getAllUsers,
};
