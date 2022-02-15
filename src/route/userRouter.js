require('dotenv').config();
const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  loginLimiter,
  verifyUserEmail,
  protectingRoutes,
  updatePassword,
  updateMe,
  uploadAvatar,
} = require('../controller/userController');

router.get('/', (req, res) => {
  res.send('hello');
});
router.get('/verify/:token', verifyUserEmail);

router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.patch(
  '/updateMyPassword',
  protectingRoutes,

  updatePassword
);
router.patch('/updateMe', protectingRoutes, uploadAvatar, updateMe);

module.exports = router;
