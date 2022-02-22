const express = require('express');
const validate = require('../validate/validate');
const router = express.Router();

const {
  registerClass,
  cancelRegisClass,
  getAllClass,
  getMyRegisClass,
  getCalendarClass,
  createClass,
  updateClass,
} = require('./../controller/classController');
const auth = require('../middleware/auth');

router.get('/', getAllClass);
router.post(
  '/',
  auth.protectingRoutes,
  auth.restrictTo('1'), // "1" = admin , "0" = user
  validate.classValidate,
  createClass
);
router.patch('/:id', updateClass);

router.get('/calendar/:id', getCalendarClass);
router.get('/myClass', auth.protectingRoutes, getMyRegisClass);
router.post(
  '/register',
  auth.protectingRoutes,
  validate.classIdValidate,
  registerClass
);
router.patch(
  '/cancel',
  auth.protectingRoutes,
  validate.classIdValidate,
  cancelRegisClass
);

module.exports = router;
