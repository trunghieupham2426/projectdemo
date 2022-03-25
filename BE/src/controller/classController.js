const Sequelize = require('sequelize');
const { Class, Regis, Calendar } = require('../models');
const AppError = require('../utils/ErrorHandler/appError');
const helperFn = require('../utils/helperFn');
const catchAsync = require('../utils/ErrorHandler/catchAsync');

const Op = Sequelize.Op;

//  for user and admin
const registerClass = catchAsync(async (req, res, next) => {
  const { classId } = req.body;
  const userId = req.user.id;
  const currentClass = await Class.findOne({ where: { id: classId } });
  if (!currentClass || currentClass.status !== 'open') {
    return next(
      new AppError(
        'The class not available or not open at this time , try again later',
        404
      )
    );
  }
  const currentRegis = await Regis.findOne({ where: { classId, userId } });
  if (currentRegis && currentRegis.dataValues.status === 'pending') {
    return next(new AppError('you  already register this class', 400));
  }
  await Regis.create({ classId, userId });
  helperFn.sendEmail(
    req.user.email,
    'THANK YOU FOR REGISTER CLASS',
    'your register class is pending , we will contact you later'
  );
  res.status(200).json({
    status: 'success',
    message: 'please check your email for more information',
  });
});

const cancelRegisClass = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const userId = req.user.id;
  const cancelClass = await Regis.findOne({
    where: { classId, userId, status: 'pending' },
  });
  if (!cancelClass) {
    return next(new AppError(`Not pending , can not cancel`, 400));
  }
  cancelClass.status = 'cancel';
  cancelClass.save();
  res.status(200).json({
    status: 'success',
    message: 'cancel successfully',
    data: cancelClass,
  });
});

const getAllClass = catchAsync(async (req, res, next) => {
  //127.0.0.1:5000/api/classes?status=open
  let statusFilter = ['open'];
  if (req.query.status) {
    statusFilter = req.query.status.split(',');
  }
  const objFilter = {
    status: {
      [Op.in]: statusFilter,
    },
  };
  const allClass = await Class.findAll({
    where: objFilter,
    include: {
      model: Calendar,
      through: {
        attributes: [],
      },
    },
  });

  res.status(200).json({
    status: 'success',
    data: allClass,
  });
});

const getMyRegisClass = catchAsync(async (req, res, next) => {
  //127.0.0.1:5000/api/classes/myClass?status=pending,active,cancel
  const defaultFilter = ['pending', 'active', 'cancel'];
  let userFilter = req.query.status?.split(',');
  if (!userFilter) {
    userFilter = defaultFilter;
  }
  const userId = req.user.id;
  const myClass = await Regis.findAll({
    where: {
      userId: userId,
      status: {
        [Op.in]: userFilter,
      },
    },
    include: {
      model: Class,
    },
  });

  res.status(200).json({
    status: 'success',
    data: myClass,
  });
});

const getCalendarClass = catchAsync(async (req, res, next) => {
  const classId = req.query.class;
  if (!classId) {
    return next(new AppError('please provide class id', 400));
  }
  const currentCLass = await Class.findOne({
    where: { id: classId },
    attributes: ['subject', 'startDate', 'endDate'],
    include: {
      model: Calendar,
      attributes: ['dayOfWeek', 'openTime', 'closeTime'],
      through: {
        attributes: [], // dont get data from junction table
      },
    },
  });
  if (!currentCLass) {
    return next(new AppError('this class does not exist', 404));
  }
  res.status(200).json({
    status: 'success',
    data: currentCLass,
  });
});

module.exports = {
  registerClass,
  cancelRegisClass,
  getAllClass,
  getMyRegisClass,
  getCalendarClass,
};
