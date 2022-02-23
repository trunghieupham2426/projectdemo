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
  deleteClass,
  submitClassRegistration,
  getListRegisterClass,
} = require('./../controller/classController');
const auth = require('../middleware/auth');

//admin

router.get('/', getAllClass);
router.post(
  '/',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  validate.classValidate,
  createClass
);
router.patch(
  '/:id',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  validate.classValidate,
  updateClass
);
router.delete(
  '/:id',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  deleteClass
);
router.put(
  '/admin/submit',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  submitClassRegistration
);

router.get(
  '/listRegistered',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  getListRegisterClass
);

//user - admin

router.get('/calendar/:id', getCalendarClass);
router.get('/myClass', auth.protectingRoutes, getMyRegisClass);
router.post(
  '/register',
  auth.protectingRoutes,
  validate.classIdValidate,
  registerClass
);
router.patch('/:id/cancel', auth.protectingRoutes, cancelRegisClass);

module.exports = router;
