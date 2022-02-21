const express = require('express');
const router = express.Router();
const {
  registerClass,
  cancelRegisClass,
} = require('./../controller/classController');
const auth = require('../middleware/auth');

router.use(auth.protectingRoutes);

router.post('/register', registerClass);
router.patch('/cancelRegisClass', cancelRegisClass);

module.exports = router;
