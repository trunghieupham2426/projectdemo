const express = require('express');
const validate = require('./../validate/validateUser');
const router = express.Router();

const {
  registerClass,
  cancelRegisClass,
  getAllClass,
  getUserRegisCLass,
} = require('./../controller/classController');
const auth = require('../middleware/auth');

router.get('/', getAllClass);
router.use(auth.protectingRoutes);
router.get('/myRegisteredClass', getUserRegisCLass);
router.post('/register', validate.classValidate, registerClass);
router.patch('/cancelRegisClass', validate.classValidate, cancelRegisClass);

module.exports = router;
