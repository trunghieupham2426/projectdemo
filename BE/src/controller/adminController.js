const Sequelize = require('sequelize');
const {
  Class,
  User,
  Regis,
  Class_Users,
  sequelize,
  Calendar,
  Class_Calendar,
} = require('../models');
const AppError = require('../utils/ErrorHandler/appError');
const helperFn = require('../utils/helperFn');
const catchAsync = require('../utils/ErrorHandler/catchAsync');

const Op = Sequelize.Op;

const createClass = catchAsync(async (req, res, next) => {
  //date mm-dd-yyyy
  const { subject, maxStudent, startDate, endDate } = req.body;
  const newClass = await Class.create({
    subject,
    maxStudent,
    startDate,
    endDate,
  });
  res.status(200).json({
    status: 'success',
    data: newClass,
  });
});

const assignCalendarForClass = catchAsync(async (req, res, next) => {
  const { classId, calendarId } = req.body;
  const classCalendar = await Class_Calendar.findOne({
    where: { classId, calendarId },
  });
  if (classCalendar) {
    return next(new AppError('already assign this calendar for class', 400));
  }
  const currentClass = await Class.findOne({ where: { id: classId } });
  const currentCalendar = await Calendar.findOne({
    where: { id: calendarId },
  });
  if (!currentClass || !currentCalendar) {
    return next(new AppError('class or calendar not available ', 404));
  }
  // update status of Class from 'pending' to 'open' when assign calendar
  await currentClass.update({ status: 'open' });
  //insert data to class_calendars table
  await Class_Calendar.create({ classId, calendarId });
  res.status(200).json({
    status: 'success',
    message: 'your action successfully',
  });
});

const updateClass = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const currentClass = await Class.findOne({ where: { id: classId } });
  if (!currentClass) {
    return next(new AppError('No Class found with this id', 404));
  }
  Object.assign(currentClass, req.body);
  currentClass.save();
  res.status(200).json({
    status: 'success',
    data: currentClass,
  });
});

const findClass = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const currentClass = await Class.findOne({ where: { id } });
  if (!currentClass) {
    return next(new AppError('No class founded '), 404);
  }
  res.status(200).json({
    status: 'success',
    data: currentClass,
  });
});

const deleteClass = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const currentClass = await Class.findOne({ where: { id: classId } });
  if (!currentClass) {
    return next(new AppError('No Class found with this id', 404));
  }
  if (currentClass.currentStudent !== 0) {
    return next(new AppError('Class have student , can not delete', 400));
  }
  await currentClass.destroy();
  res.status(200).json({
    status: 'success',
  });
});

const createCalendar = catchAsync(async (req, res, next) => {
  const { dayOfWeek, openTime, closeTime } = req.body;
  const calendar = await Calendar.create({
    dayOfWeek,
    openTime,
    closeTime,
  });
  res.status(200).json({
    status: 'success',
    data: calendar,
  });
});

const updateCalendar = catchAsync(async (req, res, next) => {
  const calendarId = req.params.id;
  const currentCalendar = await Calendar.findOne({
    where: { id: calendarId },
  });
  if (!currentCalendar) {
    return next(new AppError('No calendar found with this id', 404));
  }

  if (
    currentCalendar.openTime > req.body.closeTime ||
    req.body.openTime > currentCalendar.closeTime
  ) {
    return next(new AppError('openTime must smaller than closeTime'));
  }
  Object.assign(currentCalendar, req.body);
  currentCalendar.save();
  res.status(200).json({
    status: 'success',
    data: currentCalendar,
  });
});

const getListRegisterClass = catchAsync(async (req, res, next) => {
  //127.0.0.1:5000/api/classes/listRegistered?action=reject,accept
  let listRegis;
  if (req.query.action) {
    const defaultFilter = ['accept', 'reject'];
    let userFilter = req.query.action?.split(',');
    if (!userFilter) {
      userFilter = defaultFilter;
    }

    listRegis = await Regis.findAll({
      where: {
        admAction: {
          [Op.in]: userFilter,
        },
      },
    });
  } else {
    listRegis = await Regis.findAll();
  }
  res.status(200).json({
    status: 'success',
    data: listRegis,
  });
});

const viewUserInClass = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const data = await Class.findOne({
    where: { id: classId },
    attributes: [],
    include: [
      {
        model: User,
        attributes: ['email', 'username', 'age', 'phone'],
        through: {
          attributes: ['status'],
        },
      },
    ],
  });
  if (!data) {
    return next(new AppError('classId not correct', 404));
  }
  res.status(200).json({
    status: 'success',
    data: data,
  });
});

const submitClassRegistration = async (req, res, next) => {
  const accept = 'accept';
  const reject = 'reject';
  const { action, classId, userId } = req.body;
  await sequelize.transaction(async (t) => {
    const currentRegis = await Regis.findOne({
      where: { classId, userId, status: 'pending' },
      include: {
        model: User,
        attributes: ['email'],
      },
    });
    if (!currentRegis) {
      return next(new AppError('No register class founded', 404));
    }
    const currentClass = await Class.findOne({
      where: { id: classId },
    });
    const userEmail = currentRegis.User.email;
    const maxStudent = currentClass.maxStudent;
    const currentStudent = currentClass.currentStudent;
    if (action === accept) {
      if (currentClass.status === 'close') {
        // khi lop close thi ko accept dc , nhung van reject duoc
        return next(
          new AppError('the class is close , can not accept at this time', 404)
        );
      }
      await currentRegis.update(
        {
          admAction: action,
          status: 'active',
        },
        { transaction: t }
      );
      await currentClass.increment('currentStudent', { transaction: t });
      if (maxStudent - currentStudent === 1) {
        await currentClass.update(
          {
            status: 'close',
          },
          { transaction: t }
        );
      }
      await Class_Users.create({ classId, userId }, { transaction: t });
      helperFn.sendEmail(
        userEmail,
        'Congratulation',
        'Congratulation , your registered class has been accepted'
      );
    }
    if (action === reject) {
      await currentRegis.update(
        {
          admAction: action,
          status: 'cancel',
        },
        { transaction: t }
      );
      helperFn.sendEmail(
        userEmail,
        'Cancel Class',
        'Your registered class has been cancel'
      );
    }
    res.status(200).json({
      status: 'success',
    });
  });
};

module.exports = {
  createClass,
  assignCalendarForClass,
  updateClass,
  deleteClass,
  createCalendar,
  updateCalendar,
  submitClassRegistration,
  getListRegisterClass,
  viewUserInClass,
  findClass,
};
