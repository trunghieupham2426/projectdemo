require('dotenv').config();
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('./../validate/validate');

const {
  signup,
  login,
  verifyUserEmail,
  updatePassword,
  updateMe,
  uploadAvatar,
} = require('../controller/userController');

router.get('/', (req, res) => {
  res.send('hello');
});
router.get('/verify/:token', verifyUserEmail);

router.post('/signup', validate.signUpValidate, signup);
router.post(
  '/login',
  //auth.loginLimiter,
  login
);
router.patch(
  '/updateMyPassword',
  auth.protectingRoutes,

  updatePassword
);
router.patch(
  '/updateMe',
  auth.protectingRoutes,
  uploadAvatar,
  validate.updateMeValidate,
  updateMe
);

module.exports = router;

// module.exports = { userRouter: router };
