const express = require('express');
const router = express.Router();
const { registerClass } = require('./../controller/classController');
const auth = require('../middleware/auth');

router.use(auth.protectingRoutes);

router.post('/register', registerClass);

module.exports = router;
