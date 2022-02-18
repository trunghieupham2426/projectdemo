// helper function
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.generaToken = (key, time) => {
  return jwt.sign(key, process.env.JWT_SECRET, {
    expiresIn: time,
  });
};

exports.sendEmail = async (userEmail, subject, text, endpoint, token) => {
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
};

exports.comparePassword = async (inputPwd, userPwd) => {
  return await bcrypt.compare(inputPwd, userPwd);
};
