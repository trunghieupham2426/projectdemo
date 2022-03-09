const express = require('express');
const validate = require('../validate/validate');

const router = express.Router();

const {
  registerClass,
  cancelRegisClass,
  getAllClass,
  getMyRegisClass,
  getCalendarClass,
} = require('../controller/classController');

const {
  createClass,
  assignCalendarForClass,
  updateClass,
  deleteClass,
  createCalendar,
  updateCalendar,
  submitClassRegistration,
  viewUserInClass,
  getListRegisterClass,
} = require('../controller/adminController');

const auth = require('../middleware/auth');

//admin

router
  .route('/')
  .get(auth.protectingRoutes, getAllClass)
  .post(
    auth.protectingRoutes,
    auth.checkRole('admin'),
    validate.classValidate,
    createClass
  );

router
  .route('/:id')
  .patch(
    auth.protectingRoutes,
    auth.checkRole('admin'),
    validate.classValidate,
    updateClass
  )
  .delete(auth.protectingRoutes, auth.checkRole('admin'), deleteClass);

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
  '/classCalendar',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  assignCalendarForClass
);
router.patch(
  '/calendar/:id',
  auth.protectingRoutes,
  auth.checkRole('admin'),
  validate.calendarValidate,
  updateCalendar
);

//user - admin
router
  .route('/calendar')
  .post(
    auth.protectingRoutes,
    auth.checkRole('admin'),
    validate.calendarValidate,
    createCalendar
  )
  .get(getCalendarClass);
router.get('/myClass', auth.protectingRoutes, getMyRegisClass);
router.post(
  '/register',
  auth.protectingRoutes,
  validate.classIdValidate,
  registerClass
);
router.patch('/:id/cancel', auth.protectingRoutes, cancelRegisClass);

module.exports = router;
