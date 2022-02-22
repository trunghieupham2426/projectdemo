const Sequelize = require('sequelize');
const { Class, User, Regis } = require('./../models');
const AppError = require('./../utils/appError');
const helperFn = require('./../utils/helperFn');
const Op = Sequelize.Op;

const registerClass = async (req, res, next) => {
  try {
    const { class_id } = req.body;
    const user_id = req.user.id;
    const currentClass = await Class.findOne({ where: { id: class_id } });
    if (!currentClass || currentClass.status === 'close') {
      return next(
        new AppError(
          'The class not available or not open at this time , try again later',
          401
        )
      );
    }
    const currentUser = JSON.stringify(
      await User.findOne({
        where: { id: user_id },
        include: [Class],
      }),
      null,
      2
    );

    const listClassIdOfUser = JSON.parse(currentUser).Classes.map((el) => {
      return el.id;
    });

    if (listClassIdOfUser.includes(+class_id)) {
      return next(new AppError('you  already register this class', 401));
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
    const { class_id } = req.body;
    const cancelClass = await Regis.findOne({
      where: { class_id: class_id, status: 'pending' },
    });
    if (!cancelClass) {
      return next(new AppError(`can not cancel this class`, 401));
    }
    cancelClass.status = 'cancel';
    cancelClass.save();
    res.status(200).json({
      status: 'success',
      message: 'cancel successfully',
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getAllClass = async (req, res, next) => {
  try {
    const allClass = await Class.findAll();
    res.send(allClass);
  } catch (err) {
    // console.log(err);s
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
    console.log(err);
    next(err);
  }
};

const getCalendarClass = async (req, res, next) => {
  try {
    const class_id = req.params.id;
    console.log(class_id);
  } catch (err) {}
};

module.exports = {
  registerClass: registerClass,
  cancelRegisClass: cancelRegisClass,
  getAllClass: getAllClass,
  getMyRegisClass: getMyRegisClass,
  getCalendarClass: getCalendarClass,
};
