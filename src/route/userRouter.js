require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../model/userModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  const allUser = await User.findAll();

  res.send(JSON.stringify(allUser));

  //not finish test only
});

router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashPWD = await bcrypt.hash(password, 8);
    const user = await User.create({ email, username, password: hashPWD });
    const token = generaToken(user.id);
    sendEmail(email, 'Verify Your Email', 'Hello boi', token);
    res.status(200).json({
      status: 'success',
      message: 'please check your email to confirm within 3 minutes ',
    });
  } catch (err) {
    console.log(err);
    res.send('something went wrong');
  }
});

module.exports = router;

// helper function

function generaToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '180s',
  });
}

async function sendEmail(userEmail, subject, text, token) {
  const url = `http:127.0.0.1:5000`;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'devtestonly123@gmail.com',
      pass: 'mypasswordveryhard@',
    },
  });

  const mailOption = {
    from: 'devtestonly123@gmail.com',
    to: userEmail,
    subject: subject,
    text: text,
    html: `<a href=${
      url + '/api/user/verify/' + token
    } target="_blank">click here</a>`,
  };
  const info = await transporter.sendMail(mailOption);
}
