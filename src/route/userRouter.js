require('dotenv').config();
const express = require('express');
const router = express.Router();
const {
  signup,
  verifyUserEmail,
  getAllUsers,
} = require('../controller/userController');

router.get('/', getAllUsers);

router.post('/signup', signup);

router.get('/verify/:token', verifyUserEmail);

module.exports = router;
