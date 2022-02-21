// helper function
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

exports.generaToken = (key, time) => {
  return jwt.sign(key, process.env.JWT_SECRET, {
    expiresIn: time,
  });
};

exports.sendEmail = async (
  userEmail,
  subject,
  text,
  endpoint = '/',
  token = ''
) => {
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
    html: `<a href=${domain + endpoint + token} target="_blank">${text}</a>`,
  };
  await transporter.sendMail(mailOption);
};

exports.comparePassword = async (inputPwd, userPwd) => {
  return await bcrypt.compare(inputPwd, userPwd);
};

// image upload setting

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

exports.upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//==================
