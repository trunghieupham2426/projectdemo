require('dotenv').config();
const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../validate/validate');

const router = express.Router();

const {
  signup,
  login,
  verifyUserEmail,
  updatePassword,
  updateMe,
  uploadAvatar,
  getMe,
} = require('../controller/userController');

router.get('/', (req, res) => {
  res.send('hello');
});
router.get('/verify/:token', verifyUserEmail);

router.post('/signup', validate.signUpValidate, signup);
router.post('/login', auth.loginLimiter, login);
router.patch('/updateMyPassword', auth.protectingRoutes, updatePassword);
router.get('/getme', auth.protectingRoutes, getMe);
router.patch(
  '/updateMe',
  auth.protectingRoutes,
  uploadAvatar,
  validate.updateMeValidate,
  updateMe
);

module.exports = router;

// module.exports = { userRouter: router };
