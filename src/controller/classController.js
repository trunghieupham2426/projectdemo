const Sequelize = require('sequelize');
const { Class, Regis, Calendar } = require('../models');
const AppError = require('../utils/appError');
const helperFn = require('../utils/helperFn');

const Op = Sequelize.Op;

//  for user and admin
const registerClass = async (req, res, next) => {
  try {
    const { class_id } = req.body;
    const user_id = req.user.id;
    const currentClass = await Class.findOne({ where: { id: class_id } });
    if (!currentClass || currentClass.status !== 'open') {
      return next(
        new AppError(
          'The class not available or not open at this time , try again later',
          404
        )
      );
    }
    const currentRegis = await Regis.findOne({ where: { class_id, user_id } });

    if (currentRegis) {
      return next(new AppError('you  already register this class', 400));
    }
    await Regis.create({ class_id, user_id });
    helperFn.sendEmail(
      req.user.email,
      'THANK YOU FOR REGISTER CLASS',
      'your register class is pending , we will contact you later'
    );
    res.status(200).json({
      status: 'success',
      message: 'please check your email for more information',
    });
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

const cancelRegisClass = async (req, res, next) => {
  try {
    const class_id = req.params.id;
    const user_id = req.user.id;
    const cancelClass = await Regis.findOne({
      where: { class_id: class_id, user_id: user_id, status: 'pending' },
    });
    if (!cancelClass) {
      return next(
        new AppError(`this class already cancel or not pending`, 400)
      );
    }
    cancelClass.status = 'cancel';
    cancelClass.save();
    res.status(200).json({
      status: 'success',
      message: 'cancel successfully',
    });
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

const getAllClass = async (req, res, next) => {
  //127.0.0.1:5000/api/classes?status=open
  try {
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
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

const getMyRegisClass = async (req, res, next) => {
  //127.0.0.1:5000/api/classes/myRegisteredClass?status=pending,active,cancel
  try {
    const defaultFilter = ['pending', 'active', 'cancel'];
    let userFilter = req.query.status?.split(',');
    if (!userFilter) {
      userFilter = defaultFilter;
    }
    const user_id = req.user.id;
    const myClass = await Regis.findAll({
      where: {
        user_id: user_id,
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
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

const getCalendarClass = async (req, res, next) => {
  try {
    const class_id = req.query.class;

    if (!class_id) {
      return next(new AppError('please provide class id', 400));
    }
    const currentCLass = await Class.findOne({
      where: { id: class_id },
      attributes: ['subject', 'start_date', 'end_date'],
      include: {
        model: Calendar,
        attributes: ['day_of_week', 'open_time', 'close_time'],
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
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

module.exports = {
  registerClass,
  cancelRegisClass,
  getAllClass,
  getMyRegisClass,
  getCalendarClass,
};
