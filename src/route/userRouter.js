require('dotenv').config();
const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  verifyUserEmail,
  getAllUsers,
} = require('../controller/userController');

router.get('/', getAllUsers);

router.post('/signup', signup);
router.post('/login', login);

router.get('/verify/:token', verifyUserEmail);

module.exports = router;
