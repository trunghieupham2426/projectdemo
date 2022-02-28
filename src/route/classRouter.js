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
  viewUserInClass,
  createCalendar,
  updateCalendar,
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

router.get(
  '/viewUser/:id',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  viewUserInClass
);

router.post(
  '/calendar',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  validate.calendarValidate,
  createCalendar
);
router.patch(
  '/calendar/:id',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  validate.calendarValidate,
  updateCalendar
);

//user - admin

router.get('/calendar', getCalendarClass);
router.get('/myClass', auth.protectingRoutes, getMyRegisClass);
router.post(
  '/register',
  auth.protectingRoutes,
  validate.classIdValidate,
  registerClass
);
router.patch('/:id/cancel', auth.protectingRoutes, cancelRegisClass);

module.exports = router;
