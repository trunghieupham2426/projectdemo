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
  getAllUsers,
} = require('../controller/userController');

router.get('/', getAllUsers);

router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.patch('/updateMyPassword', protectingRoutes, updatePassword);

router.get('/verify/:token', verifyUserEmail);

module.exports = router;
