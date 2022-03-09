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
  const { subject, max_student, start_date, end_date } = req.body;
  const newClass = await Class.create({
    subject,
    max_student,
    start_date,
    end_date,
  });
  res.status(200).json({
    status: 'success',
    data: newClass,
  });
});

const assignCalendarForClass = catchAsync(async (req, res, next) => {
  const { class_id, calendar_id } = req.body;
  const classCalendar = await Class_Calendar.findOne({
    where: { class_id, calendar_id },
  });
  if (classCalendar) {
    return next(new AppError('already assign this calendar for class', 400));
  }
  const currentClass = await Class.findOne({ where: { id: class_id } });
  const currentCalendar = await Calendar.findOne({
    where: { id: calendar_id },
  });
  if (!currentClass || !currentCalendar) {
    return next(new AppError('class or calendar not available ', 404));
  }
  // update status of Class from 'pending' to 'open' when assign calendar
  await currentClass.update({ status: 'open' });
  //insert data to class_calendars table
  await Class_Calendar.create({ class_id, calendar_id });
  res.status(200).json({
    status: 'success',
    message: 'your action successfully',
  });
});

const updateClass = catchAsync(async (req, res, next) => {
  const class_id = req.params.id;
  const currentClass = await Class.findOne({ where: { id: class_id } });
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

const deleteClass = catchAsync(async (req, res, next) => {
  const class_id = req.params.id;
  const currentClass = await Class.findOne({ where: { id: class_id } });
  if (!currentClass) {
    return next(new AppError('No Class found with this id', 404));
  }
  await currentClass.destroy();
  res.status(200).json({
    status: 'success',
  });
});

const createCalendar = catchAsync(async (req, res, next) => {
  const { day_of_week, open_time, close_time } = req.body;
  const calendar = await Calendar.create({
    day_of_week,
    open_time,
    close_time,
  });
  res.status(200).json({
    status: 'success',
    data: calendar,
  });
});

const updateCalendar = catchAsync(async (req, res, next) => {
  const calendar_id = req.params.id;
  const currentCalendar = await Calendar.findOne({
    where: { id: calendar_id },
  });
  if (!currentCalendar) {
    return next(new AppError('No calendar found with this id', 404));
  }
  Object.assign(currentCalendar, req.body);
  currentCalendar.save();
  res.status(200).json({
    status: 'success',
    data: currentCalendar,
  });
});

const submitClassRegistration = async (req, res, next) => {
  const t = await sequelize.transaction();
  const accept = 'accept';
  const reject = 'reject';
  try {
    const { action, class_id, user_id } = req.body;
    const currentRegis = await Regis.findOne({
      where: { class_id: class_id, user_id: user_id, status: 'pending' },
      include: [
        {
          model: User,
          attributes: ['email'],
        },
      ],
    });
    const currentClass = await Class.findOne({
      where: { id: class_id },
    });
    if (!currentRegis) {
      return next(new AppError('No register class founded', 404));
    }
    const userEmail = currentRegis.User.email;
    const maxStudent = currentClass.max_student;
    const currentStudent = currentClass.current_student;
    if (action === accept) {
      if (currentClass.status === 'close') {
        // khi lop close thi ko accept dc , nhung van reject duoc
        return next(
          new AppError('the class is close , can not accept at this time', 404)
        );
      }
      await currentRegis.update(
        {
          adm_action: action,
          status: 'active',
        },
        { transaction: t }
      );
      await currentClass.increment('current_student', { transaction: t });
      if (maxStudent - currentStudent === 1) {
        await currentClass.update(
          {
            status: 'close',
          },
          { transaction: t }
        );
      }
      await Class_Users.create({ class_id, user_id }, { transaction: t });
      helperFn.sendEmail(
        userEmail,
        'Congratulation',
        'Congratulation , your registered class has been accepted'
      );
    }
    if (action === reject) {
      await currentRegis.update(
        {
          adm_action: action,
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
    await t.commit();
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

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
        adm_action: {
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
  const class_id = req.params.id;
  const data = await Class.findOne({
    where: { id: class_id },
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
    return next(new AppError('class_id not correct', 404));
  }
  res.status(200).json({
    status: 'success',
    data: data,
  });
});

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
};
